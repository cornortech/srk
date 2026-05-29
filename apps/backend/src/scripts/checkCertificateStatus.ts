// dotenv MUST be the first import so env vars are available to all other modules
import 'dotenv/config';

import mongoose from 'mongoose';
import { CertificateSendTrackingModel } from '../model/certificateSendTrackingModel';

/**
 * Check the status of certificate sends
 *
 * Usage:
 *   tsx apps/backend/src/scripts/checkCertificateStatus.ts
 *   tsx apps/backend/src/scripts/checkCertificateStatus.ts status=pending (show only pending)
 *   tsx apps/backend/src/scripts/checkCertificateStatus.ts status=completed (show only completed)
 */
async function checkCertificateStatus() {
  const args = process.argv.slice(2);
  let filterStatus: 'pending' | 'completed' | null = null;

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === 'status') {
      if (value === 'pending' || value === 'completed') {
        filterStatus = value;
      }
    }
  });

  const MONGODB_URI = process.env.DATABASE_URL;
  if (!MONGODB_URI) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to database\n');

  try {
    let query = CertificateSendTrackingModel.find().sort({ createdAt: -1 });

    if (filterStatus === 'pending') {
      query = query.where('done').equals(false);
    } else if (filterStatus === 'completed') {
      query = query.where('done').equals(true);
    }

    const records = await query.exec();

    const pending = records.filter((r) => !r.done);
    const completed = records.filter((r) => r.done);
    const failed = records.filter((r) => r.error);

    console.log(`📊 Certificate Send Status\n`);
    console.log(`📈 Total Records:    ${records.length}`);
    console.log(`⏳ Pending:          ${pending.length}`);
    console.log(`✅ Completed:        ${completed.length}`);
    console.log(`❌ Failed:           ${failed.length}\n`);

    if (records.length === 0) {
      console.log('No records found.\n');
      return;
    }

    console.log(`${'='.repeat(80)}`);

    if (filterStatus === 'pending' || !filterStatus) {
      if (pending.length > 0) {
        console.log('\n📋 PENDING (Waiting to be sent):\n');
        pending.slice(0, 10).forEach((record, index) => {
          console.log(
            `${index + 1}. ${record.userEmail} (${record.userId}) - Created: ${record.createdAt.toLocaleString()}`
          );
        });
        if (pending.length > 10) {
          console.log(`\n... and ${pending.length - 10} more pending records\n`);
        }
      }
    }

    if (filterStatus === 'completed' || !filterStatus) {
      if (completed.length > 0) {
        console.log('\n✅ COMPLETED (Successfully sent):\n');
        completed.slice(0, 10).forEach((record, index) => {
          console.log(
            `${index + 1}. ${record.userEmail} (${record.userId}) - Sent: ${record.sentAt?.toLocaleString() || 'N/A'}`
          );
        });
        if (completed.length > 10) {
          console.log(`\n... and ${completed.length - 10} more completed records\n`);
        }
      }
    }

    if (failed.length > 0) {
      console.log('\n❌ FAILED (Errors encountered):\n');
      failed.slice(0, 10).forEach((record, index) => {
        console.log(`${index + 1}. ${record.userEmail} (${record.userId})`);
        console.log(`   Error: ${record.error}`);
        console.log(`   Created: ${record.createdAt.toLocaleString()}\n`);
      });
      if (failed.length > 10) {
        console.log(`\n... and ${failed.length - 10} more failed records\n`);
      }
    }

    console.log(`${'='.repeat(80)}\n`);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkCertificateStatus();
