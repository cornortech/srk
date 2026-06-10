export type { Article, ArticleSection } from './types';
export { TOPICS } from './types';
export { webDesignArticles } from './webDesign';
export { webDevelopmentArticles } from './webDevelopment';
export { appDesignArticles } from './appDesign';
export { graphicsDesignArticles } from './graphicsDesign';
export { ecommerceMarketingArticles } from './ecommerceMarketing';
export { digitalMarketingArticles } from './digitalMarketing';

import { webDesignArticles } from './webDesign';
import { webDevelopmentArticles } from './webDevelopment';
import { appDesignArticles } from './appDesign';
import { graphicsDesignArticles } from './graphicsDesign';
import { ecommerceMarketingArticles } from './ecommerceMarketing';
import { digitalMarketingArticles } from './digitalMarketing';
import type { Article } from './types';

export const allTaskArticles: Article[] = [
  ...webDesignArticles,
  ...webDevelopmentArticles,
  ...appDesignArticles,
  ...graphicsDesignArticles,
  ...ecommerceMarketingArticles,
  ...digitalMarketingArticles,
];
