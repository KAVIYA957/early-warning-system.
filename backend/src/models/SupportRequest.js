import mongoose from 'mongoose';

const supportRequestSchema = new mongoose.Schema({
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
  rollNo: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  requestMessage: {
    type: String,
    default: 'Student requested advisory follow-up session regarding academic progress.',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved', 'Cancelled'],
    default: 'Pending',
  },
  assignedMentorId: {
    type: String,
    default: 'M1',
  },
  responseNote: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);
export default SupportRequest;
