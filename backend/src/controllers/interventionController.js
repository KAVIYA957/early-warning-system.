import Intervention from '../models/Intervention.js';
import Student from '../models/Student.js';

/**
 * @route   GET /api/interventions
 * @desc    Get interventions. Faculty see all; students see ONLY their own records (without private notes).
 * @access  Private
 */
export async function getInterventions(req, res, next) {
  try {
    const user = req.user;
    const { studentId, status, mentorId } = req.query;

    const query = {};

    if (user.role === 'student') {
      // Strictly isolate to student's own records
      query.studentId = user.studentId;
    } else {
      if (studentId) query.studentId = studentId;
      if (status && status !== 'ALL') query.status = status;
      if (mentorId && mentorId !== 'ALL') query.mentorId = mentorId;
    }

    let interventionsQuery = Intervention.find(query).sort({ createdAt: -1 });

    // Redact private notes for student accounts
    if (user.role === 'student') {
      interventionsQuery = interventionsQuery.select('-notes');
    }

    const interventions = await interventionsQuery.lean();

    return res.status(200).json({
      success: true,
      count: interventions.length,
      interventions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/interventions
 * @desc    Record an academic intervention for a student
 * @access  Private (Faculty, Coordinator)
 */
export async function createIntervention(req, res, next) {
  try {
    const {
      studentId,
      type,
      date,
      status,
      mentorId,
      observation,
      actionTaken,
      followUpDate,
      actionItems,
      notes,
    } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required to record an intervention.',
      });
    }

    const student = await Student.findOne({
      $or: [{ id: studentId }, { rollNo: studentId }, { _id: studentId.match(/^[0-9a-fA-F]{24}$/) ? studentId : null }],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student "${studentId}" not found.`,
      });
    }

    const compiledNotes = notes || (observation ? `${observation} | Action: ${actionTaken || 'Review scheduled'}` : 'Advisory session recorded.');

    const intervention = await Intervention.create({
      id: `INT-${Date.now().toString().slice(-4)}`,
      student: student._id,
      studentId: student.id,
      type: type || 'Academic Counselling',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Follow-up Required',
      mentorId: mentorId || student.assignedMentorId || 'M1',
      faculty: req.user._id,
      observation: observation || '',
      actionTaken: actionTaken || '',
      followUpDate: followUpDate || null,
      actionItems: Array.isArray(actionItems) && actionItems.length > 0 
        ? actionItems 
        : [actionTaken || 'Advisory follow-up session', followUpDate ? `Follow-up date: ${followUpDate}` : 'Scheduled review'],
      notes: compiledNotes,
    });

    // Update student's lastReviewed date
    await Student.findByIdAndUpdate(student._id, {
      lastReviewed: date || new Date().toISOString().split('T')[0],
    });

    return res.status(201).json({
      success: true,
      message: `Intervention recorded successfully for ${student.name}.`,
      intervention,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   PATCH /api/interventions/:id
 * @desc    Update intervention status or action items
 * @access  Private (Faculty, Coordinator)
 */
export async function updateIntervention(req, res, next) {
  try {
    const { id } = req.params;
    const { status, followUpDate, actionItems, notes, actionTaken } = req.body;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };

    const intervention = await Intervention.findOne(query);
    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: `Intervention with ID "${id}" was not found.`,
      });
    }

    if (status) intervention.status = status;
    if (followUpDate !== undefined) intervention.followUpDate = followUpDate;
    if (actionItems && Array.isArray(actionItems)) intervention.actionItems = actionItems;
    if (notes !== undefined) intervention.notes = notes;
    if (actionTaken !== undefined) intervention.actionTaken = actionTaken;

    await intervention.save();

    return res.status(200).json({
      success: true,
      message: `Intervention status updated to "${intervention.status}".`,
      intervention,
    });
  } catch (error) {
    next(error);
  }
}
