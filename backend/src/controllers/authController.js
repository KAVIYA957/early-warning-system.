import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { getJwtSecret, getJwtExpiresIn } from '../config/jwtConfig.js';

function generateToken(user) {
  const secret = getJwtSecret();
  const expiresIn = getJwtExpiresIn();
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      studentId: user.studentId,
      rollNo: user.rollNo,
    },
    secret,
    { expiresIn }
  );
}

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token (supports email for faculty/student, or roll number for students)
 * @access  Public
 */
export async function login(req, res, next) {
  try {
    const { identifier, email, rollNo, password, role } = req.body;
    const loginId = (identifier || email || rollNo || '').trim();
    const candidatePassword = (password || '').trim();

    if (!loginId || !candidatePassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an institutional identifier / email and password.',
      });
    }

    // Search user by email, rollNo, or studentId
    const query = {
      $or: [
        { email: loginId.toLowerCase() },
        { rollNo: loginId },
        { studentId: loginId },
      ],
    };

    if (role && (role === 'faculty' || role === 'coordinator')) {
      query.role = role;
    } else if (role === 'student') {
      query.role = 'student';
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Account credentials for "${loginId}" were not recognized. Please check your details.`,
      });
    }

    // Verify password (supports hashed password, demo shortcuts, and default seeded passwords)
    const isMatch = (await user.comparePassword(candidatePassword)) || 
                    candidatePassword === 'demo' || 
                    candidatePassword === '••••••••••••' ||
                    candidatePassword === 'faculty123' ||
                    candidatePassword === 'coordinator123' ||
                    candidatePassword === 'student123';
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please verify and try again.',
      });
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact system administrator.',
      });
    }

    const token = generateToken(user);

    // If student user, attach student record details
    let studentData = null;
    if (user.role === 'student' && (user.student || user.studentId)) {
      studentData = await Student.findOne({
        $or: [
          { _id: user.student },
          { id: user.studentId },
          { rollNo: user.rollNo },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      message: `Signed in successfully as ${user.name}.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        rollNo: user.rollNo,
        student: studentData,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin / onboarding)
 * @access  Public (or Protected in production)
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role, rollNo, department, studentId, provisioningKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const requestedRole = (role || 'student').toLowerCase().trim();

    // Privilege Escalation Prevention:
    // Only coordinator/admin can create faculty or coordinator accounts.
    if (requestedRole === 'faculty' || requestedRole === 'coordinator') {
      const isAuthorizedProvisioner = (req.user && req.user.role === 'coordinator') ||
        (process.env.ADMIN_PROVISIONING_KEY && provisioningKey === process.env.ADMIN_PROVISIONING_KEY);

      if (!isAuthorizedProvisioner) {
        return res.status(403).json({
          success: false,
          message: 'Public registration is restricted to enrolled students. Faculty and coordinator accounts must be provisioned by an administrator.',
        });
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    let linkedStudent = null;
    if (requestedRole === 'student') {
      const cleanRoll = (rollNo || studentId || '').trim();
      if (!cleanRoll) {
        return res.status(400).json({
          success: false,
          message: 'Student Roll Number or Student ID is required for student account registration.',
        });
      }

      linkedStudent = await Student.findOne({
        $or: [{ rollNo: cleanRoll }, { id: cleanRoll }],
      });

      if (!linkedStudent) {
        return res.status(404).json({
          success: false,
          message: `Student identifier "${cleanRoll}" was not found in institutional records. Only enrolled students may create student accounts.`,
        });
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: requestedRole,
      rollNo: requestedRole === 'student' ? linkedStudent.rollNo : null,
      studentId: requestedRole === 'student' ? linkedStudent.id : null,
      student: requestedRole === 'student' ? linkedStudent._id : null,
      department: department || linkedStudent?.department || 'Computer Science & Engineering',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        rollNo: user.rollNo,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private
 */
export async function getMe(req, res, next) {
  try {
    const user = req.user;
    let studentData = null;

    if (user.role === 'student') {
      studentData = await Student.findOne({
        $or: [
          { _id: user.student },
          { id: user.studentId },
          { rollNo: user.rollNo },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        rollNo: user.rollNo,
        student: studentData,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/auth/logout
 * @desc    Sign out
 * @access  Private
 */
export async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  });
}
