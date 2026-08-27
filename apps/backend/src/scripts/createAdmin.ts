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
  domain: 'university' | 'grow' | 'task';
}

const createAdmin = async ({ email, password, domain }: CreateAdminParams) => {
  try {
    // Validate input
    if (!email || !password || !domain) {
      throw new Error('Email, password, and domain are required');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (!['university', 'grow', 'task'].includes(domain)) {
      throw new Error('Domain must be one of: university, grow, task');
    }

    // Connect to database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      console.log('⚠ Admin with this email already exists');
      console.log('  Email:', existingAdmin.email);
      console.log('  Domain:', existingAdmin.domain);
      process.exit(0);
    }

    // Hash password
    console.log('Creating admin...');
    const hashedPassword = await AuthService.hashPassword(password);

    // Create admin
    const newAdmin = await adminModel.create({
      email,
      password: hashedPassword,
      domain,
    });

    console.log('✓ Admin created successfully!');
    console.log('  Email:', newAdmin.email);
    console.log('  Domain:', newAdmin.domain);
    console.log('  ID:', newAdmin._id);
    console.log('');
    console.log('Login behavior:');
    if (domain === 'university') {
      console.log('  → Will redirect to University admin dashboard (/admin)');
    } else if (domain === 'task') {
      console.log('  → Will redirect to Task admin dashboard via SSO');
    } else if (domain === 'grow') {
      console.log('  → Will redirect to Grow admin dashboard via SSO');
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script with command line arguments or defaults
const email = process.argv[2] || 'admin@srk.com';
const password = process.argv[3] || 'Admin@123';
const domain = (process.argv[4] || 'university') as 'university' | 'grow' | 'task';

// Validate domain
if (!['university', 'grow', 'task'].includes(domain)) {
  console.error('✗ Invalid domain. Must be one of: university, grow, task');
  console.log('\nUsage:');
  console.log('  npm run create-admin <email> <password> <domain>');
  console.log('  ts-node createAdmin.ts <email> <password> <domain>');
  console.log('\nExample:');
  console.log('  npm run create-admin admin@task.com SecurePass123 task');
  console.log('  npm run create-admin admin@grow.com SecurePass123 grow');
  console.log('  npm run create-admin admin@university.com SecurePass123 university');
  process.exit(1);
}

console.log('\n🔧 SRK Multi-Domain Admin Creation Script\n');
console.log('Creating admin with:');
console.log('  Email:', email);
console.log('  Password:', password.replace(/./g, '*'));
console.log('  Domain:', domain);
console.log('');

createAdmin({ email, password, domain });