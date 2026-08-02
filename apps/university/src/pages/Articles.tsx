import { useState } from "react";
import { useAOS } from "../lib/aos";
import { useSEO } from "../lib/useSEO";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { allArticles, topics } from "../data/articles";

export default function ArticlesPage() {
  useAOS();
  useSEO({
    title: "Articles & Guides | SRK University",
    description:
      "Explore expert guides on Premiere Pro, Photoshop, digital marketing, After Effects, graphic design, DaVinci Resolve, AI & automation, and more from SRK University.",
    path: "/articles",
  });
  const [activeTopic, setActiveTopic] = useState<string>("all");

  const filtered =
    activeTopic === "all"
      ? allArticles
      : allArticles.filter((a) => a.topicSlug === activeTopic);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-bgPrimary">

      {/* Page header — left-aligned split row, no hero */}
      <header className="pt-20 pb-14 px-6 sm:px-10 border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-3">
              SRK University
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
              Articles &amp; Guides
            </h1>
          </div>
          <div className="flex items-center gap-5 text-sm text-white/35 sm:text-right">
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-white/25" />
              {allArticles.length} articles
            </span>
            <span className="w-px h-4 bg-white/15" />
            <span>{topics.length} topics</span>
          </div>
        </div>
      </header>

      {/* Topic filter — sticky */}
      <div className="sticky top-[130px] z-30 bg-bgPrimary/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTopic("all")}
            className={`flex-shrink-0 px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-all duration-150 border ${
              activeTopic === "all"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/[0.1] text-white/40 hover:border-white/20 hover:text-white/65"
            }`}
          >
            All Topics
          </button>
          {topics.map((t) => (
            <button
              key={t.slug}
              onClick={() => setActiveTopic(t.slug)}
              className={`flex-shrink-0 px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-all duration-150 border ${
                activeTopic === t.slug
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-white/[0.1] text-white/40 hover:border-white/20 hover:text-white/65"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <main className="py-12 px-6 sm:px-10">
        <div className="max-w-screen-2xl mx-auto">

          <p className="text-xs text-white/25 uppercase tracking-widest mb-10">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            {activeTopic !== "all" &&
              ` · ${topics.find((t) => t.slug === activeTopic)?.label}`}
          </p>

          {featured && (
            <>
              {/* Featured — full-width horizontal row */}
              <Link
                to={`/articles/${featured.slug}`}
                className="group flex flex-col md:flex-row md:items-stretch border border-white/[0.08] hover:border-primary/25 bg-bgPrimary hover:bg-bgSecondary/40 transition-all duration-200 mb-px"
                data-aos="fade-up"
                data-aos-duration="600"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full md:w-72 aspect-[16/10] md:aspect-auto object-cover flex-shrink-0"
                  loading="eager"
                />

                {/* Left accent bar */}
                <div className="h-1 md:h-auto md:w-px bg-primary/40 group-hover:bg-primary/70 transition-colors duration-200 flex-shrink-0" />

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-14 p-8 sm:p-10 flex-1">
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium uppercase tracking-widest text-primary/70">
                        {featured.topic}
                      </span>
                      <span className="text-xs text-white/20 uppercase tracking-widest border border-white/[0.08] px-2 py-0.5">
                        Featured
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white/90 leading-snug group-hover:text-white transition-colors duration-200">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-white/45 leading-relaxed line-clamp-2">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-white/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{featured.readTime}</span>
                    </div>
                    <span className="flex items-center gap-2 text-primary/55 text-sm font-medium group-hover:text-primary group-hover:gap-3 transition-all duration-200">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Grid for remaining articles */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] border-t-0">
                  {rest.map((article, i) => (
                    <Link
                      key={article.slug}
                      to={`/articles/${article.slug}`}
                      className="group bg-bgPrimary hover:bg-bgSecondary/40 transition-colors duration-150 flex flex-col"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay={String((i % 3) * 55)}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full aspect-[16/10] object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-col flex-1 p-7">
                      <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-4">
                        {article.topic}
                      </p>
                      <h2 className="text-sm font-semibold text-white/85 leading-snug mb-3 flex-1">
                        {article.title}
                      </h2>
                      <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-5">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-white/25" />
                          <span className="text-xs text-white/30">{article.readTime}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-primary/45 text-xs font-medium group-hover:text-primary group-hover:gap-2.5 transition-all duration-200">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-4 text-white/15" />
              <p className="text-sm text-white/30">No articles in this topic yet.</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
