import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  unit: string;
}

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    contactName: string;
    contactPhone: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentId?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required']
  }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Shipping street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Shipping city is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Shipping state is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Shipping pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      required: [true, 'Shipping country is required'],
      default: 'India',
      trim: true
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    }
  },
  billingAddress: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    }
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  paymentId: {
    type: String,
    trim: true
  },
  shippingMethod: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for formatted total amount
OrderSchema.virtual('formattedTotalAmount').get(function() {
  return `₹${this.totalAmount.toLocaleString('en-IN')}`;
});

// Virtual for item count
OrderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
