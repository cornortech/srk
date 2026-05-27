export type { Article, ArticleBlock } from "./types";
export { topicMeta } from "./types";
export { premiereProArticles } from "./premiereProArticles";
export { photoshopArticles } from "./photoshopArticles";
export { digitalMarketingArticles } from "./digitalMarketingArticles";
export { afterEffectsArticles } from "./afterEffectsArticles";
export { graphicDesignArticles } from "./graphicDesignArticles";
export { premiereProArticles2 } from "./premiereProArticles2";
export { photoshopArticles2 } from "./photoshopArticles2";
export { digitalMarketingArticles2 } from "./digitalMarketingArticles2";
export { afterEffectsArticles2 } from "./afterEffectsArticles2";
export { graphicDesignArticles2 } from "./graphicDesignArticles2";
export { davinciArticles } from "./davinciArticles";
export { aiArticles } from "./aiArticles";
export { indesignArticles } from "./indesignArticles";
export { communicationArticles } from "./communicationArticles";

import { premiereProArticles } from "./premiereProArticles";
import { photoshopArticles } from "./photoshopArticles";
import { digitalMarketingArticles } from "./digitalMarketingArticles";
import { afterEffectsArticles } from "./afterEffectsArticles";
import { graphicDesignArticles } from "./graphicDesignArticles";
import { premiereProArticles2 } from "./premiereProArticles2";
import { photoshopArticles2 } from "./photoshopArticles2";
import { digitalMarketingArticles2 } from "./digitalMarketingArticles2";
import { afterEffectsArticles2 } from "./afterEffectsArticles2";
import { graphicDesignArticles2 } from "./graphicDesignArticles2";
import { davinciArticles } from "./davinciArticles";
import { aiArticles } from "./aiArticles";
import { indesignArticles } from "./indesignArticles";
import { communicationArticles } from "./communicationArticles";

export const allArticles = [
  ...premiereProArticles,
  ...premiereProArticles2,
  ...photoshopArticles,
  ...photoshopArticles2,
  ...digitalMarketingArticles,
  ...digitalMarketingArticles2,
  ...afterEffectsArticles,
  ...afterEffectsArticles2,
  ...graphicDesignArticles,
  ...graphicDesignArticles2,
  ...davinciArticles,
  ...aiArticles,
  ...indesignArticles,
  ...communicationArticles,
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
];
