import SupportRequest from '../models/SupportRequest.js';
import Student from '../models/Student.js';

/**
 * @route   POST /api/support-requests
 * @desc    Submit a mentor support request
 * @access  Private (Student)
 */
export async function createSupportRequest(req, res, next) {
  try {
    const user = req.user;
    const { requestMessage, assignedMentorId } = req.body;

    let student = null;
    if (user.role === 'student') {
      student = await Student.findOne({
        $or: [{ _id: user.student }, { id: user.studentId }, { rollNo: user.rollNo }],
      });
    } else {
      const studentId = req.body.studentId;
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required.',
        });
      }
      student = await Student.findOne({
        $or: [{ id: studentId }, { rollNo: studentId }],
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record could not be found to associate with support request.',
      });
    }

    const newRequest = await SupportRequest.create({
      student: student._id,
      studentId: student.id,
      rollNo: student.rollNo,
      studentName: student.name,
      requestMessage: requestMessage ? requestMessage.trim() : 'Advisory follow-up requested regarding academic progress.',
      status: 'Pending',
      assignedMentorId: assignedMentorId || student.assignedMentorId || 'M1',
    });

    return res.status(201).json({
      success: true,
      message: 'Your mentor support request has been recorded successfully.',
      supportRequest: newRequest,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/support-requests/me
 * @desc    Get support requests for the authenticated student
 * @access  Private (Student)
 */
export async function getSupportRequestsMe(req, res, next) {
  try {
    const user = req.user;
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Reserved for authenticated student accounts.',
      });
    }

    const requests = await SupportRequest.find({
      $or: [
        { student: user.student },
        { studentId: user.studentId },
        { rollNo: user.rollNo },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      supportRequests: requests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/support-requests
 * @desc    Get all support requests across students
 * @access  Private (Faculty, Coordinator)
 */
export async function getSupportRequests(req, res, next) {
  try {
    const { status, studentId } = req.query;
    const query = {};

    if (status && status !== 'ALL') query.status = status;
    if (studentId) query.studentId = studentId;

    const requests = await SupportRequest.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      supportRequests: requests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   PATCH /api/support-requests/:id
 * @desc    Update support request status or response note
 * @access  Private (Faculty, Coordinator)
 */
export async function updateSupportRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { status, responseNote } = req.body;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { _id: id };

    const request = await SupportRequest.findOne(query);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Support request not found.',
      });
    }

    if (status) request.status = status;
    if (responseNote !== undefined) request.responseNote = responseNote;

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Support request status updated to "${request.status}".`,
      supportRequest: request,
    });
  } catch (error) {
    next(error);
  }
}
