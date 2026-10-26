import Student from '../models/Student.js';
import Intervention from '../models/Intervention.js';
import { enrichStudentWithRisk, calculateStudentRisk } from '../services/riskCalculator.js';

/**
 * @route   GET /api/students
 * @desc    Get all students with search, filters, pagination, and calculated risk scores
 * @access  Private (Faculty, Coordinator)
 */
export async function getStudents(req, res, next) {
  try {
    const { search, department, riskLevel, page, limit } = req.query;

    const query = {};

    if (department && department !== 'ALL') {
      query.department = new RegExp(department, 'i');
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { rollNo: searchRegex },
        { id: searchRegex },
      ];
    }

    let students = await Student.find(query).lean();

    // Fetch all interventions to attach to student records
    const allInterventions = await Intervention.find().lean();
    const interventionsByStudent = {};
    for (const inv of allInterventions) {
      if (!interventionsByStudent[inv.studentId]) {
        interventionsByStudent[inv.studentId] = [];
      }
      interventionsByStudent[inv.studentId].push(inv);
    }

    // Attach interventions and enrich with calculated risk scores
    let enrichedStudents = students.map(student => {
      const studentInvs = interventionsByStudent[student.id] || [];
      return enrichStudentWithRisk({
        ...student,
        interventions: studentInvs,
      });
    });

    // Filter by calculated risk level if provided
    if (riskLevel && riskLevel !== 'ALL') {
      enrichedStudents = enrichedStudents.filter(s => s.riskLevel === riskLevel);
    }

    const totalStudents = enrichedStudents.length;

    // Optional pagination
    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      enrichedStudents = enrichedStudents.slice(startIndex, startIndex + limitNum);
    }

    return res.status(200).json({
      success: true,
      count: enrichedStudents.length,
      total: totalStudents,
      students: enrichedStudents,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/students/me
 * @desc    Get current student's personal academic record
 * @access  Private (Student)
 */
export async function getStudentMe(req, res, next) {
  try {
    const user = req.user;
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Endpoint is reserved for authenticated student accounts.',
      });
    }

    const student = await Student.findOne({
      $or: [
        { _id: user.student },
        { id: user.studentId },
        { rollNo: user.rollNo },
      ],
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record could not be found for current account.',
      });
    }

    // Fetch interventions excluding private faculty notes
    const interventions = await Intervention.find({ studentId: student.id })
      .select('-notes') // Exclude private faculty notes
      .lean();

    const enriched = enrichStudentWithRisk({
      ...student,
      interventions,
    });

    return res.status(200).json({
      success: true,
      student: enriched,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/students/:id
 * @desc    Get student record by ID or Roll Number
 * @access  Private (Faculty, Coordinator, or Student for own record)
 */
export async function getStudentById(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    // Student isolation check
    if (user.role === 'student') {
      const isSelf = id === user.studentId || 
                     id === user.rollNo || 
                     id === user.student?.toString() ||
                     id === 'me';
      if (!isSelf) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to view other students’ records.',
        });
      }
    }

    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      query = {
        $or: [
          { id: id },
          { rollNo: id },
        ],
      };
    }

    const student = await Student.findOne(query).lean();
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier "${id}" not found.`,
      });
    }

    // Fetch interventions (redacting private notes if requester is student)
    let interventionQuery = Intervention.find({ studentId: student.id });
    if (user.role === 'student') {
      interventionQuery = interventionQuery.select('-notes');
    }
    const interventions = await interventionQuery.lean();

    const enriched = enrichStudentWithRisk({
      ...student,
      interventions,
    });

    return res.status(200).json({
      success: true,
      student: enriched,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/students/:id/risk
 * @desc    Get calculated risk score and factor breakdown for a student
 * @access  Private (Faculty, Coordinator, or Student for own record)
 */
export async function getStudentRisk(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role === 'student') {
      const isSelf = id === user.studentId || id === user.rollNo || id === user.student?.toString();
      if (!isSelf) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to access another student’s risk evaluation.',
        });
      }
    }

    const student = await Student.findOne({
      $or: [{ id }, { rollNo: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student "${id}" not found.`,
      });
    }

    const riskEvaluation = calculateStudentRisk(student);

    return res.status(200).json({
      success: true,
      studentId: student.id,
      name: student.name,
      rollNo: student.rollNo,
      ...riskEvaluation,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   PATCH /api/students/:id
 * @desc    Update student metrics (attendance, assessment, assignments, etc.)
 * @access  Private (Faculty, Coordinator)
 */
export async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'attendance',
      'attendanceTrend',
      'assessmentAvg',
      'assessmentTrend',
      'missingAssignments',
      'assignmentCompletion',
      'engagementIndex',
      'lastReviewed',
      'assignedMentorId',
      'midtermScore',
      'quizAvg',
    ];

    const sanitizedUpdates = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = updates[key];
      }
    }

    const student = await Student.findOneAndUpdate(
      { $or: [{ id }, { rollNo: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: sanitizedUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student "${id}" not found to update.`,
      });
    }

    const interventions = await Intervention.find({ studentId: student.id }).lean();
    const enriched = enrichStudentWithRisk({
      ...student,
      interventions,
    });

    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully.',
      student: enriched,
    });
  } catch (error) {
    next(error);
  }
}
