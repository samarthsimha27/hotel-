import Bill from '../models/Bill.js';

// @desc    Get all POS bills and checkout sheets from MongoDB
// @route   GET /api/bills
// @access  Private (Admin Only)
export const getBills = async (req, res, next) => {
  try {
    const list = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new invoice checkout record in MongoDB
// @route   POST /api/bills
// @access  Private (Admin & Customer)
export const createBill = async (req, res, next) => {
  try {
    const { customerName, items, subtotal, gst, grandTotal, total, billNumber, date } = req.body;

    if (!customerName || !items || !subtotal) {
      res.status(400);
      throw new Error('Please provide customerName, items, and subtotal.');
    }

    const finalTotal = total || grandTotal;

    if (!finalTotal) {
      res.status(400);
      throw new Error('Please specify the grand total of the transaction.');
    }

    // Save invoice to MongoDB
    const compiledBill = await Bill.create({
      billNumber: billNumber || `LGH-B-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName,
      date: date || new Date().toISOString().split('T')[0],
      items,
      subtotal: parseFloat(subtotal),
      gst: parseFloat(gst) || parseFloat(subtotal) * 0.05,
      total: parseFloat(finalTotal)
    });

    res.status(201).json({
      success: true,
      message: 'POS bill registered and saved in MongoDB successfully.',
      data: compiledBill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/void a bill record in MongoDB by billNumber
// @route   DELETE /api/bills/:id
// @access  Private (Admin Only)
export const deleteBill = async (req, res, next) => {
  try {
    const { id } = req.params; // corporate billNumber

    const voided = await Bill.findOneAndDelete({ billNumber: id });

    if (!voided) {
      res.status(404);
      throw new Error('Billing record not found in database.');
    }

    res.status(200).json({
      success: true,
      message: 'Billing record voided and removed from MongoDB.',
      data: voided
    });
  } catch (error) {
    next(error);
  }
};
