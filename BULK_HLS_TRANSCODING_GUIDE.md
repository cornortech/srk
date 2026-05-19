# Bulk Video Transcoding to HLS - Complete Setup Guide

## Current Issue
❌ Videos play slowly because they're MP4 files (full download required)
✅ Solution: Convert to HLS format (streaming chunks)

**Expected result:**
- Current: 15-40 seconds to start playback
- After: 2-3 seconds to start playback

---

## Prerequisites

### 1. Install FFmpeg (if not already installed)

**macOS:**
```bash
brew install ffmpeg
ffmpeg -version  # Verify installation
```

**Ubuntu/Linux:**
```bash
sudo apt-get install ffmpeg
ffmpeg -version
```

**Windows:**
Download from: https://ffmpeg.org/download.html

### 2. Install Backend Dependencies

```bash
cd /Users/santoshkunwar/Desktop/code/nx/srk
npm install fluent-ffmpeg ffmpeg-static
```

### 3. Ensure Firebase Admin SDK is Configured

Your backend already has:
- ✅ `firebase-admin` initialized
- ✅ Service account credentials
- ✅ Storage bucket access

---

## Step-by-Step Setup

### Step 1: Create Video Module (Backend)

**Location:** `/apps/backend/src/modules/video/`

Create these files:
- ✅ `video-transcoding.service.ts` (I created this)
- ✅ `video.controller.ts` (I created this)
- `video.module.ts` (create below)

**File:** `/apps/backend/src/modules/video/video.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { VideoTranscodingService } from './video-transcoding.service';
import { VideoController } from './video.controller';

@Module({
  controllers: [VideoController],
  providers: [VideoTranscodingService],
  exports: [VideoTranscodingService],
})
export class VideoModule {}
```

### Step 2: Register Video Module in App Module

**File:** `/apps/backend/src/app.module.ts`

Add to imports:
```typescript
import { VideoModule } from './modules/video/video.module';

@Module({
  imports: [
    // ... other modules
    VideoModule,  // ✅ Add this
  ],
})
export class AppModule {}
```

### Step 3: Start Backend Server

```bash
cd /Users/santoshkunwar/Desktop/code/nx/srk
npm run start:backend
# Or use the "Serve Backend" task in VS Code
```

**Verify it's running:**
```bash
curl http://localhost:3000/api/videos/transcode \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUrl": "https://example.com/video.mp4",
    "courseId": "test",
    "videoName": "test"
  }'
```

---

## Method 1: Bulk Transcode All Videos (Recommended)

### Run the Batch Script

```bash
cd /Users/santoshkunwar/Desktop/code/nx/srk

# Make script executable
chmod +x scripts/bulk-transcode-videos.ts

# Run the transcoding script
npx ts-node scripts/bulk-transcode-videos.ts
```

**What it does:**
1. Fetches all videos from database
2. Checks which ones need HLS conversion
3. Transcodes each video to 3 quality levels (480p, 720p, 1080p)
4. Uploads HLS files to Firebase
5. Prints progress and summary

**Expected output:**
```
🎬 SRK University - Bulk Video Transcoding
=========================================

📹 Fetching videos from database...

📊 Found 5 videos to transcode:

  1. Getting Start With Photoshop (Course: 67db790ff4fb5a1b181eeea6)
  2. Advanced Photoshop Techniques (Course: 67db790ff4fb5a1b181eeea6)
  ... etc

⏱️ This will take approximately 225 minutes.
✅ Proceed with transcoding? (yes/no): yes

🚀 Starting batch transcoding...

[1/5] 🎥 Transcoding: Getting Start With Photoshop
─────────────────────────────────────────────────────
✅ Success in 2145s
📍 HLS URL: https://firebasestorage.googleapis.com/v0/b/srk-univeristy.firebasestorage.app/o/courses/...

... (more videos)

📊 TRANSCODING SUMMARY
============================================================
✅ Successful: 5/5
   • Getting Start With Photoshop (35 min 45 sec)
   • Advanced Photoshop Techniques (38 min 10 sec)
   ...

⏱️  Total time: 2h 57m 30s
📈 Success rate: 100%

✅ Transcoding complete! HLS URLs have been saved to database.
```

---

## Method 2: Transcode Single Video (Manual)

### Via API Endpoint

```bash
curl -X POST http://localhost:3000/api/videos/transcode \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUrl": "https://firebasestorage.googleapis.com/v0/b/srk-univeristy.firebasestorage.app/o/video%2FGetting%20Start%20With%20Photoshop_01_01%20Version%2002.mp4?alt=media&token=...",
    "courseId": "67db790ff4fb5a1b181eeea6",
    "videoName": "photoshop-lesson-01"
  }'
```

**Response:**
```json
{
  "success": true,
  "hlsUrl": "https://firebasestorage.googleapis.com/v0/b/srk-univeristy.firebasestorage.app/o/courses/67db790ff4fb5a1b181eeea6/videos/photoshop-lesson-01/master.m3u8?alt=media",
  "message": "Video transcoded successfully: ..."
}
```

### Update Database with HLS URL

After transcoding, update the video document in your database:

