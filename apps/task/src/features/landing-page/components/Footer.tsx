import { Link } from 'react-router-dom';

export const Footer = () => {
  const universityUrl = import.meta.env.VITE_SRK_UNIVERSITY_URL || 'https://thesrkuniversity.com';

  const sections = [
    {
      title: 'Platform',
      links: [
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Features', href: '/features' },
        { name: 'Getting Started', href: '/getting-started' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Articles', href: '/articles' },
        { name: 'Help Center', href: '/help' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms-and-conditions' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Security Guide', href: '/help' },
        { name: 'Progress Strategies', href: '/blog' },
        { name: 'Support Center', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a0705] border-t border-white/[0.06] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          <div className="lg:col-span-2">
            <Link to="/">
              <img src="/task-logo.png" alt="SRK Task" className="h-7 w-auto object-contain mb-5" />
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-7">
              The premier platform for social influence growth and verified
              ecosystem progression. Part of the SRK Ecosystem.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-1">Phone</p>
                <a href="tel:+9779769223013" className="text-sm font-semibold text-[#e1ba73] hover:text-white transition-colors">
                  +977 976-9223013
                </a>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-1">Email</p>
                <a href="mailto:support@srktask.com" className="text-sm font-semibold text-[#e1ba73] hover:text-white transition-colors">
                  support@srktask.com
                </a>
              </div>
            </div>

            <a
              href={universityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-[#b68938]/25 text-[#b68938]/70 hover:border-[#b68938]/50 hover:text-[#e1ba73] bg-[#b68938]/05 transition-all duration-150"
            >
              University Portal ↗
            </a>
          </div>

          {sections.map(section => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/45 hover:text-white/80 transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">
            © 2026 SRK Task. All rights reserved. Part of the SRK Ecosystem.
          </p>
          <p className="text-xs text-white/15">
            Powered by SRK University SSO
          </p>
        </div>

      </div>
    </footer>
  );
};
