const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (!coupon.isValid()) return res.status(400).json({ success: false, message: 'Coupon expired or usage limit reached' });
    if (orderTotal < coupon.minOrderValue) {
      return res.status(400).json({ success: false, message: `Minimum order value is ₹${coupon.minOrderValue}` });
    }

    let discount = coupon.discountType === 'percentage'
      ? Math.round(orderTotal * (coupon.discountValue / 100))
      : coupon.discountValue;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;

    res.json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue }, discount });
  } catch (error) { next(error); }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) { next(error); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) { next(error); }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon });
  } catch (error) { next(error); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) { next(error); }
};
