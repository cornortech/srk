import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Script to fetch SRK University user details by email or userId
 * 
 * Usage:
 *   npm run script:get-user -- email=user@example.com
 *   npm run script:get-user -- userId=507f1f77bcf86cd799439011
 */

async function getSrkUniversityUser() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let email: string | undefined;
    let userId: string | undefined;

    args.forEach((arg) => {
      const [key, value] = arg.split('=');
      if (key === 'email') {
        email = value;
      } else if (key === 'userId') {
        userId = value;
      }
    });

    if (!email && !userId) {
      console.error('❌ Error: Please provide either email or userId');
      console.log('\nUsage:');
      console.log('  npm run script:get-user -- email=user@example.com');
      console.log('  npm run script:get-user -- userId=507f1f77bcf86cd799439011');
      process.exit(1);
    }

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI or DATABASE_URL not found in environment variables');
      process.exit(1);
    }

    console.log('🔄 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database\n');

    // Build query
    const query: any = {};
    if (email) {
      query.email = email;
      console.log(`🔍 Searching for user with email: ${email}`);
    } else if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('❌ Error: Invalid userId format');
        process.exit(1);
      }
      query._id = userId;
      console.log(`🔍 Searching for user with ID: ${userId}`);
    }

    // Fetch user
    const user = await UserModel.findOne(query).lean();

    if (!user) {
      console.log('\n❌ User not found');
      process.exit(0);
    }

    // Display user details
    console.log('\n✅ User found!\n');
    console.log('=' .repeat(60));
    console.log('USER DETAILS');
    console.log('='.repeat(60));
    console.log(`User ID:           ${user._id}`);
    console.log(`First Name:        ${user.firstName || 'N/A'}`);
    console.log(`Last Name:         ${user.lastName || 'N/A'}`);
    // console.log(`Full Name:         ${user.fullName || 'N/A'}`);
    console.log(`Email:             ${user.email}`);
    console.log(`Phone Number:      ${user.phoneNumber || 'N/A'}`);
    console.log(`Gender:            ${user.gender || 'N/A'}`);
    console.log(`Country:           ${user.country || 'N/A'}`);
    console.log(`Date of Birth:     ${user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}`);
    console.log(`Profile Picture:   ${user.profilePicture || 'N/A'}`);
    // console.log(`Role:              ${user.role || 'N/A'}`);
    console.log(`Status:            ${user.status || 'N/A'}`);
    // console.log(`Email Verified:    ${user.emailVerified ? 'Yes' : 'No'}`);
    console.log(`Created At:        ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
    console.log(`Updated At:        ${user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}`);
    console.log('='.repeat(60));

    // Check if user exists in Grow Package Users
    const growSocialMediaPackageUserModel = mongoose.model(
      'growSocialMediaPackageUser',
      new mongoose.Schema({}, { strict: false })
    );
    
    const growUser = await growSocialMediaPackageUserModel
      .findOne({ srkUniversityUserId: user._id })
      .lean();

    if (growUser) {
      console.log('\n📦 GROW PACKAGE USER DETAILS');
      console.log('='.repeat(60));
      console.log(`Grow User ID:      ${growUser._id}`);
      console.log(`User Type:         ${(growUser as any).userType || 'N/A'}`);
      console.log(`Status:            ${(growUser as any).status || 'N/A'}`);
      console.log(`Promo Code:        ${(growUser as any).promoCode || 'N/A'}`);
      console.log(`Referred By:       ${(growUser as any).referredBy || 'N/A'}`);
      console.log('='.repeat(60));
    }

    // Check if user exists in Task Users
    const srkTaskUserModel = mongoose.model(
      'srkTaskUser',
      new mongoose.Schema({}, { strict: false })
    );
    
    const taskUser = await srkTaskUserModel
      .findOne({ srkUniversityUserId: user._id })
      .lean();

    if (taskUser) {
      console.log('\n🎯 TASK USER DETAILS');
      console.log('='.repeat(60));
      console.log(`Task User ID:      ${taskUser._id}`);
      console.log(`Full Name:         ${(taskUser as any).fullName || 'N/A'}`);
      console.log(`Is Activated:      ${(taskUser as any).isActivated ? 'Yes' : 'No'}`);
      console.log(`Date of Birth:     ${(taskUser as any).dob ? new Date((taskUser as any).dob).toLocaleDateString() : 'N/A'}`);
      console.log('='.repeat(60));
    }

    console.log('\n✨ Query completed successfully\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
getSrkUniversityUser();
