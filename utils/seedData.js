const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(), Category.deleteMany(), Brand.deleteMany(),
      Product.deleteMany(), Settings.deleteMany(), Banner.deleteMany(), Coupon.deleteMany(),
    ]);

    // Create admin user
    const admin = await User.create({
      name: 'Admin', email: 'admin@kicksfootwear.com',
      password: 'admin123', role: 'superadmin', phone: '9999999999',
    });
    console.log('✅ Admin created: admin@kicksfootwear.com / admin123');

    // Create test user
    await User.create({ name: 'Test User', email: 'user@test.com', password: 'user123', phone: '8888888888' });
    console.log('✅ Test user created: user@test.com / user123');

    // Categories
    const categories = await Category.insertMany([
      { name: 'Sneakers', description: 'Trendy sneakers for all occasions' },
      { name: 'Running', description: 'Performance running shoes' },
      { name: 'Basketball', description: 'Basketball performance shoes' },
      { name: 'Lifestyle', description: 'Everyday lifestyle shoes' },
      { name: 'Casual', description: 'Casual everyday footwear' },
      { name: 'Boots', description: 'Stylish and durable boots' },
      { name: 'Sandals', description: 'Comfortable sandals' },
      { name: 'Sports', description: 'Sports performance footwear' },
    ]);
    console.log('✅ 8 categories created');

    // Brands
    const brands = await Brand.insertMany([
      { name: 'Nike', description: 'Just Do It' },
      { name: 'Adidas', description: 'Impossible Is Nothing' },
      { name: 'Jordan', description: 'Wings' },
      { name: 'Puma', description: 'Forever Faster' },
      { name: 'Converse', description: 'Shoes Are Boring. Wear Sneakers.' },
      { name: 'New Balance', description: 'Fearlessly Independent Since 1906' },
      { name: 'Reebok', description: 'Be More Human' },
      { name: 'Asics', description: 'Sound Mind, Sound Body' },
    ]);
    console.log('✅ 8 brands created');

    const catMap = {};
    categories.forEach(c => (catMap[c.name] = c._id));
    const brMap = {};
    brands.forEach(b => (brMap[b.name] = b._id));

    // Products
    const products = await Product.insertMany([
      {
        name: 'Air Max Velocity', description: 'Experience unmatched comfort and style with the Air Max Velocity. Featuring a responsive Air cushioning system and breathable mesh upper.', shortDescription: 'Lightweight running shoe with Air cushioning',
        price: 15699, originalPrice: 18999, category: catMap['Sneakers'], brand: brMap['Nike'],
        sizes: [{ size: 'UK 6', stock: 10 }, { size: 'UK 7', stock: 15 }, { size: 'UK 8', stock: 20 }, { size: 'UK 9', stock: 12 }, { size: 'UK 10', stock: 8 }],
        colors: [{ name: 'White', hexCode: '#FFFFFF' }, { name: 'Black', hexCode: '#000000' }],
        gender: 'men', stock: 65, rating: 4.8, numReviews: 234, isFeatured: true, isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', publicId: 'shoe1' }],
        tags: ['sneakers', 'running', 'air max', 'nike'],
      },
      {
        name: 'UltraBoost Elite', description: 'The UltraBoost Elite delivers incredible energy return with every stride. Primeknit upper adapts to your foot for a sock-like fit.', shortDescription: 'Premium running shoe with Boost technology',
        price: 16499, originalPrice: 20699, category: catMap['Running'], brand: brMap['Adidas'],
        sizes: [{ size: 'UK 7', stock: 18 }, { size: 'UK 8', stock: 22 }, { size: 'UK 9', stock: 15 }, { size: 'UK 10', stock: 10 }],
        colors: [{ name: 'Core Black', hexCode: '#1A1A1A' }, { name: 'Cloud White', hexCode: '#F5F5F5' }, { name: 'Solar Blue', hexCode: '#0066CC' }],
        gender: 'unisex', stock: 65, rating: 4.9, numReviews: 567, isFeatured: true, isBestSeller: true,
        images: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', publicId: 'shoe2' }],
        tags: ['running', 'ultraboost', 'adidas', 'performance'],
      },
      {
        name: 'Retro High OG', description: 'The iconic silhouette that started it all. Premium leather construction with classic colorway and Air cushioning in the sole.', shortDescription: 'Iconic basketball sneaker',
        price: 14899, originalPrice: 14899, category: catMap['Basketball'], brand: brMap['Jordan'],
        sizes: [{ size: 'UK 7', stock: 8 }, { size: 'UK 8', stock: 12 }, { size: 'UK 9', stock: 10 }, { size: 'UK 10', stock: 6 }, { size: 'UK 11', stock: 4 }],
        colors: [{ name: 'Bred', hexCode: '#CC0000' }, { name: 'Royal Blue', hexCode: '#0044CC' }],
        gender: 'men', stock: 40, rating: 4.9, numReviews: 1203, isTrending: true, isBestSeller: true,
        images: [{ url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600', publicId: 'shoe3' }],
        tags: ['jordan', 'basketball', 'retro', 'high top'],
      },
      {
        name: 'Gel-Kayano 30', description: 'Designed for overpronators, the Gel-Kayano 30 offers stability and comfort for long-distance runs with GEL technology cushioning.', shortDescription: 'Stability running shoe',
        price: 13199, originalPrice: 14899, category: catMap['Running'], brand: brMap['Asics'],
        sizes: [{ size: 'UK 6', stock: 14 }, { size: 'UK 7', stock: 20 }, { size: 'UK 8', stock: 18 }, { size: 'UK 9', stock: 12 }],
        colors: [{ name: 'Midnight Blue', hexCode: '#003366' }, { name: 'Lime Green', hexCode: '#66CC00' }],
        gender: 'unisex', stock: 64, rating: 4.7, numReviews: 567, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', publicId: 'shoe4' }],
        tags: ['running', 'stability', 'asics', 'gel'],
      },
      {
        name: 'Chuck 70 High', description: 'The Chuck 70 brings premium craftsmanship to a classic design. Higher rubber foxing, more cushioning, and premium canvas.', shortDescription: 'Classic premium high-top',
        price: 6999, originalPrice: 6999, category: catMap['Lifestyle'], brand: brMap['Converse'],
        sizes: [{ size: 'UK 5', stock: 25 }, { size: 'UK 6', stock: 30 }, { size: 'UK 7', stock: 35 }, { size: 'UK 8', stock: 28 }, { size: 'UK 9', stock: 20 }],
        colors: [{ name: 'Black', hexCode: '#000000' }, { name: 'Parchment', hexCode: '#F5F0E1' }],
        gender: 'unisex', stock: 138, rating: 4.6, numReviews: 878, isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600', publicId: 'shoe5' }],
        tags: ['converse', 'lifestyle', 'classic', 'high top'],
      },
      {
        name: 'Pegasus Trail 4', description: 'Hit the trails with confidence. The Pegasus Trail 4 features rugged outsole traction and responsive React foam cushioning.', shortDescription: 'Trail running shoe',
        price: 12399, originalPrice: 13999, category: catMap['Sports'], brand: brMap['Nike'],
        sizes: [{ size: 'UK 7', stock: 10 }, { size: 'UK 8', stock: 15 }, { size: 'UK 9', stock: 12 }, { size: 'UK 10', stock: 8 }],
        colors: [{ name: 'Black/Red', hexCode: '#CC0000' }, { name: 'Olive', hexCode: '#556B2F' }],
        gender: 'men', stock: 45, rating: 4.6, numReviews: 189, isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600', publicId: 'shoe6' }],
        tags: ['trail', 'running', 'nike', 'outdoor'],
      },
      {
        name: 'RS-X Reinvention', description: 'Bold, chunky, and full of attitude. The RS-X Reinvention features Running System technology with a retro-inspired design.', shortDescription: 'Chunky retro sneaker',
        price: 8999, originalPrice: 10999, category: catMap['Sneakers'], brand: brMap['Puma'],
        sizes: [{ size: 'UK 6', stock: 12 }, { size: 'UK 7', stock: 18 }, { size: 'UK 8', stock: 20 }, { size: 'UK 9', stock: 14 }],
        colors: [{ name: 'White/Red', hexCode: '#FF3333' }, { name: 'Black/Purple', hexCode: '#660099' }],
        gender: 'unisex', stock: 64, rating: 4.4, numReviews: 312, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600', publicId: 'shoe7' }],
        tags: ['puma', 'retro', 'chunky', 'sneakers'],
      },
      {
        name: '574 Classic', description: 'The 574 is the most New Balance shoe ever. Classic suede/mesh upper with ENCAP midsole cushioning for all-day comfort.', shortDescription: 'Classic retro lifestyle shoe',
        price: 7499, originalPrice: 8999, category: catMap['Lifestyle'], brand: brMap['New Balance'],
        sizes: [{ size: 'UK 6', stock: 16 }, { size: 'UK 7', stock: 22 }, { size: 'UK 8', stock: 25 }, { size: 'UK 9', stock: 18 }, { size: 'UK 10', stock: 10 }],
        colors: [{ name: 'Grey', hexCode: '#808080' }, { name: 'Navy', hexCode: '#000080' }],
        gender: 'unisex', stock: 91, rating: 4.5, numReviews: 445, isBestSeller: true,
        images: [{ url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600', publicId: 'shoe8' }],
        tags: ['new balance', 'classic', 'lifestyle', 'retro'],
      },
      {
        name: 'Classic Leather', description: 'Clean, versatile, and timeless. The Classic Leather features soft garment leather upper and die-cut EVA midsole for lightweight cushioning.', shortDescription: 'Timeless leather sneaker',
        price: 6499, originalPrice: 7999, category: catMap['Casual'], brand: brMap['Reebok'],
        sizes: [{ size: 'UK 6', stock: 20 }, { size: 'UK 7', stock: 25 }, { size: 'UK 8', stock: 30 }, { size: 'UK 9', stock: 22 }],
        colors: [{ name: 'White', hexCode: '#FFFFFF' }, { name: 'Black', hexCode: '#000000' }],
        gender: 'unisex', stock: 97, rating: 4.3, numReviews: 256, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600', publicId: 'shoe9' }],
        tags: ['reebok', 'classic', 'leather', 'casual'],
      },
      {
        name: 'Suede Classic', description: 'The Puma Suede has been a street-style staple since 1968. Premium suede upper with the iconic Formstrip and rubber cupsole.', shortDescription: 'Street-style suede icon',
        price: 5999, originalPrice: 7499, category: catMap['Casual'], brand: brMap['Puma'],
        sizes: [{ size: 'UK 5', stock: 18 }, { size: 'UK 6', stock: 22 }, { size: 'UK 7', stock: 28 }, { size: 'UK 8', stock: 20 }, { size: 'UK 9', stock: 15 }],
        colors: [{ name: 'Black/White', hexCode: '#000000' }, { name: 'Red/White', hexCode: '#CC0000' }, { name: 'Blue/White', hexCode: '#0044CC' }],
        gender: 'unisex', stock: 103, rating: 4.5, numReviews: 678, isBestSeller: true,
        images: [{ url: 'https://images.unsplash.com/photo-1608379743498-63cc63a3a577?w=600', publicId: 'shoe10' }],
        tags: ['puma', 'suede', 'classic', 'street'],
      },
      {
        name: 'Air Force 1 Low', description: 'The legend lives on. Air Force 1 Low features premium leather, perforated toe box, and encapsulated Air cushioning.', shortDescription: 'Iconic street sneaker',
        price: 9499, originalPrice: 9499, category: catMap['Sneakers'], brand: brMap['Nike'],
        sizes: [{ size: 'UK 6', stock: 30 }, { size: 'UK 7', stock: 35 }, { size: 'UK 8', stock: 40 }, { size: 'UK 9', stock: 25 }, { size: 'UK 10', stock: 20 }],
        colors: [{ name: 'Triple White', hexCode: '#FFFFFF' }, { name: 'Triple Black', hexCode: '#000000' }],
        gender: 'unisex', stock: 150, rating: 4.8, numReviews: 2100, isFeatured: true, isBestSeller: true,
        images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', publicId: 'shoe11' }],
        tags: ['nike', 'air force', 'classic', 'street'],
      },
      {
        name: 'Dunk Low Retro', description: 'Created for basketball but adopted by sneaker culture. Premium leather and classic color-blocking define the Dunk Low Retro.', shortDescription: 'Classic basketball-inspired sneaker',
        price: 10999, originalPrice: 12999, category: catMap['Sneakers'], brand: brMap['Nike'],
        sizes: [{ size: 'UK 6', stock: 8 }, { size: 'UK 7', stock: 12 }, { size: 'UK 8', stock: 15 }, { size: 'UK 9', stock: 10 }],
        colors: [{ name: 'Panda', hexCode: '#000000' }, { name: 'University Red', hexCode: '#CC0000' }],
        gender: 'unisex', stock: 45, rating: 4.7, numReviews: 890, isTrending: true, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1612902456551-404b5674789e?w=600', publicId: 'shoe12' }],
        tags: ['nike', 'dunk', 'retro', 'sneakers'],
      },
      {
        name: 'Forum Low', description: 'Originally designed for the basketball court in 1984, the Forum Low is now a street-style essential with premium leather and the iconic X strap.', shortDescription: 'Retro basketball style shoe',
        price: 8499, originalPrice: 9999, category: catMap['Lifestyle'], brand: brMap['Adidas'],
        sizes: [{ size: 'UK 6', stock: 15 }, { size: 'UK 7', stock: 20 }, { size: 'UK 8', stock: 22 }, { size: 'UK 9', stock: 18 }],
        colors: [{ name: 'White/Green', hexCode: '#228B22' }, { name: 'White/Blue', hexCode: '#0044CC' }],
        gender: 'unisex', stock: 75, rating: 4.4, numReviews: 234, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600', publicId: 'shoe13' }],
        tags: ['adidas', 'forum', 'retro', 'lifestyle'],
      },
      {
        name: 'Floatride Energy 5', description: 'Lightweight and responsive, the Floatride Energy 5 delivers Floatride Energy Foam for incredible energy return mile after mile.', shortDescription: 'Lightweight performance runner',
        price: 9999, originalPrice: 11999, category: catMap['Running'], brand: brMap['Reebok'],
        sizes: [{ size: 'UK 7', stock: 12 }, { size: 'UK 8', stock: 18 }, { size: 'UK 9', stock: 15 }, { size: 'UK 10', stock: 8 }],
        colors: [{ name: 'Black/Yellow', hexCode: '#FFD700' }, { name: 'White/Blue', hexCode: '#4169E1' }],
        gender: 'men', stock: 53, rating: 4.3, numReviews: 156, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600', publicId: 'shoe14' }],
        tags: ['reebok', 'running', 'performance', 'lightweight'],
      },
      {
        name: 'Gel-Nimbus 25', description: 'Premium neutral running shoe featuring FF BLAST PLUS cushioning for an incredibly soft and smooth ride on every run.', shortDescription: 'Premium cushioned running shoe',
        price: 14499, originalPrice: 16999, category: catMap['Running'], brand: brMap['Asics'],
        sizes: [{ size: 'UK 7', stock: 10 }, { size: 'UK 8', stock: 14 }, { size: 'UK 9', stock: 12 }, { size: 'UK 10', stock: 6 }],
        colors: [{ name: 'Sheet Rock', hexCode: '#778899' }, { name: 'Sunrise Red', hexCode: '#FF4500' }],
        gender: 'unisex', stock: 42, rating: 4.8, numReviews: 789, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600', publicId: 'shoe15' }],
        tags: ['asics', 'running', 'premium', 'cushioned'],
      },
      {
        name: 'Blazer Mid 77', description: 'Born on the basketball court, now a street-style icon. The Blazer Mid 77 features vintage styling with exposed foam on the tongue.', shortDescription: 'Vintage basketball high-top',
        price: 8999, originalPrice: 8999, category: catMap['Lifestyle'], brand: brMap['Nike'],
        sizes: [{ size: 'UK 6', stock: 14 }, { size: 'UK 7', stock: 20 }, { size: 'UK 8', stock: 18 }, { size: 'UK 9', stock: 12 }],
        colors: [{ name: 'White/Black', hexCode: '#FFFFFF' }, { name: 'White/Green', hexCode: '#228B22' }],
        gender: 'unisex', stock: 64, rating: 4.5, numReviews: 345, isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600', publicId: 'shoe16' }],
        tags: ['nike', 'blazer', 'vintage', 'lifestyle'],
      },
      {
        name: 'Ozweego', description: 'The Ozweego blends 90s running flair with modern comfort. Features adiprene cushioning and a chunky silhouette thats unmistakably bold.', shortDescription: 'Chunky 90s-inspired sneaker',
        price: 11999, originalPrice: 13999, category: catMap['Sneakers'], brand: brMap['Adidas'],
        sizes: [{ size: 'UK 6', stock: 10 }, { size: 'UK 7', stock: 15 }, { size: 'UK 8', stock: 18 }, { size: 'UK 9', stock: 10 }],
        colors: [{ name: 'Grey', hexCode: '#808080' }, { name: 'Core Black', hexCode: '#1A1A1A' }],
        gender: 'unisex', stock: 53, rating: 4.3, numReviews: 190, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600', publicId: 'shoe17' }],
        tags: ['adidas', 'chunky', 'retro', '90s'],
      },
      {
        name: 'Slipstream', description: 'Revived from the 80s basketball archives, the Slipstream combines heritage court style with modern street styling. Premium leather and suede.', shortDescription: '80s basketball revival',
        price: 9499, originalPrice: 10999, category: catMap['Sneakers'], brand: brMap['Puma'],
        sizes: [{ size: 'UK 7', stock: 12 }, { size: 'UK 8', stock: 16 }, { size: 'UK 9', stock: 14 }, { size: 'UK 10', stock: 8 }],
        colors: [{ name: 'White/Green', hexCode: '#006400' }, { name: 'White/Navy', hexCode: '#000080' }],
        gender: 'unisex', stock: 50, rating: 4.4, numReviews: 167, isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600', publicId: 'shoe18' }],
        tags: ['puma', 'slipstream', 'retro', 'basketball'],
      },
      {
        name: 'FreshFoam X 1080v12', description: 'Top-of-the-line cushioning for daily running. The 1080v12 features Fresh Foam X midsole, Hypoknit upper, and Ultra Heel design.', shortDescription: 'Premium daily training shoe',
        price: 15999, originalPrice: 17999, category: catMap['Running'], brand: brMap['New Balance'],
        sizes: [{ size: 'UK 7', stock: 8 }, { size: 'UK 8', stock: 12 }, { size: 'UK 9', stock: 10 }, { size: 'UK 10', stock: 6 }],
        colors: [{ name: 'Black/Thunder', hexCode: '#333333' }, { name: 'White/Vibrant Orange', hexCode: '#FF6600' }],
        gender: 'men', stock: 36, rating: 4.7, numReviews: 334, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600', publicId: 'shoe19' }],
        tags: ['new balance', 'running', 'premium', 'cushioned'],
      },
      {
        name: 'Club C 85', description: 'Clean white leather meets heritage tennis style. The Club C 85 is an timeless classic with soft leather upper and comfortable EVA midsole.', shortDescription: 'Heritage tennis classic',
        price: 5999, originalPrice: 6999, category: catMap['Casual'], brand: brMap['Reebok'],
        sizes: [{ size: 'UK 5', stock: 20 }, { size: 'UK 6', stock: 25 }, { size: 'UK 7', stock: 30 }, { size: 'UK 8', stock: 22 }, { size: 'UK 9', stock: 15 }],
        colors: [{ name: 'White/Green', hexCode: '#006400' }, { name: 'White/Navy', hexCode: '#000080' }],
        gender: 'unisex', stock: 112, rating: 4.4, numReviews: 543, isBestSeller: true,
        images: [{ url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600', publicId: 'shoe20' }],
        tags: ['reebok', 'classic', 'tennis', 'casual'],
      },
    ]);
    console.log(`✅ ${products.length} products created`);

    // Settings
    await Settings.create({
      storeName: 'KICKS FOOTWEAR', email: 'info@kicksfootwear.com', phone: '+91 98765 43210',
      address: '123 Sneaker Street, Mumbai, India',
      socialLinks: { facebook: 'https://facebook.com/kicksfootwear', instagram: 'https://instagram.com/kicksfootwear', twitter: 'https://twitter.com/kicksfootwear' },
    });
    console.log('✅ Store settings created');

    // Banners
    await Banner.insertMany([
      { title: 'NEW COLLECTION 2026', subtitle: 'KICKS EVO.01', position: 'hero', order: 1 },
      { title: 'UP TO 40% OFF', subtitle: 'Season\'s hottest drops at unbeatable prices', position: 'promotional', order: 1 },
    ]);
    console.log('✅ Banners created');

    // Coupons
    await Coupon.insertMany([
      { code: 'KICKS20', description: '20% off on orders above ₹5000', discountType: 'percentage', discountValue: 20, minOrderValue: 5000, maxDiscount: 3000, expiryDate: new Date('2027-12-31') },
      { code: 'FLAT500', description: 'Flat ₹500 off on orders above ₹3000', discountType: 'flat', discountValue: 500, minOrderValue: 3000, expiryDate: new Date('2027-12-31') },
      { code: 'NEWUSER', description: '15% off for new users', discountType: 'percentage', discountValue: 15, minOrderValue: 2000, maxDiscount: 2000, usageLimit: 1, expiryDate: new Date('2027-12-31') },
    ]);
    console.log('✅ Coupons created');

    console.log('\n🎉 Seed data complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
