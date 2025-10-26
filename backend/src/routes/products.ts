import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySupplier,
  getCategories,
  validateCreateProduct
} from '../controllers/productController';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/categories', getCategories);
router.get('/supplier/:supplierId', getProductsBySupplier);
router.get('/:id', getProduct);

// Protected routes (Suppliers only)
router.post('/', authenticateToken, authorizeRoles('supplier'), validate(validateCreateProduct), createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
