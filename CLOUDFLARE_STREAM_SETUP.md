# Cloudflare Stream Setup Guide - Upload HLS Videos

## Why Cloudflare Stream? (vs Firebase Transcoding)

| Feature | Firebase | Cloudflare Stream |
|---------|----------|-------------------|
| **Setup** | Complex (FFmpeg needed) | Simple (1-click) |
| **Transcoding** | Manual (FFmpeg) | Auto (included) |
| **Time per video** | 50-75 min | 5-15 min |
| **Cost** | Storage + bandwidth | $5-15/month flat |
| **Quality** | Manual setup | 10+ bitrates auto |
| **CDN** | Firebase CDN | Global Cloudflare |
| **Analytics** | Manual | Built-in |
| **Recommendation** | 🟡 Good | 🟢 Better for streaming |

---

## ✨ Benefits of Cloudflare Stream

✅ **No transcoding needed** - Upload MP4, Cloudflare handles everything
✅ **Instant HLS/DASH** - Videos ready to stream within minutes
✅ **Global CDN** - 280+ cities worldwide
✅ **Auto quality** - 10 bitrate levels automatically
✅ **Analytics included** - Views, duration, engagement
✅ **Cheaper** - Fixed monthly fee vs per-bandwidth
✅ **Private videos** - Signed URLs for authentication

---

## Step 1: Get Cloudflare Credentials

### 1.1: Create/Access Cloudflare Account
```
https://dash.cloudflare.com
```

### 1.2: Get Account ID
```
1. Dashboard → select your domain
2. Copy "Account ID" from bottom right
3. Format: abc123def456...
```

### 1.3: Create API Token
```
1. Profile → API Tokens (top right)
2. Click "Create Token"
3. Use template: "Edit Cloudflare Stream"
4. Select permissions:
   ✅ Account.Stream
   ✅ Account.Account Settings
5. Set permissions: All zones
6. Copy token: cl_xyz123abc456...
```

### 1.4: Get Zone ID (optional, for advanced features)
```
Dashboard → select domain → Overview → Zone ID
```

---

## Step 2: Configure Backend

### 2.1: Add Environment Variables

**File:** `.env` (or `.env.local`)

```bash
# Cloudflare Stream Credentials
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ZONE_ID=your_zone_id_here    # Optional
```

### 2.2: Example `.env`:
```bash
# Database
DATABASE_URL=mongodb://...

# Firebase (existing)
FIREBASE_PROJECT_ID=srk-univeristy
FIREBASE_STORAGE_BUCKET=srk-univeristy.appspot.com

# Cloudflare Stream (NEW)
CLOUDFLARE_ACCOUNT_ID=2d3c4d5e6f7g8h9i0j
CLOUDFLARE_API_TOKEN=cl_abcdefghijklmnopqrstuvwxyz123456789
CLOUDFLARE_ZONE_ID=abc123def456789xyz
```

### 2.3: Verify Setup
```bash
# Check environment variables are loaded
echo $CLOUDFLARE_ACCOUNT_ID
echo $CLOUDFLARE_API_TOKEN
```

---

## Step 3: Install Dependencies

```bash
cd /Users/santoshkunwar/Desktop/code/nx/srk

npm install form-data axios
```

---

## Step 4: Update Backend Module

**File:** `/apps/backend/src/modules/video/video.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { VideoTranscodingService } from './video-transcoding.service';
import { VideoController } from './video.controller';
import { CloudflareStreamController } from './cloudflare-stream.controller';
import CloudflareStreamService from './cloudflare-stream.service';

@Module({
  controllers: [VideoController, CloudflareStreamController],
  providers: [VideoTranscodingService, CloudflareStreamService],
  exports: [VideoTranscodingService, CloudflareStreamService],
})
export class VideoModule {}
```

---

## Step 5: Update Course Player Component

**File:** `/apps/university/src/components/dashboard/courses/CoursesPlayer.tsx`

Update to support Cloudflare URLs:

```typescript
/**
 * Determine if video should use HLS playback
 * Check for:
 * 1. Cloudflare Stream URL (ends with .m3u8)
 * 2. HLS playlist URL
 * 3. .m3u8 extension in videoUrl
 */
const isHLSVideo = (video: ExtendedCourseVideo): boolean => {
  return !!(
    video.hlsPlaylistUrl ||
    video.videoUrl?.toLowerCase().includes('cloudflarestream.com') ||
    video.videoUrl?.toLowerCase().endsWith(".m3u8")
  );
};
```

