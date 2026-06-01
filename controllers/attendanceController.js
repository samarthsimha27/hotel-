import Attendance from '../models/Attendance.js';

// @desc    Get all attendance logs from MongoDB
// @route   GET /api/attendance
// @access  Private (Admin Only)
export const getAttendance = async (req, res, next) => {
  try {
    const list = await Attendance.find().sort({ date: -1, employeeName: 1 });
    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark or create attendance entry in MongoDB
// @route   POST /api/attendance
// @access  Private (Admin Only)
export const markAttendance = async (req, res, next) => {
  try {
    const { workerName, employeeName, status, date } = req.body;

    const name = employeeName || workerName;

    if (!name || !status || !date) {
      res.status(400);
      throw new Error('Please specify employeeName, status, and date.');
    }

    // Dynamic Upsert: finds matches by name & date. 
    // If it exists, updates status. If vacant, inserts new log.
    const entry = await Attendance.findOneAndUpdate(
      { employeeName: name, date },
      { status },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Attendance logged successfully in MongoDB.',
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance entry in MongoDB by record ID
// @route   PUT /api/attendance/:id
// @access  Private (Admin Only)
export const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params; // Mongoose _id
    const { status, date } = req.body;

    const att = await Attendance.findByIdAndUpdate(
      id,
      { status, date },
      { new: true, runValidators: true }
    );

    if (!att) {
      res.status(404);
      throw new Error('Attendance entry not found in database.');
    }

    res.status(200).json({
      success: true,
      message: 'Attendance entry modified in MongoDB.',
      data: att
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attendance entry in MongoDB
// @route   DELETE /api/attendance/:id
// @access  Private (Admin Only)
export const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params; // Mongoose _id

    const att = await Attendance.findByIdAndDelete(id);

    if (!att) {
      res.status(404);
      throw new Error('Attendance entry not found in database.');
    }

    res.status(200).json({
      success: true,
      message: 'Attendance entry deleted from MongoDB.',
      data: att
    });
  } catch (error) {
    next(error);
  }
};
