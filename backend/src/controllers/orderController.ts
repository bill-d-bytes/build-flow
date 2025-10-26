import { Request, Response, NextFunction } from 'express';
import { Order, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { items, shippingAddress, billingAddress, notes } = req.body;

  // Validate products and calculate total
  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(createError(`Product with ID ${item.product} not found`, 404));
    }

    if (!product.isActive) {
      return next(createError(`Product ${product.name} is not available`, 400));
    }

    if (product.inventory.quantity < item.quantity) {
      return next(createError(`Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    validatedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      unit: product.unit
    });
  }

  // Create order
  const order = await Order.create({
    customer: req.user!._id,
    items: validatedItems,
    totalAmount,
    shippingAddress,
    billingAddress,
    notes
  });

  // Update product inventory
  for (const item of validatedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { 'inventory.quantity': -item.quantity },
      $set: { 'inventory.lastUpdated': new Date() }
    });
  }

  // Populate order with product and customer details
  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'firstName lastName email phone')
    .populate('items.product', 'name images specifications');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order: populatedOrder
    }
  });
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ customer: req.user!._id })
    .populate('items.product', 'name images price unit')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ customer: req.user!._id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      orders
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'firstName lastName email phone companyName')
    .populate('items.product', 'name images specifications price unit supplier')
    .populate('items.product.supplier', 'firstName lastName companyName email phone');

  if (!order) {
    return next(createError('Order not found', 404));
  }

  // Check if user is the order owner or admin
  if (order.customer._id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(createError('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      order
    }
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin or Supplier)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status, trackingNumber, estimatedDelivery, notes } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(createError('Order not found', 404));
  }

  // Check authorization
  if (req.user!.role !== 'admin' && req.user!.role !== 'supplier') {
    return next(createError('Not authorized to update order status', 403));
  }

  // Update order
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status,
      trackingNumber,
      estimatedDelivery,
      notes: notes || order.notes
    },
    { new: true, runValidators: true }
  )
    .populate('customer', 'firstName lastName email phone')
    .populate('items.product', 'name images');

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: {
      order: updatedOrder
    }
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(createError('Order not found', 404));
  }

  // Check if user is the order owner
  if (order.customer.toString() !== req.user!._id.toString()) {
    return next(createError('Not authorized to cancel this order', 403));
  }

  // Check if order can be cancelled
  if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
    return next(createError('Order cannot be cancelled', 400));
  }

  // Update order status
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );

  // Restore product inventory
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { 'inventory.quantity': item.quantity },
      $set: { 'inventory.lastUpdated': new Date() }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: {
      order: updatedOrder
    }
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private (Admin)
export const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user!.role !== 'admin') {
    return next(createError('Not authorized', 403));
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = {};
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }

  const orders = await Order.find(filter)
    .populate('customer', 'firstName lastName email phone companyName')
    .populate('items.product', 'name images price unit')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      orders
    }
  });
});

// Validation rules
export const validateCreateOrder = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Shipping street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.pincode').matches(/^[1-9][0-9]{5}$/).withMessage('Please provide a valid 6-digit pincode'),
  body('shippingAddress.contactName').trim().notEmpty().withMessage('Contact name is required'),
  body('shippingAddress.contactPhone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number')
];
