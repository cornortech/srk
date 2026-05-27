import { BookOpen, Crown, Briefcase, Building2, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const audiences = [
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: "Complete Beginners",
    subtitle: "No prior experience? You're in the right place.",
    description:
      "Starting from zero is fine. SRK University was built with beginners in mind. Every course starts from the absolute foundation, with clear language, step-by-step demonstrations, and a structured path that removes the guesswork.",
    points: [
      "Start from zero, no technical background required",
      "Learn at your own pace with lifetime access to materials",
      "Structured curriculum from fundamentals to advanced concepts",
      "Dedicated beginner-friendly support channels",
      "Build your first portfolio projects within weeks",
      "Access a community of learners at the same stage",
    ],
    skills: ["Adobe Photoshop", "Graphic Design Foundations", "Communication Skills", "DaVinci Resolve"],
    outcome:
      "By the end of your first few months, you'll have working knowledge of industry-standard tools and a small portfolio showing how far you've come. That kind of progress through trial and error alone would have taken years.",
  },
  {
    icon: <Crown className="w-7 h-7" />,
    title: "Working Professionals",
    subtitle: "Upskill without disrupting your career.",
    description:
      "SRK University is designed to work around your schedule. Whether you're working full-time, managing a family, or both, the platform lets you learn at whatever pace fits your life. No deadlines, no fixed class times.",
    points: [
      "Self-paced modules, learn during commutes, evenings, or weekends",
      "Industry-relevant skills that complement your current role",
      "Certificate-ready progression for résumé enhancement",
      "Skills applicable immediately in your professional environment",
      "Video editing skills for business presentations and content",
      "Digital marketing knowledge applicable to any industry",
    ],
    skills: ["Digital Marketing Mastery", "Premiere Pro", "Adobe InDesign", "Communication Skills"],
    outcome:
      "Working professionals who complete these programs report more confidence in client-facing roles, stronger creative output at work, and being able to handle tasks they used to outsource.",
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    title: "Aspiring Entrepreneurs",
    subtitle: "Build the creative and strategic skills your vision needs.",
    description:
      "Building something of your own requires a range of skills: branding, visual communication, digital presence, and the ability to convince people. SRK University brings all of that under one roof so you're not constantly dependent on hiring others for the basics.",
    points: [
      "Learn to create your own brand identity from scratch",
      "Master digital marketing tools for organic and paid growth",
      "Design professional content without hiring expensive agencies",
      "Understand visual storytelling for social media and web",
      "Build persuasion and communication skills for pitching ideas",
      "Access a network of like-minded builders and creators",
    ],
    skills: ["Graphic Design Foundations", "Digital Marketing Mastery", "After Effects", "Communication Skills"],
    outcome:
      "Entrepreneurs who complete these programs move faster, keep creative control over their brand, and communicate their value to clients and audiences much more clearly.",
  },
  {
    icon: <Building2 className="w-7 h-7" />,
    title: "Established Business Owners",
    subtitle: "Modernise your approach, expand your reach.",
    description:
      "Running an established business means constantly adapting. SRK University's programs give business owners the knowledge to evaluate digital tools properly, brief creative teams more effectively, and actually understand what's happening with their brand online.",
    points: [
      "Understand modern digital marketing strategies and analytics",
      "Evaluate and direct creative work with informed expertise",
      "Improve internal communication and team leadership",
      "Learn video and visual production for brand storytelling",
      "Explore content strategies that build lasting audience loyalty",
      "Gain clarity on what's working and what isn't in your marketing",
    ],
    skills: ["Digital Marketing Mastery", "Premiere Pro Mastery", "After Effects for Motion Graphics", "Communication Skills"],
    outcome:
      "Business owners who learn alongside their teams build stronger working relationships, make better hiring decisions, and produce more consistent brand work.",
  },
];

export default function WhoIsItForPage() {
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(182,137,56,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
            Know Your Fit
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Who Is The SRK University For?
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Understanding where you are right now is the first step to making the right choice.
            Here's how SRK University serves each kind of learner.
          </p>
        </div>
      </section>

      {/* Audience Sections */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="relative border border-white/[0.08] rounded-2xl bg-bgSecondary overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)] hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-500"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-delay={String(index * 80)}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.20] to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

              {/* Card header */}
              <div className="relative p-7 sm:p-10 border-b border-white/[0.06]">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-custom-gradient flex items-center justify-center text-black shadow-[0_4px_16px_rgba(182,137,56,0.25)]">
                    {audience.icon}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1">{audience.title}</h2>
                    <p className="text-primary text-sm font-medium">{audience.subtitle}</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed mt-5">
                  {audience.description}
                </p>
              </div>

              {/* Points + Skills */}
              <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                <div className="p-7 sm:p-10">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-semibold mb-5">
                    What You'll Get
                  </h3>
                  <ul className="space-y-3">
                    {audience.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/60 text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-7 sm:p-10 flex flex-col gap-6">
                  <div>
                    <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-semibold mb-5">
                      Recommended Courses
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {audience.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full border border-primary/30 text-primary/70 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto relative border border-primary/[0.14] rounded-xl p-5 bg-bgPrimary/40 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(182,137,56,0.10)]">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
                    <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
                      Your Outcome
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{audience.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Begin?
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            SRK University is built for learners at every stage. Wherever you're starting from, there's a
            path designed specifically for you.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg
              hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]"
          >
            View Learning Packages
          </Link>
        </div>
      </section>
    </div>
  );
}
