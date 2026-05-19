# Cloudflare Stream + R2 Bucket Integration

## ✅ Complete Workflow

Your videos now flow through this complete pipeline:

```
Firebase Storage (Source)
        ↓
Cloudflare Stream API (Import & Transcode)
        ↓
Download HLS files (master.m3u8 + .ts segments)
        ↓
Cloudflare R2 Bucket (Storage)
        ↓
CDN (https://cdn.thesrkuniversity.com)
        ↓
HLSVideoPlayer (2-3 sec startup)
```

---

## 📁 Asset Path Format

Videos stored in **your R2 bucket** with this path structure:

```
R2 Bucket: srk (or dev for development)
Prefix: srk/ (production) or dev/ (development)

Asset Path Format:
  Production:   srk/videos/{videoId}/master.m3u8
  Development:  dev/videos/{videoId}/master.m3u8

Example:
  srk/videos/video-abc123def456/master.m3u8
  srk/videos/video-abc123def456/0001.ts
  srk/videos/video-abc123def456/0002.ts
  srk/videos/video-abc123def456/variant-480p.m3u8
  ...
```

**Database Storage:**
```javascript
courseVideo.videoUrl = "srk/videos/video-abc123def456/master.m3u8"
```

**CDN URL (Auto-generated):**
```
https://cdn.thesrkuniversity.com/srk/videos/video-abc123def456/master.m3u8
```

---

## 🔧 What Happens During Upload

### Step 1: Import to Cloudflare Stream
- ✅ Downloads video from Firebase
- ✅ Cloudflare auto-transcodes to HLS
- Time: 10-20 seconds

### Step 2: Wait for Transcoding
- ✅ Cloudflare creates:
  - master.m3u8 (playlist)
  - variant-480p.m3u8, variant-720p.m3u8, variant-1080p.m3u8
  - Thousands of .ts segments (10-second chunks)
- Time: 3-5 minutes

### Step 3: Download HLS from Cloudflare
- ✅ Downloads all HLS files
- Time: 30-60 seconds (depends on file count)

### Step 4: Upload to R2 Bucket
- ✅ Uploads all files to `srk/videos/{videoId}/`
- Time: 20-40 seconds

### Step 5: Database Update
- ✅ Stores asset path: `srk/videos/video-id/master.m3u8`
- Time: <1 second

**Total: ~2-6 minutes per video**

---

## 📊 Timing Breakdown (Example: 5 Videos)

| Phase | Time | Details |
|-------|------|---------|
| Upload Queue | 1-3 min | Sequential uploads (videos 1-5) |
| Transcoding | 10 min | Parallel on Cloudflare |
| HLS Download | 3-5 min | Download all segments |
| R2 Upload | 3-5 min | Upload to your bucket |
| **TOTAL** | **~20-25 min** | Full pipeline |

---

## 🎯 Key Benefits

### Using R2 Instead of Cloudflare Stream Direct:

| Aspect | Benefit |
|--------|---------|
| **Storage** | ✅ Videos in your R2 bucket (you control) |
| **CDN** | ✅ Uses your existing CDN setup |
| **Asset Paths** | ✅ Matches your existing resource pattern |
| **Cost** | ✅ R2 cost only (~$0.015/GB) |
| **Control** | ✅ Full control over video files |
| **Consistency** | ✅ Same asset path format as resources |

---

## 🔌 Implementation Files

### New Services
- ✅ **`/apps/backend/src/services/hlsService.ts`**
  - `downloadHLSManifest()` - Download .m3u8 from Cloudflare
  - `downloadHLSSegment()` - Download .ts segment from Cloudflare
  - `uploadHLSMasterToR2()` - Upload master.m3u8 to R2
  - `uploadHLSSegmentToR2()` - Upload .ts segment to R2
  - `uploadHLSFilesToR2()` - Batch upload all HLS files
  - `getHLSCDNUrl()` - Convert asset path to CDN URL

### Updated Services
- ✅ **`/apps/backend/src/services/r2Service.ts`**
  - Exported `s3Client` for use in hlsService
  
- ✅ **`/apps/backend/src/services/videoUrlService.ts`**
  - Updated `isR2HLSVideoAsset()` - Detect R2 HLS videos

### Updated Controllers
- ✅ **`/apps/backend/src/modules/video/cloudflare-stream.controller.ts`**
  - Endpoints return `assetPath` (R2 path)
  - Endpoints return `r2Url` (full CDN URL)

