import express from 'express';
import {
  createSupportRequest,
  getSupportRequestsMe,
  getSupportRequests,
  updateSupportRequest,
} from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Students submit support request
router.post('/', protect, createSupportRequest);

// Students view their own support requests
router.get('/me', protect, authorize('student'), getSupportRequestsMe);

// Faculty view all support requests
router.get('/', protect, authorize('faculty', 'coordinator'), getSupportRequests);

// Faculty update request status
router.patch('/:id', protect, authorize('faculty', 'coordinator'), updateSupportRequest);

export default router;
