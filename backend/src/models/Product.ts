import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  category: 'cement_concrete' | 'steel_metals' | 'bricks_blocks' | 'sand_aggregates' | 'tiles_flooring' | 'paints_chemicals' | 'other';
  subcategory?: string;
  brand?: string;
  productModel?: string;
  specifications: {
    dimensions?: string;
    weight?: string;
    color?: string;
    material?: string;
    grade?: string;
    strength?: string;
    [key: string]: any; // Allow additional specifications
  };
  price: number;
  unit: string; // per bag, per ton, per piece, per sq.ft, etc.
  currency: string;
  images: string[];
  supplier: mongoose.Types.ObjectId;
  inventory: {
    quantity: number;
    minQuantity: number;
    maxQuantity: number;
    isInStock: boolean;
    lastUpdated: Date;
  };
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['cement_concrete', 'steel_metals', 'bricks_blocks', 'sand_aggregates', 'tiles_flooring', 'paints_chemicals', 'other'],
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  productModel: {
    type: String,
    trim: true,
    maxlength: [100, 'Product model cannot exceed 100 characters']
  },
  specifications: {
    type: Map,
    of: Schema.Types.Mixed
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supplier is required']
  },
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    minQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Minimum quantity cannot be negative']
    },
    maxQuantity: {
      type: Number,
      default: 1000,
      min: [0, 'Maximum quantity cannot be negative']
    },
    isInStock: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ supplier: 1 });
ProductSchema.index({ 'inventory.isInStock': 1 });
ProductSchema.index({ 'ratings.average': -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Virtual for stock status
ProductSchema.virtual('stockStatus').get(function() {
  if (this.inventory.quantity === 0) return 'Out of Stock';
  if (this.inventory.quantity <= this.inventory.minQuantity) return 'Low Stock';
  return 'In Stock';
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
