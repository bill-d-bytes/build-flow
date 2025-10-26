import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

// Generate JWT Token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  
  if (!jwtSecret) {
    throw createError('JWT secret not configured', 500);
  }
  
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpire } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { firstName, lastName, email, password, phone, role, companyName, gstNumber, panNumber, address } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createError('User already exists with this email', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    companyName,
    gstNumber,
    panNumber,
    address
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyName: user.companyName,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { email, password } = req.body;

  // Check if user exists and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(createError('Invalid email or password', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(createError('Account is deactivated', 401));
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  
  if (!isPasswordMatch) {
    return next(createError('Invalid email or password', 401));
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyName: user.companyName,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      token
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { firstName, lastName, phone, companyName, gstNumber, panNumber, address } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    {
      firstName,
      lastName,
      phone,
      companyName,
      gstNumber,
      panNumber,
      address
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user!._id).select('+password');
  
  if (!user) {
    return next(createError('User not found', 404));
  }

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    return next(createError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Validation rules
export const validateRegister = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('role').isIn(['contractor', 'engineer', 'supplier', 'project_manager', 'admin']).withMessage('Invalid role'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.pincode').matches(/^[1-9][0-9]{5}$/).withMessage('Please provide a valid 6-digit pincode')
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];
