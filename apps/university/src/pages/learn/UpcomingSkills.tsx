import { ArrowLeft, Layers, Globe, Cpu, Palette, TrendingUp, Plus, CheckCircle, ArrowRight } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const expansionPrinciples = [
  {
    icon: <TrendingUp className="w-5 h-5 text-violet-400" />,
    title: "Watching What the Industry Is Actually Doing",
    description: "New courses get added when a skill moves from being a niche advantage to something that's broadly expected. That shift shows up in job descriptions, in what studios and agencies are asking for, and in what independent creators consistently need. We watch those signals before building anything.",
  },
  {
    icon: <Layers className="w-5 h-5 text-violet-400" />,
    title: "Courses That Work With What You Already Know",
    description: "New skills aren't picked in isolation. They're chosen for how they interact with the existing curriculum, adding something that deepens what members already know or opening a new direction that their current skills directly enable.",
  },
  {
    icon: <Globe className="w-5 h-5 text-violet-400" />,
    title: "Useful Across Multiple Disciplines",
    description: "A new skill that graphic designers, video editors, and marketers all benefit from gets prioritized over something with a narrow application. That cross-discipline usefulness is how we decide what's genuinely worth the time to build properly.",
  },
  {
    icon: <Cpu className="w-5 h-5 text-violet-400" />,
    title: "Only Published When Validated by People Doing the Work",
    description: "Before any new course goes live, the content is checked by people who've used the skill in paid, professional settings. No SRK University course covers techniques that exist only in tutorial content.",
  },
];

const upcomingCategories = [
  {
    category: "3D and Spatial Design",
    description: "Three-dimensional tools are becoming standard requirements for motion graphics artists and brand designers. Upcoming modules will introduce spatial thinking, basic 3D work, and how to bring it into existing video and motion workflows.",
    skills: ["3D text and object animation for motion graphics", "Integrating 3D renders into After Effects", "3D design thinking for non-engineers", "Spatial branding concepts"],
  },
  {
    category: "Short-Form Content",
    description: "Short-form content has its own editing grammar, pacing rules, and visual language now. It's a real discipline. Upcoming modules will teach it properly, beyond the basics most people already know.",
    skills: ["Short-form editing rhythm and opening hooks", "Vertical format composition", "Platform-specific standards", "Repurposing content across formats"],
  },
  {
    category: "Brand Identity Systems",
    description: "Understanding how a visual identity is built, documented, and applied across touchpoints connects graphic design, marketing, and content creation. Upcoming modules will cover brand system thinking end to end.",
    skills: ["Logo construction and usage rules", "Colour and typography systems", "Brand guidelines document design", "Applying brand systems across channels"],
  },
  {
    category: "AI Tools in Creative Workflows",
    description: "AI tools are part of professional creative work now. Not as replacements for skill but as things that speed up certain parts of the process. Upcoming modules address how to use them within design, video, and marketing work while keeping your own creative judgment intact.",
    skills: ["AI-assisted image generation and refinement", "Integrating AI output into existing workflows", "Writing prompts as a creative skill", "Quality control of AI-generated assets"],
  },
];

const memberBenefits = [
  "All new courses are available to existing SRK University members",
  "Members get a preview lesson before a new course launches",
  "Feedback from active members influences what gets prioritized",
  "Early access to beta modules lets members shape the final content",
  "New courses are designed to complement what you've already learned",
];

export default function UpcomingSkillsPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">What's Coming</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            New Skills <span className="text-primary">on the Horizon</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A curriculum that stays the same is one that falls behind. SRK University keeps identifying which skills matter next, building courses that teach them properly, and making them available to every member. Here's what's in development and how those decisions get made.
          </p>
        </div>
      </section>

      {/* How new courses get selected */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How New Courses Get Selected</h2>
              <p className="text-white/50 leading-relaxed mb-5">
                Not every tool that trends in tutorial content deserves a full course. A rigorous process runs behind every potential new skill area. Is it genuinely in demand among people doing real work? Can it be taught to a standard that transfers to actual professional settings? Does SRK University have instructors who have used it at that level?
              </p>
              <p className="text-white/50 leading-relaxed">
                The result is fewer additions, more carefully chosen. Every new course here is something members can apply immediately when they finish it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expansion principles */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Decision Criteria</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How Expansion Decisions Are Made</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {expansionPrinciples.map((principle, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgPrimary/60 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-violet-400/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400/20 to-violet-400/5 border border-violet-400/20 flex items-center justify-center mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                    {principle.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{principle.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming categories */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">In Development</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Skill Areas in Development</h2>
          </div>
          <p className="text-white/40 text-center mb-10 max-w-2xl mx-auto text-sm">
            The following areas have active curriculum development underway. Specific course content and launch timelines are confirmed before going public.
          </p>
          <div className="flex flex-col gap-5">
            {upcomingCategories.map((cat, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-violet-400/20 hover:shadow-[0_8px_28px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <h3 className="text-white font-bold text-base">{cat.category}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{cat.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cat.skills.map((skill, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/50 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member benefits */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgPrimary/40 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-custom-gradient flex items-center justify-center shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                  <Palette className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-xl font-bold text-white">How New Courses Reach You</h2>
              </div>
              <div className="space-y-4">
                {memberBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-white/55 text-sm leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staying current */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Staying Current Is Part of the Point</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                The most useful creative professionals aren't the ones who mastered a single tool years ago. They're the ones who keep adding relevant skills, stay aware of how their field is evolving, and know which new tools are actually worth the time.
              </p>
              <p className="text-white/50 leading-relaxed">
                SRK University builds that update habit into how it operates. When a significant tool update changes core workflows, relevant modules get revised. When a new platform creates a new context for creative skills, a module addresses it. The curriculum is maintained, not fixed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Early Is an Advantage</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            The skills that are useful today become expected tomorrow. As a member, you get access to what's coming while it still represents a real differentiator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="inline-flex items-center justify-center px-7 py-3 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
              View Packages
            </Link>
            <Link to="/learn/course-tracks" className="inline-flex items-center justify-center px-7 py-3 border border-primary/40 text-primary/80 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors">
              Current Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
