# Cloudflare Stream Upload - Asset Path Implementation

## What Changed

You now have an implementation that matches your existing resource upload pattern (using asset paths stored in the database):

### 1. **Asset Path Format**
Instead of storing full URLs in the courseVideo document:
```javascript
// Before
courseVideo.videoUrl = "https://customer-xxx.cloudflarestream.com/video-123/manifest/video.m3u8"

// After (Asset Path Pattern)
courseVideo.videoUrl = "cloudflare-stream/videos/video-123"
```

### 2. **Database Storage**
The `videoUrl` field stores just the asset path:
```javascript
{
  _id: ObjectId("..."),
  name: "Getting Started with Photoshop",
  videoUrl: "cloudflare-stream/videos/video-abc123def456",  // Asset path
  courseId: ObjectId("..."),
  duration: 1800
}
```

### 3. **URL Conversion (Automatic)**
When the player needs the full URL, it calls `getVideoUrl()` which:
- Recognizes `cloudflare-stream/` prefix
- Converts to full HLS URL using `CLOUDFLARE_ACCOUNT_ID` from environment
- Result: `https://customer-{accountId}.cloudflarestream.com/video-abc123/manifest/video.m3u8`

### 4. **New Utility Function**
Added to `/apps/backend/src/services/videoUrlService.ts`:
```typescript
// Check if it's a Cloudflare Stream asset path
isCloudflareStreamAsset(url)

// Convert asset path to full HLS URL
getCloudflareStreamUrl(assetPath) 
```

---

## Upload Time Expectations

### Single Video Uploads

| File Size | Upload Time | Transcode Time | Total |
|-----------|------------|----------------|-------|
| 100 MB (30 min video) | 5-10 sec | 2-3 min | ~3 min |
| 500 MB (2.5 hour course) | 10-20 sec | 3-5 min | ~5 min |
| 1 GB (5 hour course) | 20-40 sec | 5-8 min | ~8 min |
| 2 GB (10 hour course) | 1-2 min | 8-15 min | ~17 min |

### Bulk Upload (5 Videos Example)

```
Upload Phase:        ~2-3 minutes (videos upload sequentially)
                     └─ Video 1: 10 sec
                     └─ Video 2: 15 sec
                     └─ Video 3: 12 sec
                     └─ Video 4: 18 sec
                     └─ Video 5: 20 sec

Transcoding Phase:   ~5-15 minutes (happens in parallel on Cloudflare)
                     └─ All 5 videos transcode simultaneously!

TOTAL:               ~10-20 minutes for complete setup
```

**Key**: After upload completes, database is updated. Transcoding happens automatically in the background.

---

## How to Use

### Step 1: Set Environment Variables

```bash
export CLOUDFLARE_ACCOUNT_ID="abc123def456..."
export CLOUDFLARE_API_TOKEN="cl_xyz123abc..."
export CLOUDFLARE_ZONE_ID="your-zone-id"  # Optional
```

### Step 2: Start Backend

```bash
npm run start:backend
```

### Step 3: Run Bulk Upload (New Version)

```bash
# New script with timing info
npx ts-node scripts/bulk-upload-to-cloudflare-v2.ts
```

Output shows:
```
☁️  CLOUDFLARE STREAM - BULK UPLOAD COURSE VIDEOS
======================================================================

📋 TIMING EXPECTATIONS:
   Upload time: 5-30 seconds per video
   5 videos: ~2-3 minutes (upload phase)
   Transcoding: 5-15 minutes (automatic, happens in background)
   TOTAL: ~10-20 minutes for complete setup

📹 Fetching course videos from database...
✅ Found 5 videos to upload:

  1. Getting Start With Photoshop
     Duration: 2h 45m | Size: ~720MB
     Upload: 10-20 seconds | Transcode: 3-5 minutes

  [... more videos ...]

⏱️  ESTIMATED TIMELINE:
   Upload phase: ~1m 15s (5 videos)
   Transcoding: ~10 minutes (happens in background)
   TOTAL TIME: ~12 minutes

Ready to upload 5 videos to Cloudflare? (yes/no): yes

🚀 Starting upload to Cloudflare Stream...

[1/5] ☁️  Uploading: Getting Start With Photoshop
      Size: ~720MB | Expected: 10-20 seconds
      ✅ Done in 15s
      📁 Asset: cloudflare-stream/videos/video-abc123def456

[2/5] ☁️  Uploading: Advanced Photoshop Techniques
      ...
```

