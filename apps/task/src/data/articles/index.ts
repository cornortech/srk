export type { Article, ArticleSection } from './types';
export { TOPICS } from './types';
export { webDesignArticles } from './webDesign';
export { webDevelopmentArticles } from './webDevelopment';
export { appDesignArticles } from './appDesign';

import { webDesignArticles } from './webDesign';
import { webDevelopmentArticles } from './webDevelopment';
import { appDesignArticles } from './appDesign';
import type { Article } from './types';

export const allTaskArticles: Article[] = [
  ...webDesignArticles,
  ...webDevelopmentArticles,
  ...appDesignArticles,
];
