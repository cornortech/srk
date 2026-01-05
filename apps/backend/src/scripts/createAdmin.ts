import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { adminModel } from '../model/adminModel';
import AuthService from '../services/authService';

const DATABASE_URL = process.env.DATABASE_URL || '';

interface CreateAdminParams {
  email: string;
  password: string;
}

const createAdmin = async ({ email, password }: CreateAdminParams) => {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Connect to database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      console.log('⚠ Admin with this email already exists');
      process.exit(0);
    }

    // Hash password
    console.log('Creating admin...');
    const hashedPassword = await AuthService.hashPassword(password);

    // Create admin
    const newAdmin = await adminModel.create({
      email,
      password: hashedPassword,
    });

    console.log('✓ Admin created successfully!');
    console.log('  Email:', newAdmin.email);
    console.log('  ID:', newAdmin._id);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script with command line arguments or defaults
const email = process.argv[2] || 'admin@srk.com';
const password = process.argv[3] || 'Admin@123';

console.log('\n🔧 SRK Admin Creation Script\n');
console.log('Creating admin with:');
console.log('  Email:', email);
console.log('  Password:', password.replace(/./g, '*'));
console.log('');

createAdmin({ email, password });