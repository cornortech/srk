const UNIVERSITY_CDN_BASE_URL = 'https://cdn.thesrkuniversity.com';

export const getUniversityAssetUrl = (
  assetPath?: string | null
): string => {
  if (!assetPath) return '';

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${UNIVERSITY_CDN_BASE_URL}/${assetPath.replace(/^\/+/, '')}`;
};
