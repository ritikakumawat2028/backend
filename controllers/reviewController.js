const Review = require('../models/Review');
const Product = require('../models/Product');

// Get product reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
      .populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) { next(error); }
};

// Add review
exports.addReview = async (req, res, next) => {
  try {
    const existing = await Review.findOne({ user: req.user._id, product: req.params.productId });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this product' });

    const review = await Review.create({ user: req.user._id, product: req.params.productId, ...req.body });

    // Update product rating
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    await Product.findByIdAndUpdate(req.params.productId, { rating: Math.round(avgRating * 10) / 10, numReviews: reviews.length });

    res.status(201).json({ success: true, review });
  } catch (error) { next(error); }
};

// Get all reviews (admin)
exports.getAllReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const reviews = await Review.find(query).populate('user', 'name email').populate('product', 'name').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) { next(error); }
};

// Moderate review (admin)
exports.moderateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Recalculate rating
    const reviews = await Review.find({ product: review.product, status: 'approved' });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await Product.findByIdAndUpdate(review.product, { rating: Math.round(avgRating * 10) / 10, numReviews: reviews.length });

    res.json({ success: true, review });
  } catch (error) { next(error); }
};

// Delete review (admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) { next(error); }
};
