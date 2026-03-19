import mongoose from 'mongoose';
import { srkTaskActionSubmissionModel } from '../model/task/srkTaskActionSubmissionModel';
import { srkTaskUserModel } from '../model/task/srkTaskUserModel';
import { UserModel } from '../model/userModel';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to fetch task action submissions for a user
 * 
 * Usage:
 *   npm run script:get-task-submissions -- email=user@example.com
 *   npm run script:get-task-submissions -- userId=507f1f77bcf86cd799439011
 *   npm run script:get-task-submissions -- taskUserId=507f1f77bcf86cd799439011
 *   npm run script:get-task-submissions -- taskUserId=507f1f77bcf86cd799439011 status=approved
 */

async function getSrkTaskActionSubmissions() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let email: string | undefined;
    let userId: string | undefined;
    let taskUserId: string | undefined;
    let status: string | undefined;

    args.forEach((arg) => {
      const [key, value] = arg.split('=');
      if (key === 'email') {
        email = value;
      } else if (key === 'userId') {
        userId = value;
      } else if (key === 'taskUserId') {
        taskUserId = value;
      } else if (key === 'status') {
        status = value;
      }
    });

    if (!email && !userId && !taskUserId) {
      console.error('❌ Error: Please provide email, userId, or taskUserId');
      console.log('\nUsage:');
      console.log('  npm run script:get-task-submissions -- email=user@example.com');
      console.log('  npm run script:get-task-submissions -- userId=507f1f77bcf86cd799439011');
      console.log('  npm run script:get-task-submissions -- taskUserId=507f1f77bcf86cd799439011');
      console.log('  npm run script:get-task-submissions -- taskUserId=507f1f77bcf86cd799439011 status=approved');
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

    let resolvedTaskUserId: string = taskUserId || '';

    // If email or userId provided, resolve to taskUserId
    if (email || userId) {
      // Find the user first
      let user;
      
      if (email) {
        user = await UserModel.findOne({ email }).lean();
        if (!user) {
          console.log('❌ User with email not found');
          await mongoose.disconnect();
          process.exit(0);
        }
        console.log(`✅ Found user by email: ${email}`);
      } else if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.error('❌ Error: Invalid userId format');
          process.exit(1);
        }
        user = await UserModel.findById(userId).lean();
        if (!user) {
          console.log('❌ User not found');
          await mongoose.disconnect();
          process.exit(0);
        }
        console.log(`✅ Found user by ID`);
      }

      // Find task user by srkUniversityUserId
      const taskUser = await srkTaskUserModel.findOne({
        srkUniversityUserId: user._id,
      }).lean();

      if (!taskUser) {
        console.log('❌ Task user not found for this user');
        await mongoose.disconnect();
        process.exit(0);
      }

      resolvedTaskUserId = taskUser._id.toString();
      console.log(`✅ Found task user ID: ${resolvedTaskUserId}\n`);
    }

    // Validate taskUserId format
    if (!mongoose.Types.ObjectId.isValid(resolvedTaskUserId)) {
      console.error('❌ Error: Invalid taskUserId format');
      process.exit(1);
    }

    // Build query for submissions
    const submissionQuery: any = {
      taskUserId: resolvedTaskUserId,
    };

    if (status) {
      submissionQuery.status = status;
      console.log(`🔍 Searching submissions with status: ${status}`);
    }

    console.log(`🔍 Fetching task action submissions for taskUserId: ${resolvedTaskUserId}`);

    // Fetch submissions
    const submissions = await srkTaskActionSubmissionModel
      .find(submissionQuery)
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    if (submissions.length === 0) {
      console.log('\n❌ No submissions found');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Display results
    console.log(`\n✅ Found ${submissions.length} submission(s)!\n`);
    console.log('='.repeat(80));
    console.log('TASK ACTION SUBMISSIONS');
    console.log('='.repeat(80));

    submissions.forEach((submission, index) => {
      console.log(`\n📋 Submission #${index + 1}`);
      console.log('-'.repeat(80));
      console.log(`ID:                    ${submission._id}`);
      console.log(`Task User ID:          ${submission.taskUserId}`);
      console.log(`Package Todo ID:       ${submission.growPackageTodoId}`);
      console.log(`Type:                  ${submission.type}`);
      console.log(`Status:                ${submission.status}`);
      console.log(`Description:           ${submission.description}`);
      console.log(`Screenshot URL:        ${submission.screenshotUrl}`);
      if (submission.rejectionReason) {
        console.log(`Rejection Reason:      ${submission.rejectionReason}`);
      }
      console.log(`Created At:            ${new Date(submission.createdAt).toLocaleString()}`);
      console.log(`Updated At:            ${new Date(submission.updatedAt).toLocaleString()}`);
    });

    console.log('\n' + '='.repeat(80));

    // Display summary
    const statusCounts = submissions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Summary:');
    console.log(`Total Submissions:     ${submissions.length}`);
    Object.entries(statusCounts).forEach(([stat, count]) => {
      console.log(`  ${stat}:             ${count}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the script
getSrkTaskActionSubmissions();
