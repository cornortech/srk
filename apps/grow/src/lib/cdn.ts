const GROW_CDN_BASE_URL = 'https://cdn.thesrkuniversity.com';

export const getGrowAssetUrl = (assetPath?: string | null): string => {
  if (!assetPath) return '';
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${GROW_CDN_BASE_URL}/${assetPath.replace(/^\/+/, '')}`;
};

export default getGrowAssetUrl;
