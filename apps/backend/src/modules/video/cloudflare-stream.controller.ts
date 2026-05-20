import { Router, Request, Response } from 'express';
import { CloudflareStreamService } from './cloudflare-stream.service';

const router = Router();
let cloudflareStreamService: CloudflareStreamService;

// Initialize the service when the router is used
async function initializeService() {
  if (!cloudflareStreamService) {
    cloudflareStreamService = new CloudflareStreamService();
  }
}

router.post('/import-from-firebase', async (req: Request, res: Response) => {
  try {
    await initializeService();

    const { sourceUrl, videoName, courseId } = req.body;

    if (!sourceUrl || !videoName || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sourceUrl, videoName, courseId'
      });
    }

    const result = await cloudflareStreamService.uploadVideoFromUrl(
      sourceUrl,
      videoName,
      courseId,
      (stage, progress) => {
        console.log(`[UPLOAD] ${stage}: ${Math.round(progress * 100)}%`);
      }
    );

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error in import-from-firebase:', message);
    res.status(500).json({
      success: false,
      error: message
    });
  }
});

router.post('/batch-import', async (req: Request, res: Response) => {
  try {
    await initializeService();

    const { videoIds } = req.body;

    if (!Array.isArray(videoIds)) {
      return res.status(400).json({
        success: false,
        error: 'videoIds must be an array'
      });
    }

    const results = await cloudflareStreamService.batchUploadFromFirebase(videoIds);
    res.json({ success: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error in batch-import:', message);
    res.status(500).json({
      success: false,
      error: message
    });
  }
});

router.get('/:videoId', async (req: Request, res: Response) => {
  try {
    await initializeService();

    const details = await cloudflareStreamService.getVideoDetails(req.params.videoId);
    res.json({ success: !!details, data: details });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
});

router.get('/:videoId/analytics', async (req: Request, res: Response) => {
  try {
    await initializeService();

    const analytics = await cloudflareStreamService.getAnalytics(req.params.videoId);
    res.json({ success: !!analytics, data: analytics });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
});

router.post('/:videoId/generate-signed-url', async (req: Request, res: Response) => {
  try {
    await initializeService();

    const token = await cloudflareStreamService.generateSignedUrl(
      req.params.videoId,
      req.body?.expirationHours || 1
    );
    res.json({ success: !!token, token });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
});

export { router as cloudflareStreamRouter };
