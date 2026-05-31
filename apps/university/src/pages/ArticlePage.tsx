import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, ChevronRight } from "lucide-react";
import { allArticles } from "../data/articles";
import type { ArticleBlock } from "../data/articles";

function renderBlock(block: ArticleBlock, i: number) {
  if (block.type === "h2") {
    return (
      <h2
        key={i}
        className="text-white font-semibold text-xl mt-12 mb-4 leading-snug pl-4 border-l-2 border-primary/50"
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return (
      <h3
        key={i}
        className="text-white/90 font-semibold text-base mt-8 mb-3 leading-snug"
      >
        {block.text}
      </h3>
    );
  }
  if (block.type === "p") {
    return (
      <p
        key={i}
        className="text-white/65 text-base leading-[1.85] mb-5"
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "ul") {
    return (
      <ul key={i} className="mb-6 flex flex-col gap-2.5 pl-1">
        {block.items?.map((item, j) => (
          <li
            key={j}
            className="flex items-start gap-3 text-white/60 text-base leading-[1.8]"
          >
            <span className="w-1 h-1 rounded-full bg-primary/60 mt-[0.72rem] flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol key={i} className="mb-6 flex flex-col gap-2.5 pl-1 list-none">
        {block.items?.map((item, j) => (
          <li
            key={j}
            className="flex items-start gap-3 text-white/60 text-base leading-[1.8]"
          >
            <span className="text-primary/65 font-mono text-xs mt-[0.48rem] flex-shrink-0 w-5 tabular-nums">
              {j + 1}.
            </span>
            {item}
          </li>
        ))}
      </ol>
    );
  }
  return null;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = allArticles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  const related = allArticles
    .filter((a) => a.topicSlug === article.topicSlug && a.slug !== article.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-bgPrimary">

      {/* Article header */}
      <header className="pt-20 pb-14 px-6 sm:px-10 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto">

          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm mb-10 transition-colors duration-150 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Articles
          </Link>

          <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-5">
            {article.topic}
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-[1.15] mb-6 tracking-tight">
            {article.title}
          </h1>

          <p className="text-base text-white/50 leading-relaxed mb-8">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="w-px h-3.5 bg-white/15" />
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              SRK University
            </span>
          </div>

        </div>
      </header>

      {/* Article body */}
      <main className="py-14 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto">

          <article>
            {article.content.map((block, i) => renderBlock(block, i))}
          </article>

          <div className="mt-16 pt-10 border-t border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-white/25 uppercase tracking-widest mb-1.5">
                Published by
              </p>
              <p className="text-sm font-semibold text-white">SRK University</p>
              <p className="text-xs text-white/35 mt-0.5">{article.topic}</p>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary/30 text-primary/65 text-sm font-medium transition-all duration-200 hover:border-primary hover:bg-primary hover:text-black"
            >
              Browse all articles
            </Link>
          </div>

        </div>
      </main>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-white/[0.06] py-16 px-6 sm:px-10">
          <div className="max-w-screen-2xl mx-auto">

            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-2">
                  Same topic
                </p>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  More on {article.topic}
                </h2>
              </div>
              <Link
                to="/articles"
                className="hidden sm:flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors duration-150 group"
              >
                View all{" "}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {related.map((a, i) => (
                <Link
                  key={a.slug}
                  to={`/articles/${a.slug}`}
                  className="group bg-bgPrimary hover:bg-bgSecondary/40 transition-colors duration-150 flex flex-col p-6"
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-delay={String(i * 60)}
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-3">
                    {a.topic}
                  </p>
                  <h3 className="text-sm font-semibold text-white/85 leading-snug flex-1 mb-4">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-1.5 pt-4 border-t border-white/[0.06]">
                    <Clock className="w-3 h-3 text-white/25" />
                    <span className="text-xs text-white/30">{a.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
