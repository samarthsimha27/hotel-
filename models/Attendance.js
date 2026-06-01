import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: [true, 'Employee name is required for daily rosters.'],
      trim: true
    },
    status: {
      type: String,
      required: [true, 'Clearance duty status is required.'],
      enum: ['Present', 'Absent']
    },
    date: {
      type: String, // Stored as YYYY-MM-DD
      required: [true, 'Roster calendar logging date is required.']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Attendance', AttendanceSchema);
