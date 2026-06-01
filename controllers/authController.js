import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Helper to generate JWT token signatures
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      role: user.role,
      department: user.role === 'Admin' ? 'Executive Boardroom' : 'Guest Relations'
    },
    process.env.JWT_SECRET || 'legacygrandhotel',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user session in MongoDB
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Please specify both username and password.');
    }

    const normUsername = username.toLowerCase().trim();
    
    // Check if user already exists in MongoDB
    const userExists = await Admin.findOne({ username: normUsername });
    if (userExists) {
      res.status(400);
      throw new Error('Username clearance credentials already assigned.');
    }

    // Save new user (hashing occurs automatically via Mongoose Pre-save hook!)
    const newUser = await Admin.create({
      username: normUsername,
      password,
      role: role && role.toLowerCase() === 'admin' ? 'Admin' : 'Customer'
    });

    res.status(201).json({
      success: true,
      message: 'Imperial credentials registered in MongoDB.',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
      },
      token: generateToken(newUser)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user credentials via MongoDB & issue JWT
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Please supply both username and passphrase.');
    }

    const normUsername = username.toLowerCase().trim();
    
    // Query MongoDB Admin collection
    const user = await Admin.findOne({ username: normUsername });

    // Validate password using our Mongoose schema instance method
    if (user && (await user.comparePassword(password))) {
      res.status(200).json({
        success: true,
        message: 'Imperial access cleared via MongoDB.',
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        },
        token: generateToken(user)
      });
    } else {
      res.status(401);
      throw new Error('Invalid clearance credentials. Access denied.');
    }
  } catch (error) {
    next(error);
  }
};
