import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Culinary menu item name is required.'],
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Menu classification category is required.'],
      enum: ['Starters', 'Mains', 'Desserts', 'Beverages']
    },
    price: {
      type: Number,
      required: [true, 'Imperial menu item price is required.'],
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Menu', MenuSchema);