---

## Step 6: Start Backend

```bash
npm run start:backend
```

**Verify:**
```bash
curl http://localhost:3000/api/cloudflare-stream/health
```

---

## Step 7: Bulk Upload Videos to Cloudflare

### Option A: Automatic Upload (Recommended)

```bash
# Terminal 2
cd /Users/santoshkunwar/Desktop/code/nx/srk

npx ts-node scripts/bulk-upload-to-cloudflare.ts
```

**Process:**
1. Fetches all videos from database
2. Uploads each to Cloudflare (pulls from Firebase URL)
3. Cloudflare auto-transcodes
4. Updates database with Cloudflare URLs
5. Generates report

**Expected output:**
```
☁️  Cloudflare Stream - Bulk Video Upload
==========================================

📹 Fetching videos from database...

📊 Found 5 videos to upload:

  1. Getting Start With Photoshop (Course: 67db790ff4fb5a1b181eeea6)
  2. Advanced Photoshop Techniques (Course: 67db790ff4fb5a1b181eeea6)
  ...

✅ Proceed with uploading to Cloudflare? (yes/no): yes

🚀 Starting bulk upload to Cloudflare Stream...

[1/5] ☁️  Uploading: Getting Start With Photoshop
──────────────────────────────────────────────────
✅ Success in 12s
🎥 Cloudflare Video ID: video_123abc456def
📍 Stream URL: https://customer-xxx.cloudflarestream.com/video_123abc456def/manifest/video.m3u8

...

📊 UPLOAD SUMMARY
============================================================
✅ Successful: 5/5
   • Getting Start With Photoshop (12s) - ID: video_123abc456def
   • Advanced Photoshop Techniques (15s) - ID: video_789ghi012jkl
   ...

⏱️  Total time: 1m 25s
📈 Success rate: 100%
```

### Option B: Manual Upload (Single Video)

```bash
curl -X POST http://localhost:3000/api/cloudflare-stream/import-from-firebase \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUrl": "https://firebasestorage.googleapis.com/v0/b/srk-univeristy.firebasestorage.app/o/video%2FPhotoshop.mp4?alt=media&token=...",
    "courseId": "67db790ff4fb5a1b181eeea6",
    "videoName": "photoshop-lesson-01"
  }'
```

**Response:**
```json
{
  "success": true,
  "videoId": "video_abc123def456",
  "streamUrl": "https://customer-xxx.cloudflarestream.com/video_abc123def456/manifest/video.m3u8",
  "message": "Video imported successfully to Cloudflare Stream"
}
```

---

## Step 8: Update Database

After upload completes, database records should be automatically updated with:

```javascript
{
  _id: "video-id",
  name: "Getting Start With Photoshop",
  videoUrl: "original-firebase-url",
  cloudflareVideoId: "video_abc123def456",        // NEW
  cloudflareStreamUrl: "https://customer-xxx.../manifest/video.m3u8", // NEW
  hlsPlaylistUrl: "https://customer-xxx.../manifest/video.m3u8"  // Alternative
}
```

If manual update needed:
```javascript
db.coursevideos.updateOne(
  { _id: ObjectId("video-id") },
  {
    $set: {
      cloudflareVideoId: "video_abc123def456",
      hlsPlaylistUrl: "https://customer-xxx.cloudflarestream.com/video_abc123def456/manifest/video.m3u8"
    }
  }
)
```

---

## Step 9: Verify It Works

1. **Open course page:**
   ```
   http://localhost:4200/study/courses/67db790ff4fb5a1b181eeea6
   ```

2. **Observe:**
   - 🟢 Video plays in 2-3 seconds
   - 🔵 "HLS Streaming" label visible
   - ⚡ Quality auto-adjusts based on bandwidth

3. **Check Network (DevTools F12):**
   - Request: `master.m3u8` (instant)
   - Request: `variant.m3u8` (instant)
   - Requests: `.ts` segments on-demand

---

## Monitoring & Management

### Check Video Status
```bash
curl http://localhost:3000/api/cloudflare-stream/VIDEO_ID
```

### Get Analytics
```bash
curl http://localhost:3000/api/cloudflare-stream/VIDEO_ID/analytics
```

### Monitor from Dashboard
```
https://dash.cloudflare.com/account/stream
```

### View Stream Usage
```
Dashboard → Stream → Usage
```

---

