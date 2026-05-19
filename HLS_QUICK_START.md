# How to Convert All Videos to HLS - Quick Start

## Problem Right Now
✅ Your videos play, but they take **15-40 seconds** to start because they're MP4 files

## Solution
Convert all MP4 videos to **HLS format** = **2-3 second startup**

---

## Option 1: Automatic (Easiest) - Recommended ⭐

### Step 1: Ensure Backend is Running
```bash
# Terminal 1: Start backend
npm run start:backend
# or use VS Code task "Serve Backend"
```

### Step 2: Run Bulk Transcoding
```bash
# Terminal 2: Run transcoding
cd /Users/santoshkunwar/Desktop/code/nx/srk
npx ts-node scripts/bulk-transcode-videos.ts
```

### Step 3: Answer Yes
```
⏱️ This will take approximately 300 minutes.
✅ Proceed with transcoding? (yes/no): yes
```

**What happens:**
- ✅ Converts all 5 videos to HLS
- ✅ Creates 3 quality versions (480p, 720p, 1080p)
- ✅ Uploads to Firebase automatically
- ✅ Updates database with HLS URLs
- ✅ Generates report when done

**Time:**
- Per 2GB video: ~60 minutes
- All 5 videos: ~5 hours (do overnight!)

---

## Option 2: Manual (One at a Time)

### Step 1: Start Backend
```bash
npm run start:backend
```

### Step 2: Get Your Video's Firebase URL

Find video URL from database:
```
https://firebasestorage.googleapis.com/v0/b/srk-univeristy.firebasestorage.app/o/video%2FGetting%20Start%20With%20Photoshop_01_01%20Version%2002.mp4?alt=media&token=...
```

### Step 3: Run Transcoding
```bash
curl -X POST http://localhost:3000/api/videos/transcode \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUrl": "YOUR_VIDEO_URL_HERE",
    "courseId": "67db790ff4fb5a1b181eeea6",
    "videoName": "photoshop-lesson-01"
  }'
```

### Step 4: Get HLS URL from Response
```json
{
  "success": true,
  "hlsUrl": "https://firebasestorage.googleapis.com/v0/b/.../master.m3u8?alt=media"
}
```

### Step 5: Update Database
Update the video document with this `hlsUrl`:
```javascript
db.coursevideos.updateOne(
  { _id: ObjectId("video-id") },
  { $set: { hlsPlaylistUrl: "PASTE_HLS_URL_HERE" } }
)
```

---

## Verify It Works

1. **Open your course page:**
   ```
   http://localhost:4200/study/courses/67db790ff4fb5a1b181eeea6
   ```

2. **Look for:**
   - 🟢 Video plays in 2-3 seconds? ✅ HLS working!
   - 🔵 "HLS Streaming" label on video? ✅ Perfect!

3. **Open DevTools (F12) → Network tab:**
   - See `master.m3u8` request
   - See `.m3u8` playlist request
   - See `.ts` segment requests (not entire file!)

---

## Troubleshooting

### Videos still slow?
- Make sure FFmpeg is installed:
  ```bash
  ffmpeg -version
  ```
- If not: `brew install ffmpeg`

### Script fails to start?
- Check backend is running: `http://localhost:3000`
- If error "Cannot find module": run `npm install`

### Out of disk space?
- Clean temp files: `rm -rf /tmp/hls-*`
- Ensure 10GB+ free space: `df -h`

### Database not updating?
- Check MongoDB connection
- Verify course ID is correct
- Use MongoDB Compass to update manually

---

## Real-Time Progress

While transcoding, you'll see:
```
[1/5] 🎥 Transcoding: Getting Start With Photoshop
────────────────────────────────────────────────────
[████████░░] 60%
```

Grab coffee ☕ and come back in 5 hours!

---

## After Transcoding

✅ Your videos will:
- Start playing in **2-3 seconds** (vs 30+ before)
- **Auto-adjust quality** based on network speed
- **Work on mobile** with limited bandwidth
- **Resume** if paused

---

## Time Breakdown

| Task | Time | Action |
|------|------|--------|
| Install FFmpeg | 2 min | `brew install ffmpeg` |
| Start backend | 1 min | `npm run start:backend` |
| Run transcoding | ~5h | `npx ts-node scripts/bulk-transcode-videos.ts` then `yes` |
| Verify | 5 min | Visit course page & check |
| **Total** | **~5.25 hours** | Can run overnight! |

---

## What I Already Set Up For You ✅

- ✅ `VideoTranscodingService` - Handles transcoding
- ✅ `VideoController` - Exposes API endpoints
- ✅ `bulk-transcode-videos.ts` - Batch script
- ✅ `CoursesPlayer.tsx` - Updated to show HLS videos
- ✅ Database schema - `hlsPlaylistUrl` field added

---

## Start Now! 🚀

```bash
# 1. Install FFmpeg (if needed)
brew install ffmpeg

# 2. Start backend
npm run start:backend

# 3. Run transcoding in another terminal
cd /Users/santoshkunwar/Desktop/code/nx/srk
npx ts-node scripts/bulk-transcode-videos.ts

# 4. Type: yes
```

That's it! Come back in 5 hours to super-fast videos! 🎬⚡

---

## Questions?

**"Will it delete my original videos?"** 
No, originals stay in Firebase. HLS files are new.

**"Can I stop mid-transcoding?"**
Yes, just Ctrl+C. Pick up where you left off next time.

**"Will videos work if transcoding fails?"**
Yes, they'll fall back to MP4 (slow but works).

**"How much storage will HLS use?"**
~50% less than original MP4s due to compression.

---

See also: `BULK_HLS_TRANSCODING_GUIDE.md` for detailed technical info.
