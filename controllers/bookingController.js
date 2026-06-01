import Booking from '../models/Booking.js';

// @desc    Get all table seat maps and reservations from MongoDB
// @route   GET /api/bookings
// @access  Private (Admin & Customer)
export const getBookings = async (req, res, next) => {
  try {
    // 1. Compile baseline Available seat layout matrix (A1 to D4)
    const seatMap = {};
    const rows = ['A', 'B', 'C', 'D'];
    rows.forEach(row => {
      for (let col = 1; col <= 4; col++) {
        const seatId = `${row}${col}`;
        seatMap[seatId] = { status: 'Available', bookingInfo: null };
      }
    });

    // 2. Fetch all reservations logged in MongoDB
    const bookingsList = await Booking.find();

    // 3. Map Mongoose entries onto our layout matrix
    bookingsList.forEach(booking => {
      if (seatMap[booking.seatNumber]) {
        seatMap[booking.seatNumber] = {
          status: 'Booked',
          bookingInfo: {
            customerName: booking.customerName,
            phone: booking.phone,
            date: booking.bookingDate,
            time: booking.time,
            guests: booking.guests
          }
        };
      }
    });

    res.status(200).json({
      success: true,
      data: seatMap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new seat table reservation in MongoDB
// @route   POST /api/bookings
// @access  Private (Customer Only)
export const createBooking = async (req, res, next) => {
  try {
    const { seatId, customerName, phone, date, time, guests } = req.body;

    if (!seatId || !customerName || !phone || !date || !time) {
      res.status(400);
      throw new Error('Please specify seatId, customerName, phone, date, and time.');
    }

    try {
      // Create new booking in MongoDB
      // (Pre-configured compound unique index prevents duplicate bookings!)
      const newBooking = await Booking.create({
        customerName,
        phone,
        seatNumber: seatId,
        bookingDate: date,
        time,
        guests: parseInt(guests) || 2
      });

      res.status(201).json({
        success: true,
        message: `Table ${seatId} successfully secured in MongoDB.`,
        data: newBooking
      });
    } catch (dbErr) {
      // Intercept MongoDB indexing collisions (Code 11000 duplicate keys)
      if (dbErr.code === 11000) {
        res.status(400);
        throw new Error(`Table ${seatId} is already booked on ${date}.`);
      }
      throw dbErr;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Release or cancel a seat reservation in MongoDB
// @route   DELETE /api/bookings/:id
// @access  Private (Customer Only)
export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params; // corporate seatId (e.g. A1, B2)

    // Find and delete reservation from MongoDB
    const deleted = await Booking.findOneAndDelete({ seatNumber: id });

    if (!deleted) {
      res.status(404);
      throw new Error(`No active reservation found for table ${id}.`);
    }

    res.status(200).json({
      success: true,
      message: `Table ${id} has been released successfully from MongoDB.`,
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};
