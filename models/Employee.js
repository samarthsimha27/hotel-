import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please specify the employee name.'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Please specify the operational role.'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Employee corporate ID is required.'],
      unique: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      default: 'Active',
      enum: ['Active', 'On Leave', 'Off Duty']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Employee', EmployeeSchema);
