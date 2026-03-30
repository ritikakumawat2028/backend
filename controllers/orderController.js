const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, paymentId, razorpayOrderId, stripePaymentIntentId } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No order items' });

    const settings = await Settings.findOne() || { shippingCharges: 99, freeShippingMinOrder: 12000, taxRate: 18 };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCharges = subtotal >= settings.freeShippingMinOrder ? 0 : settings.shippingCharges;
    const tax = Math.round(subtotal * (settings.taxRate / 100));
    const discount = req.body.discount || 0;
    const totalAmount = subtotal + shippingCharges + tax - discount;

    const order = await Order.create({
      user: req.user._id, items, shippingAddress, paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentId, razorpayOrderId, stripePaymentIntentId,
      subtotal, shippingCharges, tax, discount, couponCode, totalAmount,
      statusHistory: [{ status: 'placed', note: 'Order placed' }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null, couponDiscount: 0 });

    res.status(201).json({ success: true, order });
  } catch (error) { next(error); }
};

// Get user orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) { next(error); }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role === 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) { next(error); }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.orderStatus = status;
    if (startDate && endDate) query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}`, date: new Date() });
    if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = 'paid'; }
    if (status === 'cancelled') { order.cancelReason = note || 'Cancelled by admin'; }

    await order.save();
    res.json({ success: true, order });
  } catch (error) { next(error); }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel shipped/delivered order' });
    }

    order.orderStatus = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by user';
    order.statusHistory.push({ status: 'cancelled', note: order.cancelReason });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, sold: -item.quantity } });
    }
    await order.save();
    res.json({ success: true, order });
  } catch (error) { next(error); }
};
