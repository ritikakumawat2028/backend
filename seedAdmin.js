const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kicks_footware');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password and role...');
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    } else {
      console.log('Creating new admin user...');
      await User.create({
        name: 'Demo Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
    }

    console.log('Admin user seeded successfully!');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
