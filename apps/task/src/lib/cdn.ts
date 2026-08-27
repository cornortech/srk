const TASK_CDN_BASE_URL = 'https://cdn.thesrkuniversity.com';

export const getTaskAssetUrl = (assetPath?: string | null): string => {
  if (!assetPath) return '';

  const trimmedPath = assetPath.trim();

  if (/^https?:\/\//i.test(trimmedPath)) {
    return trimmedPath;
  }

  return `${TASK_CDN_BASE_URL}/${trimmedPath.replace(/^\/+/, '')}`;
};
