import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { allTaskArticles, TOPICS } from '../../data/articles';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = allTaskArticles.find(a => a.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  const related = allTaskArticles
    .filter(a => a.topicSlug === article.topicSlug && a.slug !== article.slug)
    .slice(0, 4);

  const topicLabel = TOPICS.find(t => t.slug === article.topicSlug)?.label ?? article.category;

  return (
    <div className="min-h-screen bg-[#0a0705] text-white">

      {/* Header */}
      <header className="border-b border-white/[0.06] pt-20 pb-14 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto">

          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm mb-10 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
            Articles
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-5">
            {topicLabel}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-[1.15] mb-5 tracking-tight">
            {article.title}
          </h1>

          <p className="text-base text-white/50 leading-relaxed mb-7">
            {article.subtitle}
          </p>

          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {article.readTime}
            </span>
            <span className="w-px h-3.5 bg-white/15" />
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} />
              SRK Task — Articles Team
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="py-14 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto">

          {/* Intro */}
          <p className="text-base text-white/60 leading-[1.85] mb-12 border-l-2 border-[#b68938]/40 pl-5 italic">
            {article.intro}
          </p>

          {/* Sections */}
          {article.sections.map((section, i) => (
            <div key={i} className="mb-12">
              <h2 className="text-xl font-black text-white mb-4 pl-4 border-l-2 border-[#b68938]/60">
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} className="text-base text-white/65 leading-[1.85]">
                    {para.trim()}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Key takeaways */}
          <div className="bg-[#111008] rounded-xl border border-[#b68938]/20 p-7 mb-14">
            <h3 className="text-sm font-black text-[#e1ba73] uppercase tracking-widest mb-5">
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {article.keyTakeaways.map((kt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b68938]/70 mt-[0.55rem] flex-shrink-0" />
                  {kt}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom nav */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8 border-t border-white/[0.06]">
            <div>
              <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Published by</p>
              <p className="text-sm font-bold text-white">SRK Task — Articles Team</p>
              <p className="text-xs text-white/35 mt-0.5">{topicLabel}</p>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm shadow-[0_2px_12px_rgba(182,137,56,0.35)] hover:brightness-110 transition-all duration-150"
            >
              Browse all articles
            </Link>
          </div>
        </div>
      </main>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-white/[0.06] py-16 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#b68938]/60 mb-2">
                  Same Topic
                </p>
                <h2 className="text-2xl font-black text-white">
                  More on {topicLabel}
                </h2>
              </div>
              <Link
                to="/articles"
                className="hidden sm:flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors group"
              >
                View all
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(a => (
                <Link
                  key={a.slug}
                  to={`/articles/${a.slug}`}
                  className="group bg-[#111008] rounded-xl border border-white/[0.07] hover:border-[#b68938]/25 transition-colors duration-200 flex flex-col p-5"
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#b68938]/10 border border-[#b68938]/15 text-[#e1ba73] text-[10px] font-semibold mb-3">
                    {TOPICS.find(t => t.slug === a.topicSlug)?.label ?? a.category}
                  </div>
                  <h3 className="text-sm font-bold text-white/85 leading-snug flex-1 mb-4 group-hover:text-white transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-white/[0.06]">
                    <Clock size={11} className="text-white/25" />
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
