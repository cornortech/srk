export interface ArticleBlock {
  type: "h2" | "h3" | "p" | "ul" | "ol" | "image";
  text?: string;
  items?: string[];
  src?: string;
}

export interface Article {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  excerpt: string;
  readTime: string;
  image: string;
  content: ArticleBlock[];
}

export const topicMeta: Record<string, { label: string; color: string }> = {
  "premiere-pro": { label: "Premiere Pro", color: "text-primary" },
  "photoshop": { label: "Photoshop", color: "text-primary" },
  "digital-marketing": { label: "Digital Marketing", color: "text-primary" },
  "after-effects": { label: "After Effects", color: "text-primary" },
  "graphic-design": { label: "Graphic Design", color: "text-primary" },
  "davinci-resolve": { label: "DaVinci Resolve", color: "text-primary" },
  "ai-automation": { label: "AI & Automation", color: "text-primary" },
  "indesign": { label: "Adobe InDesign", color: "text-primary" },
  "communication": { label: "Communication Skills", color: "text-primary" },
  "student-success": { label: "Student Success", color: "text-primary" },
};
