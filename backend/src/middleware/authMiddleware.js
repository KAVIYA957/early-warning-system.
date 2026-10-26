import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../config/jwtConfig.js';

export async function protect(req, res, next) {
  let token = null;

  // Check Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing. Please sign in.',
    });
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive or suspended. Please contact administrator.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please sign in again.',
      error: error.message,
    });
  }
}

/**
 * Restrict to specific roles: 'faculty', 'coordinator', 'student'
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'unknown'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
}

/**
 * Enforce student isolation:
 * - If user is student, they can ONLY access their own studentId or MongoDB _id
 * - Faculty and coordinator can access any student
 */
export function authorizeStudentOwnership(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (req.user.role === 'faculty' || req.user.role === 'coordinator') {
    return next();
  }

  if (req.user.role === 'student') {
    const requestedId = req.params.id || req.body.studentId;
    const userStudentId = req.user.studentId;
    const userStudentObjId = req.user.student?.toString();
    const userRollNo = req.user.rollNo;

    const isMatch = requestedId === userStudentId || 
                    requestedId === userStudentObjId || 
                    requestedId === userRollNo ||
                    requestedId === 'me';

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are strictly restricted to your own academic record.',
      });
    }

    return next();
  }

  return res.status(403).json({ success: false, message: 'Forbidden.' });
}
