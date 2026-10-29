// KYC document photos are sent to the backend as base64 data URLs in a single
// request, so on a weak mobile connection their size is the upload time (and a
// dropped connection loses the whole submission). Shrink them first, and catch
// damaged photos when they are picked instead of after a long failed upload.

// The backend resizes to 1600px / JPEG 80 anyway, so this loses nothing.
const MAX_EDGE = 1600;
const QUALITY = 0.85;
const SKIP_BELOW_BYTES = 400 * 1024;
const PREPARE_TIMEOUT_MS = 20_000;

const UNREADABLE_MESSAGE =
  "This photo could not be read. Please retake it or choose another photo (JPG or PNG).";
const DAMAGED_MESSAGE =
  "This photo looks incomplete or damaged. Please retake it or choose another photo.";

export class UnreadableImageError extends Error {}

const readAsDataURL = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new UnreadableImageError(UNREADABLE_MESSAGE));
    reader.readAsDataURL(blob);
  });

const loadImage = (file: File): Promise<{ img: HTMLImageElement; release: () => void }> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const release = () => URL.revokeObjectURL(objectUrl);
    const img = new Image();
    img.onload = () => resolve({ img, release });
    img.onerror = () => {
      release();
      reject(new UnreadableImageError(UNREADABLE_MESSAGE));
    };
    img.src = objectUrl;
  });

// A JPEG that was cut short (the "Premature end of input file" failures on the
// server) never reaches its end-of-image marker, FF D9. That marker cannot occur
// inside the compressed image data, only ending an image, so the last one found
// tells us how far the file got. Phones may append data after a good JPEG
// (e.g. motion-photo video), so we must not require it at the very end: a cut
// file's only FF D9 is the one ending the small EXIF thumbnail near the start.
const isTruncatedJpeg = async (file: File): Promise<boolean> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!(bytes[0] === 0xff && bytes[1] === 0xd8)) return false;
  let lastEnd = -1;
  for (let i = bytes.length - 2; i >= 2; i--) {
    if (bytes[i] === 0xff && bytes[i + 1] === 0xd9) {
      lastEnd = i;
      break;
    }
  }
  if (lastEnd === -1) return true;
  return bytes.length > 200 * 1024 && lastEnd < 64 * 1024;
};

/** Throws UnreadableImageError (with a user-facing message) if the photo is unusable. */
export const checkImageFile = async (file: File): Promise<void> => {
  if (file.size === 0) throw new UnreadableImageError(UNREADABLE_MESSAGE);
  if (await isTruncatedJpeg(file)) throw new UnreadableImageError(DAMAGED_MESSAGE);
  const { release } = await loadImage(file);
  release();
};

const shrink = async (file: File): Promise<string> => {
  const { img, release } = await loadImage(file);
  try {
    const ratio = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * ratio);
    canvas.height = Math.round(img.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob) throw new Error("Compression failed");
    return await readAsDataURL(blob);
  } finally {
    release();
  }
};

/**
 * Data URL for a KYC photo, shrunk when that helps. Unreadable photos throw
 * UnreadableImageError; any other failure (or a stalled phone) falls back to
 * the original so a submission is never blocked by the shrinking step.
 */
export const prepareImageDataUrl = async (file: File): Promise<string> => {
  await checkImageFile(file);
  if (file.size < SKIP_BELOW_BYTES) return readAsDataURL(file);
  try {
    const original = readAsDataURL(file);
    const compressed = await Promise.race([
      shrink(file),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Compression timed out")), PREPARE_TIMEOUT_MS)
      ),
    ]);
    const originalUrl = await original;
    return compressed.length < originalUrl.length ? compressed : originalUrl;
  } catch (error) {
    if (error instanceof UnreadableImageError) throw error;
    return readAsDataURL(file);
  }
};
