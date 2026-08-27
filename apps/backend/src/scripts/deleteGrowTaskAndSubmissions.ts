// Must run before any import that reads process.env at module-load time
// (e.g. config/env.ts, which r2Service.ts depends on) — otherwise those
// modules capture empty values before .env is loaded.
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { growPackageTodoModel } from '../model/growPackageTodoModel';
import { srkTaskActionSubmissionModel } from '../model/task/srkTaskActionSubmissionModel';
import { deleteFileFromR2 } from '../services/r2Service';
import { env } from '../config/env';

/**
 * Deletes ALL documents in growPackageTodoModel and srkTaskActionSubmissionModel,
 * plus the Cloudflare R2 screenshot files referenced by submission.screenshotUrl.
 *
 * Safety: runs as a DRY RUN by default. Nothing is deleted (DB or R2) unless
 * you pass confirm=DELETE.
 *
 * Usage:
 *   npm run script:delete-grow-task-submissions
 *   npm run script:delete-grow-task-submissions -- confirm=DELETE
 *   npm run script:delete-grow-task-submissions -- confirm=DELETE batchSize=200 concurrency=10
 */

const BATCH_SIZE_DEFAULT = 500;
const R2_CONCURRENCY_DEFAULT = 10;

const args = process.argv.slice(2);
const parsedArgs: Record<string, string> = {};
args.forEach((arg) => {
  const [key, value] = arg.split('=');
  if (key) parsedArgs[key] = value ?? '';
});

const isConfirmed = parsedArgs.confirm === 'DELETE';
const batchSize = Number(parsedArgs.batchSize) || BATCH_SIZE_DEFAULT;
const r2Concurrency = Number(parsedArgs.concurrency) || R2_CONCURRENCY_DEFAULT;

// screenshotUrl is stored as a bare R2 key (see dataUrlUploadMiddleware),
// but strip a full CDN URL defensively in case any legacy rows have one.
const extractR2Key = (value: string): string => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) {
    const base = env.CDN_BASE_URL.replace(/\/+$/, '');
    return value.startsWith(base)
      ? value.slice(base.length).replace(/^\/+/, '')
      : '';
  }
  return value.replace(/^\/+/, '');
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

async function deleteR2Keys(keys: string[]) {
  const failedKeys: string[] = [];
  let deleted = 0;
  let processed = 0;
  const total = keys.length;
  const startedAt = Date.now();
  const progressEvery = 1000;
  let nextProgressAt = progressEvery;

  for (const batch of chunk(keys, r2Concurrency)) {
    const results = await Promise.allSettled(
      batch.map((key) => deleteFileFromR2(key))
    );
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        deleted += 1;
      } else {
        failedKeys.push(batch[index]);
      }
    });
    processed += batch.length;

    if (processed >= nextProgressAt || processed === total) {
      const elapsedSec = (Date.now() - startedAt) / 1000;
      const rate = processed / elapsedSec; // keys/sec
      const remaining = total - processed;
      const etaSec = rate > 0 ? Math.round(remaining / rate) : 0;
      const pct = ((processed / total) * 100).toFixed(1);
      console.log(
        `[R2] Progress: ${processed}/${total} (${pct}%) | deleted=${deleted} failed=${failedKeys.length} | elapsed=${Math.round(elapsedSec)}s eta=${etaSec}s`
      );
      nextProgressAt += progressEvery;
    }
  }

  return { deleted, failedKeys };
}

