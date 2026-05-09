const TASK_CDN_BASE_URL = 'https://cdn.thesrkuniversity.com';

export const getTaskAssetUrl = (assetPath?: string | null): string => {
  if (!assetPath) return '';

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${TASK_CDN_BASE_URL}/${assetPath.replace(/^\/+/, '')}`;
};
