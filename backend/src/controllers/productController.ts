import { Request, Response, NextFunction } from 'express';
import { Product, IProduct } from '../models/Product';
import { User } from '../models/User';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { body, query, validationResult } from 'express-validator';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = { isActive: true };
  
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  if (req.query.search) {
    filter.$text = { $search: req.query.search as string };
  }
  
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = parseFloat(req.query.minPrice as string);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }
  }
  
  if (req.query.supplier) {
    filter.supplier = req.query.supplier;
  }
  
  if (req.query.city) {
    filter['location.city'] = new RegExp(req.query.city as string, 'i');
  }
  
  if (req.query.state) {
    filter['location.state'] = new RegExp(req.query.state as string, 'i');
  }

  // Build sort object
  let sort: any = { createdAt: -1 };
  
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'price':
        sort = { price: sortOrder };
        break;
      case 'rating':
        sort = { 'ratings.average': sortOrder };
        break;
      case 'name':
        sort = { name: sortOrder };
        break;
      case 'created':
        sort = { createdAt: sortOrder };
        break;
    }
  }

  const products = await Product.find(filter)
    .populate('supplier', 'firstName lastName companyName email phone')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      products
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id)
    .populate('supplier', 'firstName lastName companyName email phone gstNumber address');

  if (!product) {
    return next(createError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      product
    }
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Suppliers only)
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  // Check if user is a supplier
  if (req.user!.role !== 'supplier') {
    return next(createError('Only suppliers can create products', 403));
  }

  const productData = {
    ...req.body,
    supplier: req.user!._id
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: {
      product
    }
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Product owner or admin)
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(createError('Product not found', 404));
  }

  // Check if user is the product owner or admin
  if (product.supplier.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(createError('Not authorized to update this product', 403));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: {
      product
    }
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Product owner or admin)
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(createError('Product not found', 404));
  }

  // Check if user is the product owner or admin
  if (product.supplier.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(createError('Not authorized to delete this product', 403));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get products by supplier
// @route   GET /api/products/supplier/:supplierId
// @access  Public
export const getProductsBySupplier = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({ 
    supplier: req.params.supplierId,
    isActive: true 
  })
    .populate('supplier', 'firstName lastName companyName email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments({ 
    supplier: req.params.supplierId,
    isActive: true 
  });

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      products
    }
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      categories
    }
  });
});

// Validation rules
export const validateCreateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('category').isIn(['cement_concrete', 'steel_metals', 'bricks_blocks', 'sand_aggregates', 'tiles_flooring', 'paints_chemicals', 'other']).withMessage('Invalid category'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('unit').trim().notEmpty().withMessage('Unit is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('inventory.quantity').isNumeric().withMessage('Quantity must be a number'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('location.pincode').matches(/^[1-9][0-9]{5}$/).withMessage('Please provide a valid 6-digit pincode')
];
