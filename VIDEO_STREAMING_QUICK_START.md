# Quick Start: Implement Video Streaming Optimization

## Phase 1: Immediate (No Changes - Optimize Existing Setup)
**Estimated time: 5 minutes**

### Add Preload Optimization to Current Player
**File:** `apps/university/src/components/dashboard/courses/CoursesPlayer.tsx`

Change this:
```typescript
<video
  src={getUniversityAssetUrl(currentVideo?.videoUrl) || ""}
  className="absolute top-0 left-0 w-full h-full"
  controlsList="nodownload"
  controls
/>
```

To this:
```typescript
<video
  src={getUniversityAssetUrl(currentVideo?.videoUrl) || ""}
  className="absolute top-0 left-0 w-full h-full"
  controlsList="nodownload"
  controls
  preload="metadata"        // ✅ Load only metadata first
  crossOrigin="anonymous"   // ✅ Enable range requests
  onLoadStart={() => console.log('Loading...')}
  onCanPlay={() => console.log('Ready to play')}
/>
```

**Expected improvement:** Videos start playing 3-5 seconds faster

---

## Phase 2: Short Term (1-2 days) - Add HLS Support

### Step 1: Install Dependencies
```bash
npm install hls.js
npm install --save-dev @types/hls.js
```

### Step 2: Copy HLS Player Component
The `HLSVideoPlayer.tsx` has been created at:
```
apps/university/src/components/dashboard/courses/HLSVideoPlayer.tsx
```

### Step 3: Update Database Schema
Add `hlsPlaylistUrl` field to `TCourseVideo` type:

**File:** `apps/university/src/lib/types/entities.ts`
```typescript
export interface TCourseVideo {
  _id: string;
  name: string;
  videoUrl: string;
  hlsPlaylistUrl?: string;    // ✅ Add this
  duration?: number;
  courseId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Step 4: Update Course Player Component
Replace the current `CoursesPlayer.tsx` with the updated version from:
```
apps/university/src/components/dashboard/courses/CoursesPlayer.updated.tsx
```

Or manually apply these changes:
1. Import `HLSVideoPlayer` component
2. Add `isHLSVideo()` helper function
3. Conditionally render HLS or HTML5 player
4. Add error handling

---

## Phase 3: Medium Term (1-2 weeks) - Transcode Existing Videos

### Setup FFmpeg on Backend

**File:** `apps/backend/src/modules/video/video.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideoService {
  private bucket = admin.storage().bucket();

  async transcodeToHLS(firebaseUrl: string, courseId: string, videoName: string) {
    const tempDir = `/tmp/video-${Date.now()}`;
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // 1. Download from Firebase
      const inputFile = path.join(tempDir, 'input.mp4');
      await this.downloadFromFirebase(firebaseUrl, inputFile);

      // 2. Transcode with FFmpeg
      const hlsDir = path.join(tempDir, 'hls');
      fs.mkdirSync(hlsDir, { recursive: true });
      await this.transcodeWithFFmpeg(inputFile, hlsDir, videoName);

      // 3. Upload HLS files back to Firebase
      const playlistUrl = await this.uploadHLSToFirebase(hlsDir, courseId, videoName);

      // 4. Update database with hlsPlaylistUrl
      await this.updateCourseVideoWithHLS(courseId, videoName, playlistUrl);

      return { success: true, playlistUrl };
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
      }
    }
  }

  private async downloadFromFirebase(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      require('https').get(url, (response: any) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    });
  }

  private transcodeWithFFmpeg(inputFile: string, outputDir: string, videoName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const variants = [
        { name: '480p', bitrate: '500k', scale: '854x480' },
        { name: '720p', bitrate: '1500k', scale: '1280x720' },
        { name: '1080p', bitrate: '3000k', scale: '1920x1080' },
      ];

      let completed = 0;

      variants.forEach((variant) => {
        ffmpeg(inputFile)
          .outputOptions([
            `-b:v ${variant.bitrate}`,
            `-s ${variant.scale}`,
            '-c:v libx264',
            '-preset medium',
            '-c:a aac',
            '-b:a 128k',
            '-hls_time 10',
            '-hls_list_size 0',
            `-hls_segment_filename ${outputDir}/${videoName}-${variant.name}-%03d.ts`,
          ])
          .output(`${outputDir}/${videoName}-${variant.name}.m3u8`)
          .on('end', () => {
            completed++;
            if (completed === variants.length) {
              this.generateMasterPlaylist(outputDir, videoName, variants);
              resolve();
            }
          })
          .on('error', reject)
          .run();
      });
    });
  }

  private generateMasterPlaylist(
    outputDir: string,
    videoName: string,
    variants: Array<{ name: string; bitrate: string }>
  ): void {
    let content = '#EXTM3U\n#EXT-X-VERSION:3\n';
    variants.forEach((v) => {
      const bandwidth = parseInt(v.bitrate) * 1000;
      content += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth}\n`;
      content += `${videoName}-${v.name}.m3u8\n`;
    });
    fs.writeFileSync(path.join(outputDir, `${videoName}.m3u8`), content);
  }

  private async uploadHLSToFirebase(hlsDir: string, courseId: string, videoName: string): Promise<string> {
    const files = fs.readdirSync(hlsDir);
    const baseRemotePath = `courses/${courseId}/videos/${videoName}`;

    for (const file of files) {
      const localPath = path.join(hlsDir, file);
      const remotePath = `${baseRemotePath}/${file}`;

      await this.bucket.upload(localPath, {
        destination: remotePath,
        metadata: { cacheControl: 'public, max-age=86400' },
      });
    }

    const bucket = this.bucket.name;
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(baseRemotePath)}/master.m3u8?alt=media`;
  }

  private async updateCourseVideoWithHLS(courseId: string, videoName: string, playlistUrl: string): Promise<void> {
    // Update your database with hlsPlaylistUrl
    // Example (adjust to your actual ORM/database):
    // await CourseVideo.updateOne(
    //   { courseId, name: videoName },
    //   { hlsPlaylistUrl: playlistUrl }
    // );
  }
}
```

### Create API Endpoint

**File:** `apps/backend/src/modules/video/video.controller.ts`

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('api/videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post('transcode')
  async transcodeVideo(@Body() dto: { firebaseUrl: string; courseId: string; videoName: string }) {
    return this.videoService.transcodeToHLS(dto.firebaseUrl, dto.courseId, dto.videoName);
  }
}
```

