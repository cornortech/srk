# Video Streaming Optimization Guide for Firebase

## Current Issue
- Videos are served as full files via HTML5 `<video>` element
- Entire video must be downloaded before playback starts
- No adaptive bitrate/quality adjustment
- Poor experience on slower networks
- High Firebase bandwidth costs

---

## Solution 1: HLS Streaming (Recommended for Production)

### What is HLS?
HLS (HTTP Live Streaming) breaks videos into small chunks (typically 10 seconds each) and serves multiple quality versions. The player automatically selects the best quality based on bandwidth.

### Setup Steps

#### 1. **Install Dependencies**
```bash
npm install hls.js ffmpeg-static fluent-ffmpeg
# or
yarn add hls.js ffmpeg-static fluent-ffmpeg
```

#### 2. **Add HLS.js Package to package.json**
In `/package.json`:
```json
{
  "dependencies": {
    "hls.js": "^1.4.12",
    "ffmpeg-static": "^6.0.0",
    "fluent-ffmpeg": "^2.1.2"
  },
  "devDependencies": {
    "@types/hls.js": "^0.13.2"
  }
}
```

#### 3. **Backend: Create Video Transcoding Endpoint**
Located: `/apps/backend/src/modules/video/video.controller.ts`

```typescript
import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { VideoService } from './video.service';
import { TranscodeVideoDto } from './dto/transcode-video.dto';

@Controller('api/videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post('transcode')
  async transcodeVideo(@Body() dto: TranscodeVideoDto) {
    const result = await this.videoService.transcodeToHLS(
      dto.firebaseUrl,
      dto.courseId,
      dto.videoName
    );
    return result;
  }
}
```

#### 4. **Backend: Implement Transcoding Service**
Create `/apps/backend/src/modules/video/video.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

@Injectable()
export class VideoService {
  private bucket = admin.storage().bucket();

  async transcodeToHLS(
    firebaseUrl: string,
    courseId: string,
    videoName: string
  ) {
    const tempDir = `/tmp/video-${Date.now()}`;
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // Download from Firebase
      const inputFile = path.join(tempDir, 'input.mp4');
      await this.downloadFile(firebaseUrl, inputFile);

      // Transcode to HLS
      const hlsDir = path.join(tempDir, 'hls');
      fs.mkdirSync(hlsDir, { recursive: true });
      
      await this.transcodeWithFFmpeg(inputFile, hlsDir, videoName);

      // Upload HLS files back to Firebase
      const playlistUrl = await this.uploadHLSFiles(
        hlsDir,
        courseId,
        videoName
      );

      return { success: true, playlistUrl };
    } finally {
      // Cleanup
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
      }
    }
  }

  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', reject);
    });
  }

  private transcodeWithFFmpeg(
    inputFile: string,
    outputDir: string,
    videoName: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create variants: 480p, 720p, 1080p
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
              // Generate master playlist
              this.generateMasterPlaylist(
                outputDir,
                videoName,
                variants
              );
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

    variants.forEach((variant) => {
      const bandwidth = parseInt(variant.bitrate) * 1000;
      content += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth}\n`;
      content += `${videoName}-${variant.name}.m3u8\n`;
    });

    fs.writeFileSync(
      path.join(outputDir, `${videoName}.m3u8`),
      content
    );
  }

  private async uploadHLSFiles(
    hlsDir: string,
    courseId: string,
    videoName: string
  ): Promise<string> {
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
}
```

#### 5. **Frontend: Update Course Player**
Update `/apps/university/src/components/dashboard/courses/CoursesPlayer.tsx`:

```typescript
import HLSVideoPlayer from './HLSVideoPlayer';
// ... other imports

export default function CoursePlayer() {
  // ... existing code

  // Check if video has HLS playlist URL
  const videoSource = currentVideo?.hlsPlaylistUrl || 
    getUniversityAssetUrl(currentVideo?.videoUrl);
  const isHLS = currentVideo?.hlsPlaylistUrl ? true : false;

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* ... breadcrumb and other UI */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Player */}
        <div className="relative pt-[50.25%] w-full rounded-lg overflow-hidden md:col-span-2">
          {isHLS ? (
            <HLSVideoPlayer 
              playlistUrl={videoSource}
              poster={getUniversityAssetUrl(courseDetails?.img)}
              onError={(error) => console.error('Video error:', error)}
            />
          ) : (
            <video
              src={videoSource}
              className="absolute top-0 left-0 w-full h-full"
              controlsList="nodownload"
              controls
            />
          )}
        </div>

        {/* Chapter List */}
        {/* ... existing chapter list code */}
      </div>
    </div>
  );
}
```

---

## Solution 2: Progressive Download (Quick/Interim Fix)

If you can't implement HLS immediately, optimize the current video element:

```typescript
// Update CoursesPlayer.tsx

