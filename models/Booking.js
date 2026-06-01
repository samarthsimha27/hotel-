import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer guest title is required.'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Guest contact number is required.'],
      trim: true
    },
    seatNumber: {
      type: String, // E.g., A1, B2, C3
      required: [true, 'Table seat location coordinate is required.'],
      trim: true
    },
    bookingDate: {
      type: String, // Stored as YYYY-MM-DD
      required: [true, 'Reservation calendar date is required.']
    },
    time: {
      type: String, // Stored as HH:MM
      required: [true, 'Reservation scheduling time is required.']
    },
    guests: {
      type: Number,
      required: true,
      default: 2
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL UNIQUE COMPOUND INDEX: Guarantees that no single seat number
// can ever be booked twice on the exact same calendar date!
BookingSchema.index({ seatNumber: 1, bookingDate: 1 }, { unique: true });

export default mongoose.model('Booking', BookingSchema);
