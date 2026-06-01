import jwt from 'jsonwebtoken';

// JWT Token validation protection
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'legacygrandhotel');

      // Attach user payload metadata to request context
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        department: decoded.department
      };

      return next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized: signature verification failed.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized: clearance token is vacant.');
  }
};

// Admin role validation check
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  } else {
    res.status(403);
    throw new Error('Forbidden: Admin clearance required.');
  }
};
