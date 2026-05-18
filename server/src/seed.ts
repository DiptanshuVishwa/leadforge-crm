import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Lead from './models/Lead';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Lead.deleteMany();
    console.log('Cleared existing users and leads');

    // Create users
    const adminPassword = await bcrypt.hash('password123', 10);
    const salesPassword = await bcrypt.hash('password123', 10);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    const salesUser = await User.create({
      name: 'Sales User',
      email: 'sales@example.com',
      password: salesPassword,
      role: 'sales',
    });

    console.log('Created admin and sales users');

    // Create 25 sample leads
    const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
    const sources = ['Website', 'Instagram', 'Referral'];
    const leads = [];

    for (let i = 1; i <= 25; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      // Randomize createdBy (70% sales, 30% admin)
      const createdBy = Math.random() > 0.3 ? salesUser._id : adminUser._id;

      leads.push({
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        status,
        source,
        createdBy,
      });
    }

    await Lead.insertMany(leads);
    console.log('Created 25 sample leads');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
