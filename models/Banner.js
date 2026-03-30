const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  image: { url: String, publicId: String },
  link: { type: String, default: '' },
  position: { type: String, enum: ['hero', 'promotional', 'seasonal', 'sidebar'], default: 'hero' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
