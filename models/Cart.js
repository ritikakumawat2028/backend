const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  size: String,
  color: String,
  quantity: { type: Number, required: true, min: 1, default: 1 },
  savedForLater: { type: Boolean, default: false },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponDiscount: { type: Number, default: 0 },
}, { timestamps: true });

cartSchema.virtual('subtotal').get(function () {
  return this.items.filter(i => !i.savedForLater).reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Cart', cartSchema);