async function collectScreenshotKeys(): Promise<string[]> {
  const keys: string[] = [];
  const cursor = srkTaskActionSubmissionModel
    .find({}, { screenshotUrl: 1 })
    .lean()
    .cursor();

  for await (const doc of cursor) {
    const key = extractR2Key((doc as { screenshotUrl?: string }).screenshotUrl || '');
    if (key) keys.push(key);
  }

  return keys;
}

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI or DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected to database: ${env.DATABASE_NAME}\n`);

  const submissionCount = await srkTaskActionSubmissionModel.countDocuments();
  const todoCount = await growPackageTodoModel.countDocuments();

  console.log('='.repeat(80));
  console.log('DELETE growPackageTodo + srkTaskActionSubmission (+ R2 screenshots)');
  console.log('='.repeat(80));
  console.log(`srkTaskActionSubmission documents: ${submissionCount}`);
  console.log(`growPackageTodo documents:         ${todoCount}`);
  console.log(`Mode:                              ${isConfirmed ? 'LIVE DELETE' : 'DRY RUN (no changes)'}`);
  console.log('='.repeat(80) + '\n');

  console.log('🔍 Scanning submissions for R2 screenshot keys...');
  const r2Keys = await collectScreenshotKeys();
  console.log(`✅ Found ${r2Keys.length} R2 screenshot(s) referenced by submissions.\n`);

  if (!isConfirmed) {
    console.log('🛑 Dry run complete. No documents or R2 files were deleted.');
    console.log('   Sample R2 keys that would be deleted:');
    r2Keys.slice(0, 5).forEach((key) => console.log(`     - ${key}`));
    console.log('\n   To actually delete, re-run with: confirm=DELETE');
    await mongoose.disconnect();
    return;
  }

  console.log(`🗑️  Deleting ${r2Keys.length} file(s) from Cloudflare R2 (concurrency=${r2Concurrency})...`);
  const { deleted: r2Deleted, failedKeys } = await deleteR2Keys(r2Keys);
  console.log(`✅ R2 deletion done: ${r2Deleted} deleted, ${failedKeys.length} failed.\n`);

  if (failedKeys.length) {
    const failedLogPath = path.join(__dirname, `r2-delete-failures-${Date.now()}.json`);
    fs.writeFileSync(failedLogPath, JSON.stringify(failedKeys, null, 2));
    console.log(`⚠️  Failed R2 keys written to: ${failedLogPath}`);
    console.log('   These files were NOT removed from R2 — retry manually if needed.\n');
  }

  // Safety net: if R2 deletion is failing broadly (bad credentials/bucket/
  // network), don't proceed to wipe the database — that would leave orphaned
  // files in R2 with no DB records left to retry the cleanup from.
  const R2_FAILURE_ABORT_THRESHOLD = 0.05; // 5%
  const failureRate = r2Keys.length ? failedKeys.length / r2Keys.length : 0;
  if (failureRate > R2_FAILURE_ABORT_THRESHOLD) {
    console.error(
      `❌ Aborting before database deletion: R2 delete failure rate too high (${(failureRate * 100).toFixed(1)}%).`
    );
    console.error('   Database documents were NOT touched. Fix the R2 issue and re-run.');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`🗑️  Deleting ${submissionCount} srkTaskActionSubmission document(s) in batches of ${batchSize}...`);
  let submissionsDeleted = 0;
  // Delete in batches so a huge collection doesn't hold a single long-running op.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ids = await srkTaskActionSubmissionModel
      .find({}, { _id: 1 })
      .limit(batchSize)
      .lean();
    if (!ids.length) break;
    await srkTaskActionSubmissionModel.deleteMany({
      _id: { $in: ids.map((doc) => doc._id) },
    });
    submissionsDeleted += ids.length;
    process.stdout.write(`\r   Deleted ${submissionsDeleted}/${submissionCount}`);
  }
  console.log(`\n✅ srkTaskActionSubmission cleared (${submissionsDeleted} deleted).\n`);

  console.log(`🗑️  Deleting ${todoCount} growPackageTodo document(s) in batches of ${batchSize}...`);
  let todosDeleted = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ids = await growPackageTodoModel.find({}, { _id: 1 }).limit(batchSize).lean();
    if (!ids.length) break;
    await growPackageTodoModel.deleteMany({ _id: { $in: ids.map((doc) => doc._id) } });
    todosDeleted += ids.length;
    process.stdout.write(`\r   Deleted ${todosDeleted}/${todoCount}`);
  }
  console.log(`\n✅ growPackageTodo cleared (${todosDeleted} deleted).\n`);

  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`srkTaskActionSubmission deleted: ${submissionsDeleted}`);
  console.log(`growPackageTodo deleted:         ${todosDeleted}`);
  console.log(`R2 files deleted:                ${r2Deleted}`);
  console.log(`R2 files failed (see log):       ${failedKeys.length}`);
  console.log('='.repeat(80));

  await mongoose.disconnect();
  console.log('\n✅ Disconnected from database');
}

run().catch((error) => {
  console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
