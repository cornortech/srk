export interface ArticleSection {
  heading: string;
  body: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  topicSlug: string;
  readTime: string;
  intro: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
}

export const TOPICS = [
  { slug: 'web-design', label: 'Web Design' },
  { slug: 'web-development', label: 'Web Development' },
  { slug: 'app-design', label: 'App Design' },
  { slug: 'graphics-design', label: 'Graphics Design' },
  { slug: 'ecommerce-marketing', label: 'Ecommerce Marketing' },
  { slug: 'digital-marketing', label: 'Digital Marketing' },
] as const;
