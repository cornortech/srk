import * as dotenv from "dotenv";
import * as path from "path";
import * as admin from 'firebase-admin';

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { UserModel } from "../model/userModel";
import connectToDatabase from "../config/database";
import AuthService from "../services/authService";
import { adminModel } from "../model/adminModel";

// Initialize Firebase Admin directly in the script
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (
  !serviceAccount.projectId ||
  !serviceAccount.privateKey ||
  !serviceAccount.clientEmail
) {
  throw new Error(
    'Firebase service account credentials are missing. Check your .env file.'
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const createAdmin = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Email and password must be strings');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (password.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    const userExist = await UserModel.findOne({
      email,
    });
    const adminExist = await adminModel.findOne({
      email,
    });

    if (userExist || adminExist) {
      throw new Error('User exists with this email in MongoDB');
    }

    console.log('Checking Firebase for existing user...');
    let userRecord;
    try {
      // Try to get existing Firebase user
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('✓ Firebase user already exists:', userRecord.uid);
      
      // Update email verification if needed
      if (!userRecord.emailVerified) {
        await admin.auth().updateUser(userRecord.uid, {
          emailVerified: true,
        });
        console.log('✓ Email verification updated');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Create new Firebase user
        console.log('Creating user in Firebase...');
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          emailVerified: true,
        });
        console.log('✓ Firebase user created:', userRecord.uid);
      } else {
        throw error;
      }
    }

    console.log('Creating admin in database...');
    const newAdmin = new adminModel({
      uid: userRecord.uid,
      email,
      password: await AuthService.hashPassword(password),
    });
    await newAdmin.save();
    console.log('✓ Admin created in database');

    console.log('✓ Admin setup completed successfully for:', email);
    return newAdmin;
  } catch (error) {
    console.log('✗ Error in createAdmin script:', error);
    throw error;
  }
};

const main = async (email: string, password: string) => {
  try {
    await connectToDatabase();
    console.log('Connected to database');
    await createAdmin(email, password);
    console.log('\n🎉 Admin creation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Admin creation failed:', error);
    process.exit(1);
  }
};

main('intoughstoryssk@gmail.com', 'Khadka@#£78901&&&');
