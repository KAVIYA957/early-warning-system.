import express from 'express';
import {
  getInterventions,
  createIntervention,
  updateIntervention,
} from '../controllers/interventionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Faculty see all; students see only their own (without private notes)
router.get('/', protect, getInterventions);

// Faculty/Coordinator only - record and update interventions
router.post('/', protect, authorize('faculty', 'coordinator'), createIntervention);
router.patch('/:id', protect, authorize('faculty', 'coordinator'), updateIntervention);

export default router;
