import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['faculty', 'coordinator', 'student'],
    default: 'faculty',
    required: true,
  },
  studentId: {
    type: String,
    trim: true,
    default: null,
  },
  rollNo: {
    type: String,
    trim: true,
    default: null,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null,
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering',
  },
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exclude password field from JSON representation by default
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
