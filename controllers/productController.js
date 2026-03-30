const Product = require('../models/Product');

// Get all products with filtering, search, sort, pagination
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, brand, gender, minPrice, maxPrice, size, color, rating,
      inStock, isFeatured, isTrending, isBestSeller, isNewArrival,
      sort, page = 1, limit = 12 } = req.query;

    let query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) query['sizes.size'] = size;
    if (color) query['colors.name'] = { $regex: color, $options: 'i' };
    if (rating) query.rating = { $gte: Number(rating) };
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (inStock === 'false') query.stock = 0;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isTrending === 'true') query.isTrending = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;

    let sortQuery = {};
    switch (sort) {
      case 'price_asc': sortQuery = { price: 1 }; break;
      case 'price_desc': sortQuery = { price: -1 }; break;
      case 'newest': sortQuery = { createdAt: -1 }; break;
      case 'best_selling': sortQuery = { sold: -1 }; break;
      case 'top_rated': sortQuery = { rating: -1 }; break;
      default: sortQuery = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .sort(sortQuery).skip(skip).limit(Number(limit));

    res.json({
      success: true, products, total,
      page: Number(page), pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) { next(error); }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) { next(error); }
};

// Get product by slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) { next(error); }
};

// Create product (admin)
exports.createProduct = async (req, res, next) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => images.push({ url: `/uploads/${file.filename}`, publicId: file.filename }));
    }

    const productData = { ...req.body };
    if (typeof productData.colors === 'string') productData.colors = JSON.parse(productData.colors);
    if (typeof productData.sizes === 'string') productData.sizes = JSON.parse(productData.sizes);

    const product = await Product.create({ ...productData, images: images.length > 0 ? images : req.body.images });
    res.status(201).json({ success: true, product });
  } catch (error) { next(error); }
};

// Update product (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    if (typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);
    if (typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}`, publicId: file.filename }));
      updateData.images = [...(req.body.existingImages ? JSON.parse(req.body.existingImages) : []), ...newImages];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) { next(error); }
};

// Delete product (admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) { next(error); }
};

// Get related products
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await Product.find({
      _id: { $ne: product._id }, category: product.category, isActive: true,
    }).limit(8).populate('brand', 'name');
    res.json({ success: true, products: related });
  } catch (error) { next(error); }
};
