const Brand = require('../models/Brand');

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.json({ success: true, brands });
  } catch (error) { next(error); }
};

exports.getBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, brand });
  } catch (error) { next(error); }
};

exports.createBrand = async (req, res, next) => {
  try {
    if (req.file) req.body.logo = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, brand });
  } catch (error) { next(error); }
};

exports.updateBrand = async (req, res, next) => {
  try {
    if (req.file) req.body.logo = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, brand });
  } catch (error) { next(error); }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error) { next(error); }
};
