const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobin_dashboard');
    
    const adminExists = await User.findOne({ username: 'jobin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('jobin123', salt);

    const admin = new User({
      name: 'Jobin',
      username: 'jobin',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin user (Jobin) created successfully!');
    console.log('Username: jobin');
    console.log('Password: jobin123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
