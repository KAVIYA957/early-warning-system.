import express from 'express';
import {
  getStudents,
  getStudentMe,
  getStudentById,
  getStudentRisk,
  updateStudent,
} from '../controllers/studentController.js';
import { protect, authorize, authorizeStudentOwnership } from '../middleware/authMiddleware.js';

const router = express.Router();

// Faculty/Coordinator only - list all students
router.get('/', protect, authorize('faculty', 'coordinator'), getStudents);

// Student only - get personal profile
router.get('/me', protect, authorize('student'), getStudentMe);

// Student ownership enforced: students can only access their own record
router.get('/:id', protect, authorizeStudentOwnership, getStudentById);
router.get('/:id/risk', protect, authorizeStudentOwnership, getStudentRisk);

// Faculty/Coordinator only - update student metrics
router.patch('/:id', protect, authorize('faculty', 'coordinator'), updateStudent);

export default router;