## Troubleshooting

### Error: "Missing Cloudflare credentials"
```bash
# Set environment variables
export CLOUDFLARE_ACCOUNT_ID=your_id
export CLOUDFLARE_API_TOKEN=your_token

# Verify
echo $CLOUDFLARE_ACCOUNT_ID
```

### Error: "Invalid API token"
- Verify token copied correctly (no extra spaces)
- Token format should be: `cl_xxxxxxxx...`
- Create new token if needed: https://dash.cloudflare.com/profile/api-tokens

### Error: "Invalid account ID"
- Copy exact Account ID from dashboard
- Format: alphanumeric string like `2d3c4d5e6f7g8h9i0j`

### Videos not playing
- Wait 5-10 minutes for Cloudflare transcoding
- Check dashboard for video status: Ready?
- Verify HLS URL is correct (ends with `/manifest/video.m3u8`)

### Slow uploads from Firebase
- This is normal for large files
- Cloudflare pulls directly from Firebase URL
- Don't interrupt the process

---

## Cloudflare Dashboard

### Access Stream Dashboard
```
https://dash.cloudflare.com/account/stream
```

### What You'll See
- **Videos** - All uploaded videos with status
- **Usage** - Bandwidth, storage used
- **Analytics** - Views, watch time, geography
- **Settings** - Webhook URLs, CORS policies

### Monitor Transcoding
1. Dashboard → Stream → Videos
2. Click video name
3. See transcoding progress (%)
4. Status: Processing → Ready

---

## Cost Breakdown (Cloudflare Stream)

```
Cloudflare Stream Pricing:
- $5/month (includes 100GB/month storage)
- $0.50/1000 additional views
- $0.05/GB additional storage

Example for 5×2GB videos:
- Monthly: $5 + (streams × $0.50/1000)
- Storage: 10GB well under 100GB limit
- Total: ~$5-15/month depending on views

vs Firebase:
- Storage: $0.018/GB/month = $0.18/month
- Egress: $0.12/GB × 100 viewers × 2GB = $24/month
- Total: ~$24+/month per 100 viewers
```

---

## Migration Path

### Today
- ✅ Videos still on Firebase (MP4 format)
- ✅ Slow playback (15-40 seconds)

### After Upload to Cloudflare
- ✅ Videos on Cloudflare (HLS format)
- ✅ Fast playback (2-3 seconds)
- ✅ Auto quality adjustment
- ✅ Global CDN delivery

### Optional: Cleanup
- Keep Firebase copies (backup)
- Or delete Firebase videos to save storage

---

## API Reference

### Upload Video from Firebase
```
POST /api/cloudflare-stream/import-from-firebase
Body: {
  firebaseUrl: string,
  courseId: string,
  videoName: string
}
```

### Batch Upload
```
POST /api/cloudflare-stream/batch-import
Body: {
  videos: [{
    firebaseUrl: string,
    courseId: string,
    videoName: string
  }]
}
```

### Get Video Details
```
GET /api/cloudflare-stream/:videoId
```

### Get Analytics
```
GET /api/cloudflare-stream/:videoId/analytics
```

### Generate Signed URL (for private videos)
```
POST /api/cloudflare-stream/:videoId/generate-signed-url
Body: { expirationSeconds: number }
```

---

## Next Steps

1. ✅ Create Cloudflare account
2. ✅ Get credentials (Account ID + API Token)
3. ✅ Set environment variables
4. ✅ Install dependencies
5. ✅ Update backend module
6. ✅ Start backend server
7. ✅ Run bulk upload script
8. ✅ Verify videos play fast

**Timeline:** 30 minutes setup + 15-60 minutes upload (depending on video sizes)

---

## Commands Reference

```bash
# Get Account ID (run in browser console at https://dash.cloudflare.com)
console.log(document.querySelector('[data-test="account-id"]').innerText)

# Set environment variables
export CLOUDFLARE_ACCOUNT_ID=your_id
export CLOUDFLARE_API_TOKEN=your_token

# Start backend
npm run start:backend

# Bulk upload to Cloudflare
npx ts-node scripts/bulk-upload-to-cloudflare.ts

# Check video status
curl http://localhost:3000/api/cloudflare-stream/VIDEO_ID

# Get analytics
curl http://localhost:3000/api/cloudflare-stream/VIDEO_ID/analytics
```

---

Ready to upload to Cloudflare? Start with **Step 1: Get Credentials** above! 🚀
