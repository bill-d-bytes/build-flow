import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  validateRegister,
  validateLogin,
  validateChangePassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validate(validateRegister), registerUser);
router.post('/login', validate(validateLogin), loginUser);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, validate(validateChangePassword), updateProfile);
router.put('/change-password', authenticateToken, validate(validateChangePassword), changePassword);

export default router;
