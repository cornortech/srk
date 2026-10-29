// Screenshots are sent to the backend as base64 data URLs, so their size is the
// whole upload time on a weak mobile connection. Shrink them first.
const MAX_EDGE = 1280;
const QUALITY = 0.72;
const SKIP_BELOW_BYTES = 300 * 1024;
const COMPRESS_TIMEOUT_MS = 15_000;

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const shrink = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image could not be decoded'));
    };
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const ratio = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? blobToDataUrl(blob).then(resolve, reject) : reject(new Error('Compression failed'))),
        'image/jpeg',
        QUALITY
      );
    };
    img.src = objectUrl;
  });

/**
 * Returns a data URL for the screenshot, shrunk when that helps. Never blocks
 * the submission: on any failure or a stalled phone it falls back to the
 * original data URL.
 */
export const compressScreenshot = async (
  file: File,
  originalDataUrl: string
): Promise<string> => {
  if (file.size < SKIP_BELOW_BYTES) return originalDataUrl;
  try {
    const compressed = await Promise.race([
      shrink(file),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Compression timed out')), COMPRESS_TIMEOUT_MS)
      ),
    ]);
    return compressed.length < originalDataUrl.length ? compressed : originalDataUrl;
  } catch {
    return originalDataUrl;
  }
};