<video
  src={getUniversityAssetUrl(currentVideo?.videoUrl)}
  className="absolute top-0 left-0 w-full h-full"
  controlsList="nodownload"
  controls
  preload="metadata"  // ✅ Add this - only load metadata initially
  crossOrigin="anonymous"  // ✅ Enable range requests
  onLoadStart={() => console.log('Starting download')}
  onCanPlay={() => console.log('Ready to play')}
/>
```

**Benefits of this approach:**
- Starts playback within 5-10 seconds
- No additional infrastructure needed
- Works with current Firebase setup

---

## Solution 3: Cloudflare Stream (Alternative to HLS)

If you want a managed solution without running transcoding:

```typescript
// 1. Upload video to Cloudflare Stream
// 2. Get streaming URL
// 3. Use in player

<iframe
  src="https://iframe.cloudflarestream.com/{stream-id}/iframe"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full h-full"
/>
```

**Pros:**
- Managed CDN delivery
- Automatic transcoding
- Analytics built-in

**Cons:**
- Monthly cost (~$5/stream/month + bandwidth)
- Vendor lock-in

---

## Comparison Table

| Feature | HLS | Progressive Download | Cloudflare Stream |
|---------|-----|--------------------|--------------------|
| Start Time | 2-3s | 5-10s | 1-2s |
| Adaptive Quality | ✅ Yes | ❌ No | ✅ Yes |
| Bandwidth Usage | ~50% less | ~100% | ~60% less |
| Setup Complexity | High | Low | Medium |
| Cost | Low (storage) | Low (storage) | Medium ($5-50/mo) |
| Control | Full | Full | Limited |

---

## Firebase Optimization Tips (All Solutions)

### 1. **Add Cache Headers to Firebase Storage**
```typescript
bucket.upload(file, {
  destination: destination,
  metadata: {
    cacheControl: 'public, max-age=2592000', // 30 days
    contentType: 'video/mp4'
  }
});
```

### 2. **Use Firebase Storage CDN**
- Videos in Firebase are automatically cached by Google's CDN
- No additional configuration needed
- Speeds up delivery globally

### 3. **Compress Videos Before Upload**
```bash
# Reduce file size while maintaining quality
ffmpeg -i input.mp4 \
  -c:v libx264 -preset medium -crf 28 \
  -c:a aac -b:a 128k \
  -maxrate 2500k -bufsize 5000k \
  output.mp4
```

**Before:** 2 GB → **After:** 400-600 MB (70% reduction)

### 4. **Enable Range Requests**
This allows browsers to download only needed portions:
```typescript
// CORS configuration for Firebase Storage
{
  "origin": ["https://yourdomain.com"],
  "method": ["GET", "HEAD", "DELETE"],
  "responseHeader": ["Accept-Ranges", "Content-Range"],
  "maxAgeSeconds": 3600
}
```

---

## Recommended Implementation Timeline

**Phase 1 (Immediate - 1-2 days):**
- ✅ Add `preload="metadata"` to video element
- ✅ Enable range requests in Firebase

**Phase 2 (Short-term - 1 week):**
- ✅ Implement Progressive Download optimization
- ✅ Add video compression before upload

**Phase 3 (Medium-term - 2-3 weeks):**
- ✅ Set up HLS transcoding pipeline
- ✅ Deploy HLS player component
- ✅ Gradually migrate existing videos

**Phase 4 (Long-term):**
- ✅ Move to CDN (Cloudflare, Bunny, etc.)
- ✅ Implement analytics/metrics
- ✅ Auto-transcode on upload

---

## Testing & Monitoring

```typescript
// Add performance metrics
const metrics = {
  startTime: performance.now(),
  firstFrameTime: null,
  fullLoadTime: null,
};

video.addEventListener('canplay', () => {
  metrics.firstFrameTime = performance.now() - metrics.startTime;
  console.log(`First frame: ${metrics.firstFrameTime}ms`);
});

video.addEventListener('ended', () => {
  metrics.fullLoadTime = performance.now() - metrics.startTime;
  console.log(`Total time: ${metrics.fullLoadTime}ms`);
});
```

---

## Immediate Action Items

1. Install HLS.js: `npm install hls.js`
2. Create HLSVideoPlayer component ✅ (done in codebase)
3. Update CoursesPlayer to support HLS playback
4. Set up backend transcoding endpoint (or use Cloudflare)
5. Test with long videos (30+ minutes)

Would you like me to:
- [ ] Set up the backend transcoding service?
- [ ] Configure the API endpoint for transcoding?
- [ ] Create a batch migration script for existing videos?
- [ ] Add performance monitoring/analytics?
