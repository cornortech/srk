import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { allTaskArticles, TOPICS } from '../../data/articles';

export default function Articles() {
  const [activeTopic, setActiveTopic] = useState<string>('all');

  const filtered =
    activeTopic === 'all'
      ? allTaskArticles
      : allTaskArticles.filter(a => a.topicSlug === activeTopic);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0705]">

      <header className="pt-20 pb-14 px-6 sm:px-10 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-5">
              SRK Task — Knowledge Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Articles &amp; Guides
            </h1>
          </div>
          <div className="flex items-center gap-5 text-sm text-white/35 sm:text-right">
            <span className="flex items-center gap-2">
              <BookOpen size={14} className="text-white/25" />
              {allTaskArticles.length} articles
            </span>
            <span className="w-px h-4 bg-white/15" />
            <span>{TOPICS.length} topics</span>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 bg-[#0a0705]/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTopic('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTopic === 'all'
                ? 'bg-[#b68938]/20 text-[#e1ba73] shadow-[inset_0_0_0_1px_rgba(182,137,56,0.3)]'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'
            }`}
          >
            All Topics
          </button>
          {TOPICS.map(t => (
            <button
              key={t.slug}
              onClick={() => setActiveTopic(t.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTopic === t.slug
                  ? 'bg-[#b68938]/20 text-[#e1ba73] shadow-[inset_0_0_0_1px_rgba(182,137,56,0.3)]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="py-12 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">

          <p className="text-xs text-white/25 uppercase tracking-widest mb-8">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            {activeTopic !== 'all' && ` · ${TOPICS.find(t => t.slug === activeTopic)?.label}`}
          </p>

          {featured && (
            <>
              <Link
                to={`/articles/${featured.slug}`}
                className="group block bg-[#111008] rounded-xl border border-white/[0.07] hover:border-[#b68938]/30 transition-all duration-200 mb-5"
              >
                <div className="flex flex-col md:flex-row md:items-stretch">
                  <div
                    className="md:w-1 h-1 md:h-auto rounded-tl-xl rounded-bl-xl flex-shrink-0"
                    style={{ background: 'linear-gradient(to bottom, #e1ba73, #b68938)' }}
                  />
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-14 p-7 sm:p-9 flex-1">
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold">
                          {featured.category}
                        </div>
                        <span className="text-xs text-white/20 border border-white/[0.08] px-2 py-0.5 rounded-full">Featured</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white/90 leading-snug group-hover:text-white transition-colors duration-200">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-white/45 leading-relaxed line-clamp-2">{featured.subtitle}</p>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-white/30">
                        <Clock size={13} />
                        <span className="text-xs">{featured.readTime}</span>
                      </div>
                      <span className="flex items-center gap-2 text-[#b68938] text-sm font-bold group-hover:text-[#e1ba73] group-hover:gap-3 transition-all duration-200">
                        Read <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map(article => (
                    <Link
                      key={article.slug}
                      to={`/articles/${article.slug}`}
                      className="group bg-[#111008] rounded-xl border border-white/[0.07] hover:border-[#b68938]/25 transition-all duration-200 flex flex-col p-6"
                    >
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#b68938]/10 border border-[#b68938]/15 text-[#e1ba73] text-[10px] font-semibold mb-4 self-start">
                        {article.category}
                      </div>
                      <h2 className="text-sm font-bold text-white/85 leading-snug mb-3 flex-1 group-hover:text-white transition-colors duration-200">
                        {article.title}
                      </h2>
                      <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-5">{article.subtitle}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} className="text-white/25" />
                          <span className="text-xs text-white/30">{article.readTime}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[#b68938]/60 text-xs font-semibold group-hover:text-[#e1ba73] group-hover:gap-2.5 transition-all duration-200">
                          Read <ArrowRight size={11} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="p-4 rounded-2xl bg-[#111008] border border-white/[0.07]">
                <BookOpen size={24} className="text-white/20" />
              </div>
              <p className="text-sm text-white/30">No articles in this topic yet.</p>
              <p className="text-xs text-white/20">Check back soon — more are on the way.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
