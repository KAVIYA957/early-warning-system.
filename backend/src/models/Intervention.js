import mongoose from 'mongoose';

const interventionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `INT-${Date.now().toString().slice(-4)}`,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required'],
    index: true,
  },
  studentId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Intervention type is required'],
    default: 'Academic Counselling',
    trim: true,
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0],
  },
  status: {
    type: String,
    enum: ['Follow-up Required', 'Open', 'In Progress', 'Escalated', 'Completed', 'Resolved'],
    default: 'Follow-up Required',
  },
  mentorId: {
    type: String,
    default: 'M1',
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  actionItems: {
    type: [String],
    default: [],
  },
  observation: {
    type: String,
    default: '',
    trim: true,
  },
  actionTaken: {
    type: String,
    default: '',
    trim: true,
  },
  followUpDate: {
    type: String,
    default: null,
  },
  // Private faculty notes - never exposed to students
  notes: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

const Intervention = mongoose.model('Intervention', interventionSchema);
export default Intervention;
