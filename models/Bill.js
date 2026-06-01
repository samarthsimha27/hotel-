import mongoose from 'mongoose';

const BillItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const BillSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true,
      default: () => `LGH-B-${Math.floor(10000 + Math.random() * 90000)}`
    },
    customerName: {
      type: String,
      required: [true, 'Customer guest identification is required.'],
      trim: true
    },
    items: {
      type: [BillItemSchema],
      required: [true, 'Orders must contain at least one culinary item.'],
      validate: [v => Array.isArray(v) && v.length > 0, 'Cart cannot be empty.']
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    gst: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: String, // Stored as YYYY-MM-DD
      required: true,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Bill', BillSchema);
