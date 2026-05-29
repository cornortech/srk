import 'dotenv/config';
import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';

async function getBarshaCert() {
  const MONGODB_URI = process.env.DATABASE_URL;
  await mongoose.connect(MONGODB_URI!);
  
  try {
    const user = await UserModel.findOne({ email: 'barshaoli628@gmail.com' });
    
    if (user) {
      console.log('\n📄 Barsha Oli Certificate Details:');
      console.log('====================================');
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Certificate URL: ${user.certificateAssetUrl}`);
      console.log(`Certificate Sent: ${user.hasSendCompletionCertificate}`);
    } else {
      console.log('User not found');
    }
  } finally {
    await mongoose.connection.close();
  }
}

getBarshaCert();
