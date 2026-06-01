import Menu from '../models/Menu.js';

// @desc    Get all culinary menu items from MongoDB
// @route   GET /api/menu
// @access  Public
export const getMenu = async (req, res, next) => {
  try {
    const list = await Menu.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new culinary menu item in MongoDB
// @route   POST /api/menu
// @access  Private (Admin Only)
export const createMenuItem = async (req, res, next) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
      res.status(400);
      throw new Error('Please specify name, category, and price for the menu item.');
    }

    const itemExists = await Menu.findOne({ name });
    if (itemExists) {
      res.status(400);
      throw new Error(`Menu item '${name}' already registered in database.`);
    }

    const item = await Menu.create({
      name,
      category,
      price: parseFloat(price)
    });

    res.status(201).json({
      success: true,
      message: 'Culinary menu item registered successfully in MongoDB.',
      data: item
    });
  } catch (error) {
    next(error);
  }
};
