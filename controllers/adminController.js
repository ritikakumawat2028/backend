const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5, $gt: 0 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly sales (last 12 months)
    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
    const topProducts = await Product.find().sort({ sold: -1 }).limit(5);

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, pendingOrders, cancelledOrders, totalRevenue, lowStockProducts, outOfStock },
      monthlySales, recentOrders, topProducts,
    });
  } catch (error) { next(error); }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = { role: 'user' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

// Block/unblock user
exports.toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, user, message: user.isBlocked ? 'User blocked' : 'User unblocked' });
  } catch (error) { next(error); }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};
