import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Auditing clearance username is required.'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Clearance passphrase is required.']
    },
    role: {
      type: String,
      required: true,
      default: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

// AUTOMATIC PASSWORD HASHING PRE-SAVE HOOK
// Intercepts save operations to dynamically generate salts and encrypt passphrases
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare incoming passphrases
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Admin', AdminSchema);
