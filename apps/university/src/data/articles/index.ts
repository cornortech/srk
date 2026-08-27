export type { Article, ArticleBlock } from "./types";
export { topicMeta } from "./types";
export { premiereProArticles } from "./premiereProArticles";
export { photoshopArticles } from "./photoshopArticles";
export { digitalMarketingArticles } from "./digitalMarketingArticles";
export { afterEffectsArticles } from "./afterEffectsArticles";
export { graphicDesignArticles } from "./graphicDesignArticles";
export { davinciArticles } from "./davinciArticles";
export { aiArticles } from "./aiArticles";
export { indesignArticles } from "./indesignArticles";
export { communicationArticles } from "./communicationArticles";
export { studentSuccessArticles } from "./studentSuccessArticles";

import { premiereProArticles } from "./premiereProArticles";
import { photoshopArticles } from "./photoshopArticles";
import { digitalMarketingArticles } from "./digitalMarketingArticles";
import { afterEffectsArticles } from "./afterEffectsArticles";
import { graphicDesignArticles } from "./graphicDesignArticles";
import { davinciArticles } from "./davinciArticles";
import { aiArticles } from "./aiArticles";
import { indesignArticles } from "./indesignArticles";
import { communicationArticles } from "./communicationArticles";
import { studentSuccessArticles } from "./studentSuccessArticles";

export const allArticles = [
  ...premiereProArticles,
  ...photoshopArticles,
  ...digitalMarketingArticles,
  ...afterEffectsArticles,
  ...graphicDesignArticles,
  ...davinciArticles,
  ...aiArticles,
  ...indesignArticles,
  ...communicationArticles,
  ...studentSuccessArticles,
];

export const topics = [
  { slug: "premiere-pro", label: "Premiere Pro" },
  { slug: "photoshop", label: "Photoshop" },
  { slug: "digital-marketing", label: "Digital Marketing" },
  { slug: "after-effects", label: "After Effects" },
  { slug: "graphic-design", label: "Graphic Design" },
  { slug: "davinci-resolve", label: "DaVinci Resolve" },
  { slug: "ai-automation", label: "AI & Automation" },
  { slug: "indesign", label: "Adobe InDesign" },
  { slug: "communication", label: "Communication Skills" },
  { slug: "student-success", label: "Student Success" },
];
