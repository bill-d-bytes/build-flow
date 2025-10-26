import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  validateCreateOrder
} from '../controllers/orderController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Protected routes
router.post('/', authenticateToken, validate(validateCreateOrder), createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/all', authenticateToken, authorizeRoles('admin'), getAllOrders);
router.get('/:id', authenticateToken, getOrder);
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'supplier'), updateOrderStatus);
router.put('/:id/cancel', authenticateToken, cancelOrder);

export default router;
