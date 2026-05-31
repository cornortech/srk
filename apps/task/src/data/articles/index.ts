export type { Article, ArticleSection } from './types';
export { TOPICS } from './types';
export { webDesignArticles } from './webDesign';

import { webDesignArticles } from './webDesign';
import type { Article } from './types';

export const allTaskArticles: Article[] = [
  ...webDesignArticles,
];
