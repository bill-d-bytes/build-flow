import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Construction Material Supply API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/change-password': 'Change password'
      },
      products: {
        'GET /api/products': 'Get all products (with filters)',
        'GET /api/products/:id': 'Get single product',
        'POST /api/products': 'Create new product (suppliers only)',
        'PUT /api/products/:id': 'Update product',
        'DELETE /api/products/:id': 'Delete product',
        'GET /api/products/categories': 'Get product categories',
        'GET /api/products/supplier/:supplierId': 'Get products by supplier'
      },
      orders: {
        'POST /api/orders': 'Create new order',
        'GET /api/orders': 'Get user orders',
        'GET /api/orders/:id': 'Get single order',
        'PUT /api/orders/:id/status': 'Update order status (admin/supplier)',
        'PUT /api/orders/:id/cancel': 'Cancel order',
        'GET /api/orders/all': 'Get all orders (admin only)'
      }
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
