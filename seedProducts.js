const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/kicks_footwear';

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('SYNC: Connected.');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('SYNC: Cleared.');

    const catNames = ['Sneakers', 'Running', 'Sport', 'Lifestyle'];
    const catMap = {};
    for (const name of catNames) {
      const c = await Category.create({ name });
      catMap[name] = c._id;
      console.log(`SYNC: Category Created - ${name}`);
    }

    const products = [
      { name: 'NEXUS ELITE V1', price: 18500, category: catMap['Sneakers'] },
      { name: 'EVO SHADOW RIDER', price: 14200, category: catMap['Running'] },
      { name: 'TACTICAL GHOST X', price: 22000, category: catMap['Sport'] },
      { name: 'VORTEX CORE BLACK', price: 12500, category: catMap['Lifestyle'] },
      { name: 'PULSE NEON RED', price: 16800, category: catMap['Running'] },
      { name: 'ORBIT ARCHIVE v2', price: 9800, category: catMap['Sneakers'] },
      { name: 'BLAST OFF-WHITE', price: 26000, category: catMap['Lifestyle'] },
      { name: 'DELTA COMMANDER', price: 31000, category: catMap['Sport'] },
      { name: 'ZENITH LIGHT', price: 8500, category: catMap['Lifestyle'] },
      { name: 'NEXUS PRO ALPHA', price: 45000, category: catMap['Sneakers'] }
    ];

    for (const p of products) {
      const prod = new Product({
        ...p,
        description: `${p.name} - Premium Tactical Series. Engineered for performance and style.`,
        stock: 50,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' }],
        isFeatured: true,
        isTrending: true
      });
      await prod.save();
      console.log(`SYNC: Product Saved - ${p.name}`);
    }

    console.log('SYNC: COMPLETE.');
    process.exit(0);
  } catch (err) {
    console.error('SYNC: FAILED.', err);
    process.exit(1);
  }
}

seed();
