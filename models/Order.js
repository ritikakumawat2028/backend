const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, image: String, price: Number,
  size: String, color: String,
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String, phone: String, addressLine1: String, addressLine2: String,
    city: String, state: String, pincode: String, country: { type: String, default: 'India' },
  },
  paymentMethod: { type: String, enum: ['razorpay', 'stripe', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentId: String,
  razorpayOrderId: String,
  stripePaymentIntentId: String,
  subtotal: { type: Number, required: true },
  shippingCharges: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  totalAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
  },
  statusHistory: [{
    status: String, date: { type: Date, default: Date.now }, note: String,
  }],
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelReason: String,
  returnReason: String,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'KF' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
module.exports = mongoose.model('Order', orderSchema);
