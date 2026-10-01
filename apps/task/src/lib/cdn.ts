const TASK_CDN_BASE_URL = 'https://cdn.thesrkuniversity.com';

export const getTaskAssetUrl = (assetPath?: string | null): string => {
  if (!assetPath) return '';

  const trimmedPath = assetPath.trim();

  if (/^https?:\/\//i.test(trimmedPath)) {
    return trimmedPath;
  }

  return `${TASK_CDN_BASE_URL}/${trimmedPath.replace(/^\/+/, '')}`;
};

// Task links are admin-entered and sometimes lack a scheme (e.g. "tiktok.com/@x").
// Without one the browser treats the href as relative and opens srktask.com/task/tiktok.com/...
export const toExternalUrl = (url?: string | null): string => {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '#';
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
};
