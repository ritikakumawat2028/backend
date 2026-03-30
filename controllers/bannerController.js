const Banner = require('../models/Banner');

exports.getBanners = async (req, res, next) => {
  try {
    const { position } = req.query;
    let query = { isActive: true };
    if (position) query.position = position;
    const banners = await Banner.find(query).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (error) { next(error); }
};

exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({ success: true, banners });
  } catch (error) { next(error); }
};

exports.createBanner = async (req, res, next) => {
  try {
    if (req.file) req.body.image = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) { next(error); }
};

exports.updateBanner = async (req, res, next) => {
  try {
    if (req.file) req.body.image = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, banner });
  } catch (error) { next(error); }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) { next(error); }
};
