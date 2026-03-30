const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: [true, 'Description is required'] },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  sizes: [{ size: String, stock: { type: Number, default: 0 } }],
  colors: [{ name: String, hexCode: String }],
  gender: { type: String, enum: ['men', 'women', 'kids', 'unisex'], default: 'unisex' },
  material: { type: String, default: '' },
  specifications: { type: Map, of: String },
  stock: { type: Number, required: true, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1, gender: 1, price: 1 });
productSchema.index({ isFeatured: 1, isTrending: 1, isBestSeller: 1 });

module.exports = mongoose.model('Product', productSchema);
