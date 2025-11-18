import dotenv from 'dotenv';
import connectDB from '../config/database';
import { seedFoodDatabase } from '../utils/seedData';

// Load environment variables
dotenv.config();

const runSeed = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to database
    await connectDB();
    
    // Seed food database
    await seedFoodDatabase();
    
    console.log('✅ Database seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seed failed:', error);
    process.exit(1);
  }
};

runSeed();