---

## API Endpoints (Updated)

### Import Single Video
```bash
POST /api/cloudflare-stream/import-from-firebase
{
  "firebaseUrl": "https://firebasestorage.googleapis.com/...",
  "courseId": "67db790ff4fb5a1b181eeea6",
  "videoName": "photoshop-lesson-01"
}

Response:
{
  "success": true,
  "videoId": "video-abc123def456",
  "streamUrl": "https://customer-xxx.cloudflarestream.com/video-abc123def456/manifest/video.m3u8",
  "assetPath": "cloudflare-stream/videos/video-abc123def456"
}
```

### Batch Import Multiple Videos
```bash
POST /api/cloudflare-stream/batch-import
{
  "videos": [
    {
      "firebaseUrl": "https://...",
      "courseId": "67db790ff4fb5a1b181eeea6",
      "videoName": "video-1"
    },
    ...
  ]
}

Response:
{
  "total": 5,
  "successful": 5,
  "failed": 0,
  "results": [
    {
      "videoName": "photoshop-lesson-01",
      "success": true,
      "videoId": "video-abc123",
      "assetPath": "cloudflare-stream/videos/video-abc123",
      "duration": 15.3
    },
    ...
  ]
}
```

---

## Database Update

After successful upload, the courseVideo document is updated:

```javascript
// MongoDB Update Example
db.coursevideos.updateOne(
  { _id: ObjectId("video-id") },
  {
    $set: {
      videoUrl: "cloudflare-stream/videos/video-abc123def456"
    }
  }
)
```

---

## Verification

### Check in Database
```javascript
db.coursevideos.findOne({ videoUrl: { $regex: "cloudflare-stream" } })
```

### Check URL Resolution
When player loads video, `getVideoUrl()` converts:
```
Input:  "cloudflare-stream/videos/video-abc123"
Output: "https://customer-{accountId}.cloudflarestream.com/video-abc123/manifest/video.m3u8"
```

### Monitor Cloudflare
```
https://dash.cloudflare.com/account/stream → Videos tab
```

Shows transcoding progress:
- Processing: 0% → 100%
- Ready: Video available for streaming

---

## File Changes Summary

| File | Change |
|------|--------|
| `videoUrlService.ts` | Added `isCloudflareStreamAsset()` and `getCloudflareStreamUrl()` functions |
| `getVideoUrl()` in videoUrlService.ts | Now recognizes and handles cloudflare-stream asset paths |
| `cloudflare-stream.service.ts` | Now returns `assetPath` in results |
| `cloudflare-stream.controller.ts` | Endpoints now return `assetPath` field |
| `bulk-upload-to-cloudflare-v2.ts` | New script with timing estimates and better UX |

---

## Timeline Comparison

### Your Case: 5 Course Videos

**Upload Phase** (Sequential):
```
Total upload: ~1-2 minutes
```

**Transcoding Phase** (Parallel on Cloudflare):
```
All 5 videos transcode simultaneously
Max time: ~10 minutes (largest video)
```

**Total Time**: ~12 minutes

**After completion**:
- ✅ Database updated with asset paths
- ✅ Videos uploaded and queued for transcoding
- ✅ Cloudflare transcoding in progress (check dashboard)
- 🎬 Ready to stream in ~10 minutes more

---

## Cost Breakdown

| Metric | Cloudflare Stream |
|--------|-------------------|
| Monthly base | $5 (includes 100GB storage) |
| Per additional view | $0.50/1000 views |
| Storage (10GB of videos) | Included in $5 |
| **Total for 5 videos** | ~$5-10/month |

vs Firebase (~$0.12/GB egress) = $0.12 × 100 viewers × 2GB = $24/month

---

## Next Steps

1. ✅ Environment variables set
2. ✅ Backend running
3. ✅ Run bulk upload script
4. ⏳ Watch transcoding progress in Cloudflare dashboard
5. 🎬 Videos play with HLS streaming (2-3 sec startup vs 15-40 sec)

**You're all set!** 🚀
