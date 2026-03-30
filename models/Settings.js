const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'KICKS FOOTWEAR' },
  logo: { url: String, publicId: String },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  shippingCharges: { type: Number, default: 99 },
  freeShippingMinOrder: { type: Number, default: 12000 },
  taxRate: { type: Number, default: 18 },
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
