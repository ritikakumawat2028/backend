const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  phone: { type: String, trim: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  addresses: [{
    fullName: String, phone: String, addressLine1: String, addressLine2: String,
    city: String, state: String, pincode: String, country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
