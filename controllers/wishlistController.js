const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price originalPrice discount images rating numReviews stock brand');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json({ success: true, wishlist });
  } catch (error) { next(error); }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    if (wishlist.products.includes(req.body.productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
    wishlist.products.push(req.body.productId);
    await wishlist.save();
    res.json({ success: true, wishlist });
  } catch (error) { next(error); }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
    await wishlist.save();
    res.json({ success: true, wishlist });
  } catch (error) { next(error); }
};
