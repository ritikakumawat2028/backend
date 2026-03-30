const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).populate('parent', 'name slug');
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    if (req.file) req.body.image = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    if (req.file) req.body.image = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
};