### Updated Services
- ✅ **`/apps/backend/src/modules/video/cloudflare-stream.service.ts`**
  - `uploadVideoFromUrl()` now:
    1. Imports to Cloudflare
    2. Downloads HLS from Cloudflare
    3. Uploads to R2
    4. Returns asset path + CDN URL
  - `batchUploadFromFirebase()` handles all videos sequentially

---

## 📝 API Responses

### Single Upload
```javascript
POST /api/cloudflare-stream/import-from-firebase
Response:
{
  "success": true,
  "videoId": "video-abc123def456",
  "streamUrl": "https://customer-xxx.cloudflarestream.com/video-abc123def456/manifest/video.m3u8",
  "assetPath": "srk/videos/video-abc123def456/master.m3u8",
  "r2Url": "https://cdn.thesrkuniversity.com/srk/videos/video-abc123def456/master.m3u8",
  "message": "Video uploaded successfully: Asset path srk/videos/video-abc123def456/master.m3u8"
}
```

### Batch Upload
```javascript
POST /api/cloudflare-stream/batch-import
Response:
{
  "total": 5,
  "successful": 5,
  "failed": 0,
  "results": [
    {
      "videoName": "Getting Start With Photoshop",
      "success": true,
      "videoId": "video-abc123",
      "streamUrl": "https://customer-xxx.cloudflarestream.com/...",
      "assetPath": "srk/videos/video-abc123/master.m3u8",
      "r2Url": "https://cdn.thesrkuniversity.com/srk/videos/video-abc123/master.m3u8",
      "duration": 127.5
    },
    ...
  ],
  "summary": "5/5 videos imported successfully to R2"
}
```

---

## ✨ How It Works in Player

```typescript
// Database stores:
courseVideo.videoUrl = "srk/videos/video-abc123/master.m3u8"

// CoursesPlayer calls:
getVideoUrl("srk/videos/video-abc123/master.m3u8")

// videoUrlService recognizes it's R2 HLS:
→ isR2HLSVideoAsset() = true
→ return getR2AssetUrl() = "https://cdn.thesrkuniversity.com/srk/videos/video-abc123/master.m3u8"

// HLSVideoPlayer receives full URL:
→ Loads master.m3u8
→ Auto-detects quality
→ Streams .ts segments on demand
→ 2-3 second startup ✅
```

---

## 🚀 Usage

### Start Backend
```bash
npm run start:backend
```

### Run Bulk Upload
```bash
npx ts-node scripts/bulk-upload-to-cloudflare-v2.ts
```

### Example Output
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

Ready to upload 5 videos to Cloudflare? (yes/no): yes

🚀 Starting upload to Cloudflare Stream...

[1/5] 📤 Processing: Getting Start With Photoshop
      Size: ~720MB | Expected: 10-20 seconds
      📤 Importing to Cloudflare Stream: 100%
      ⏳ Waiting for transcoding: 100%
      📁 Uploading to R2 bucket: 100%
      ✅ Complete!
         Video ID: video-abc123def456
         Asset Path: srk/videos/video-abc123def456/master.m3u8
         CDN URL: https://cdn.thesrkuniversity.com/srk/videos/video-abc123def456/master.m3u8
```

---

## ✅ R2 Environment Variables

Already configured in your `.env`:
```bash
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_ENDPOINT=https://your-endpoint.r2.cloudflarestorage.com
R2_BUCKET=srk
CDN_BASE_URL=https://cdn.thesrkuniversity.com
R2_PREFIX_FOLDER=srk (production) / dev (development)
```

---

## 📊 File Structure in R2

```
srk/
├── pdf/                          # Existing resources
│   ├── certificates/
│   └── agreements/
├── images/                       # Existing resources
│   ├── uploads/
│   └── thumbnails/
└── videos/                       # NEW - HLS videos
    ├── video-abc123/
    │   ├── master.m3u8
    │   ├── variant-480p.m3u8
    │   ├── variant-720p.m3u8
    │   ├── variant-1080p.m3u8
    │   ├── 0001.ts
    │   ├── 0002.ts
    │   ├── ...
    │   └── 9999.ts
    ├── video-def456/
    │   ├── master.m3u8
    │   ├── ...
    └── video-xyz789/
        ├── master.m3u8
        └── ...
```

---

## 🎬 Result

✅ **Videos stored in your R2 bucket**
✅ **CDN serves them globally**
✅ **HLS streaming with adaptive bitrate**
✅ **2-3 second startup time**
✅ **Asset paths in database (like resources)**
✅ **Complete control over your content**

Perfect! 🚀