### Call from Admin Panel

**File:** `apps/university/src/pages/admin/CoursesDetails.tsx`

```typescript
// After video upload, initiate transcoding
const response = await uploadVideoApi(data);

// Trigger HLS transcoding
try {
  const transcodeResult = await fetch(`${API_BASE_URL}/api/videos/transcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firebaseUrl: response.videoUrl,
      courseId: course._id,
      videoName: response.name
    })
  });
  
  const hlsData = await transcodeResult.json();
  
  // Update video record with HLS playlist URL
  // This will be picked up by the CoursePlayer component
  await updateCourseVideoApi(response._id, { hlsPlaylistUrl: hlsData.playlistUrl });
  show('Video transcoding complete!', 'success');
} catch (error) {
  console.error('Transcoding failed:', error);
}
```

---

## Performance Gains Expected

### Phase 1 (Preload optimization)
- ⏱️ Start playback: ~5-10 seconds (vs 15-30 seconds)
- 💾 Bandwidth: No change
- 🚀 Implementation: 5 minutes

### Phase 2 (HLS support)
- ⏱️ Start playback: ~2-3 seconds
- 💾 Bandwidth: 50% reduction
- 🚀 Implementation: 2 hours

### Phase 3 (Full HLS transcode)
- ⏱️ Start playback: ~2 seconds
- 💾 Bandwidth: 50-70% reduction
- 🎯 Quality: Adaptive to network
- 🚀 Implementation: 1-2 weeks

---

## Troubleshooting

### Video won't play with HLS
**Check:**
1. Browser supports HLS (Chrome 35+, Firefox 43+, Safari 6+)
2. CORS headers on Firebase (Allow-Control-Allow-Origin: *)
3. Playlist URL is accessible

### Transcoding fails
**Solutions:**
1. Ensure FFmpeg is installed: `ffmpeg -version`
2. Check disk space for temp files
3. Verify Firebase credentials
4. Monitor logs for specific errors

### HLS.js console errors
**Common errors:**
- "Playlist failed to load" → Check CORS
- "Segment failed" → Check Firebase URL format
- "Cannot determine buffer length" → Too many segments

---

## Testing Video Streaming

```bash
# Test HLS playback locally
npm run dev

# Visit: http://localhost:5173/study/courses/{courseId}

# Check network tab to see:
# - master.m3u8 (1-2 KB, instant)
# - variant.m3u8 (10-20 KB, instant)
# - .ts segments (50-500 KB each, on-demand)
```

---

## Monitoring & Metrics

Add to your video player to track performance:

```typescript
const videoMetrics = {
  startTime: Date.now(),
  firstByteTime: null,
  canPlayTime: null,
  playStartTime: null,
  endTime: null,
};

video.addEventListener('loadstart', () => {
  videoMetrics.firstByteTime = Date.now();
});

video.addEventListener('canplay', () => {
  videoMetrics.canPlayTime = Date.now();
  console.log(`Time to play: ${videoMetrics.canPlayTime - videoMetrics.startTime}ms`);
});

video.addEventListener('play', () => {
  videoMetrics.playStartTime = Date.now();
});

video.addEventListener('ended', () => {
  videoMetrics.endTime = Date.now();
  console.log(`Total session: ${videoMetrics.endTime - videoMetrics.startTime}ms`);
});
```

---

## Next Steps

1. **Today:** Apply Phase 1 (preload optimization)
2. **This week:** Implement Phase 2 (HLS player)
3. **Next week:** Deploy Phase 3 (transcode pipeline)
4. **Ongoing:** Monitor performance metrics

Ready to implement? Let me know which phase you'd like to start with!
