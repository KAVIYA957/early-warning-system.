import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Student ID (e.g. STU-2026-001) is required'],
    unique: true,
    trim: true,
    index: true,
  },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  department: {
    type: String,
    default: 'Computer Science',
    trim: true,
  },
  semester: {
    type: String,
    default: 'Semester 5',
    trim: true,
  },
  section: {
    type: String,
    default: 'CS-A',
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  assignedMentorId: {
    type: String,
    default: 'M1',
  },
  lastReviewed: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100,
  },
  attendanceTrend: {
    type: [Number],
    default: [100, 100, 100, 100],
  },
  assessmentAvg: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100,
  },
  assessmentTrend: {
    type: [Number],
    default: [100, 100, 100, 100],
  },
  midtermScore: {
    type: Number,
    default: 70,
  },
  quizAvg: {
    type: Number,
    default: 70,
  },
  assignmentCompletion: {
    type: Number,
    default: 100,
  },
  missingAssignments: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  totalAssignments: {
    type: Number,
    default: 8,
  },
  engagementIndex: {
    type: Number,
    default: 75,
  },
  lmsLastActiveDaysAgo: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual populate for interventions
studentSchema.virtual('interventions', {
  ref: 'Intervention',
  localField: '_id',
  foreignField: 'student',
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
