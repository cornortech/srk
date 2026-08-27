import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import { srkTaskUserModel } from '../model/task/srkTaskUserModel';
import { srkTaskUserBalanceModel } from '../model/task/srkTaskUserBalanceModel';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to update currentCoins for specific task users
 * 
 * Usage:
 *   npm run script:update-task-coins
 */

const TARGET_EMAILS = [
  'asudip713@gmail.com',
  'priyankaroka7@gmail.com',
  'snaveen98041@gmail.com',
  'girikiran340@gmail.com',
  'saudmadhu5@gmail.com',
];

const TARGET_COINS = 20000;

async function updateTaskUserCoins() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI or DATABASE_URL not found in environment variables');
      process.exit(1);
    }

    console.log('🔄 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database\n');

    console.log(`📋 Processing ${TARGET_EMAILS.length} email addresses...\n`);

    let successCount = 0;
    let failureCount = 0;
    const results: Array<{
      email: string;
      status: 'success' | 'failed';
      message: string;
      previousCoins?: number;
      newCoins?: number;
    }> = [];

    for (const email of TARGET_EMAILS) {
      console.log(`\n🔍 Processing: ${email}`);
      
      try {
        // Step 1: Find the university user by email
        const universityUser = await UserModel.findOne({ email }).lean();
        
        if (!universityUser) {
          console.log(`   ❌ University user not found`);
          results.push({
            email,
            status: 'failed',
            message: 'University user not found',
          });
          failureCount++;
          continue;
        }
        
        console.log(`   ✓ Found university user: ${universityUser._id}`);

        // Step 2: Find the task user
        const taskUser = await srkTaskUserModel.findOne({
          srkUniversityUserId: universityUser._id,
        }).lean();
        
        if (!taskUser) {
          console.log(`   ❌ Task user not found`);
          results.push({
            email,
            status: 'failed',
            message: 'Task user not found',
          });
          failureCount++;
          continue;
        }
        
        console.log(`   ✓ Found task user: ${taskUser._id}`);

        // Step 3: Find and update the task user balance
        const balance = await srkTaskUserBalanceModel.findOne({
          taskUserId: taskUser._id,
        });
        
        if (!balance) {
          console.log(`   ❌ Task user balance not found`);
          results.push({
            email,
            status: 'failed',
            message: 'Task user balance not found',
          });
          failureCount++;
          continue;
        }
        
        const previousCoins = balance.currentCoins;
        console.log(`   ℹ Previous coins: ${previousCoins}`);

        // Update the balance
        balance.currentCoins = TARGET_COINS;
        await balance.save();
        
        console.log(`   ✅ Updated coins to: ${TARGET_COINS}`);
        
        results.push({
          email,
          status: 'success',
          message: 'Successfully updated',
          previousCoins,
          newCoins: TARGET_COINS,
        });
        successCount++;
        
      } catch (error) {
        console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.push({
          email,
          status: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        failureCount++;
      }
    }

    // Print summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total processed: ${TARGET_EMAILS.length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log('='.repeat(70));
    
    console.log('\n📋 DETAILED RESULTS:\n');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.email}`);
      console.log(`   Status: ${result.status === 'success' ? '✅' : '❌'} ${result.status.toUpperCase()}`);
      console.log(`   Message: ${result.message}`);
      if (result.status === 'success') {
        console.log(`   Previous Coins: ${result.previousCoins}`);
        console.log(`   New Coins: ${result.newCoins}`);
      }
      console.log('');
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
    process.exit(failureCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
updateTaskUserCoins();
