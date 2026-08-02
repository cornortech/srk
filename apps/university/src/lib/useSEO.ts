import { useEffect } from "react";

const SITE_URL = "https://thesrkuniversity.com";

interface SEOProps {
  title: string;
  description: string;
  path: string;
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Updates document title, description, canonical, and social meta tags
// per-route so each article gets unique, indexable metadata instead of
// sharing the single generic set hardcoded in index.html.
export function useSEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", url);
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, path]);
}