```javascript
// MongoDB example
db.coursevideos.updateOne(
  { _id: ObjectId("video-id-here") },
  {
    $set: {
      hlsPlaylistUrl: "https://firebasestorage.googleapis.com/v0/b/srk-univeristy.firebasestorage.app/o/courses/.../master.m3u8?alt=media"
    }
  }
)
```

---

## Time Estimation

### For a 2GB video:
```
480p variant: 10-15 minutes
720p variant: 15-20 minutes
1080p variant: 20-30 minutes
Upload to Firebase: 5-10 minutes
────────────────────────────
Total per video: 50-75 minutes
```

### For your 5 videos at 2GB each:
```
5 videos × 60 minutes = 300 minutes = 5 hours
(Running sequentially - could be optimized)
```

---

## Troubleshooting

### Error: "FFmpeg not found"
```bash
# Install FFmpeg
brew install ffmpeg

# Verify
ffmpeg -version
```

### Error: "ENOSPC: no space left on device"
- Your `/tmp` directory is full
- Solution: Clean temp files and ensure 10GB+ free space
```bash
rm -rf /tmp/hls-*
df -h  # Check free space
```

### Error: "Firebase upload failed"
- Check Firebase credentials
- Verify bucket exists
- Check IAM permissions
```bash
firebase projects:list
```

### Error: "Video file corrupted"
- Download source MP4 file again
- Check file integrity: `ffprobe video.mp4`

### Videos transcoding takes too long
- Reduce bitrates in `video-transcoding.service.ts`
- Use `-preset fast` instead of `-preset medium`
- Or run overnight

---

## Verification

### Check if HLS is working

1. **After transcoding**, videos should have `hlsPlaylistUrl` in database

2. **Visit your course page:**
   ```
   http://localhost:4200/study/courses/67db790ff4fb5a1b181eeea6
   ```

3. **Observe:**
   - 🔴 Red error → Still using old code
   - 🟢 Green video → HLS working! (2-3 sec startup)
   - 🔵 Blue "HLS Streaming" label → Perfect!

4. **Check Network Tab (DevTools):**
   - See `master.m3u8` load
   - See `720p-variant.m3u8` load
   - See `.ts` segments load (not entire file!)

---

## Optimizations

### Option 1: Parallel Transcoding (Faster)
Run multiple videos simultaneously:

```typescript
// Modify bulk-transcode-videos.ts to use Promise.all()
const allResults = await Promise.all(
  videosToTranscode.map(video => transcodeVideoAsync(video))
);
```

**Pros:** 5 hours → 1.5 hours
**Cons:** High CPU/memory usage

### Option 2: Lower Quality (Faster)
Modify bitrates in `video-transcoding.service.ts`:

```typescript
const variants = [
  { name: '480p', bitrate: '300k', ... },  // ⬇️ Reduced from 500k
  { name: '720p', bitrate: '1000k', ... }, // ⬇️ Reduced from 1500k
  { name: '1080p', bitrate: '2000k', ... } // ⬇️ Reduced from 3000k
];
```

**Pros:** 50% faster transcoding
**Cons:** Lower quality videos

---

## What Happens After Transcoding

### Before (MP4):
```
User plays video
     ↓
Downloads entire 2GB file
     ↓
Waits 30+ seconds
     ↓
Playback starts
```

### After (HLS):
```
User plays video
     ↓
Downloads master.m3u8 (1 KB) ← instant
     ↓
Downloads 720p-variant.m3u8 (20 KB) ← instant
     ↓
Downloads 1-2 segments (300 KB each) ← 2-3 seconds
     ↓
Playback starts ← 2-3 seconds total!
     ↓
Auto-adapts quality based on bandwidth
```

---

## Cleanup & Maintenance

### After successful transcoding:

1. **Verify all HLS URLs in database** are correct
2. **Delete original MP4 files** from Firebase (optional):
   ```bash
   gsutil rm gs://srk-univeristy.firebasestorage.app/video/**/*.mp4
   ```
3. **Keep backups** of original files (optional)

### Monitor:

```bash
# Check Firebase storage size
gsutil du -s gs://srk-univeristy.firebasestorage.app/

# Expected after HLS: 50-70% smaller than originals
```

---

## Next Steps

### Today:
1. ✅ Install FFmpeg
2. ✅ Register VideoModule in backend
3. ✅ Start backend server

### Tomorrow:
1. ✅ Run `npx ts-node scripts/bulk-transcode-videos.ts`
2. ✅ Monitor progress (takes 5-10 hours for all videos)
3. ✅ Test videos play with fast startup

### Result:
🎉 All videos streaming in 2-3 seconds instead of 30+ seconds!

---

## Commands Reference

```bash
# Start backend
npm run start:backend

# Run bulk transcoding
npx ts-node scripts/bulk-transcode-videos.ts

# Transcode one video
curl -X POST http://localhost:3000/api/videos/transcode \
  -H "Content-Type: application/json" \
  -d '{"firebaseUrl":"...", "courseId":"...", "videoName":"..."}'

# Check logs
tail -f /tmp/hls-*.log

# Monitor Firebase storage
gsutil du -s gs://srk-univeristy.firebasestorage.app/
```

---

**Ready to start?** Begin with installing FFmpeg and following Step-by-Step Setup above! 🚀
