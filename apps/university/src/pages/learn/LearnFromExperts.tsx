import { ArrowLeft, Award, Mic, Eye, Lightbulb, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const teachingPrinciples = [
  {
    icon: <Eye className="w-5 h-5 text-orange-400" />,
    title: "Everyone Who Teaches Here Has Done the Work",
    description:
      "Every instructor at SRK University has used what they teach in real client and production settings. The Photoshop instructor has delivered layered files to commercial studios. The Premiere Pro instructor has cut sequences under deadline pressure. The teaching comes from that experience, not from a textbook written about it.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-orange-400" />,
    title: "The Why, Not Just the How",
    description:
      "Rather than demonstrating a technique and moving on, instructors explain the thinking behind it. Why this blend mode and not another. Why this cut point. Why this colour grade fits the story. That context turns technique into judgment, and judgment is what experienced people in any creative field actually have.",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
    title: "Content Gets Updated When the Industry Moves",
    description:
      "Instructors are still active in their fields. When a tool updates significantly or a new technique becomes standard, the relevant lessons get revised. You're not learning workflows from two versions ago.",
  },
  {
    icon: <Mic className="w-5 h-5 text-orange-400" />,
    title: "Thinking Out Loud",
    description:
      "One of the most useful things an expert can share is their real-time decision process. Instructors here narrate what they're thinking as they work, including the hesitations, the alternatives they considered, the moments where instinct overrides the technically correct answer. Static tutorials can't replicate that.",
  },
];

const expertiseAreas = [
  { discipline: "Adobe Photoshop", background: "Studio retouching, commercial photography post-production, brand asset creation", depth: "Layer masking, non-destructive adjustments, compositing for print and digital" },
  { discipline: "Graphic Design", background: "Agency branding, print and packaging design, identity systems", depth: "Visual hierarchy, typography, grid composition, practical colour theory" },
  { discipline: "Adobe Premiere Pro", background: "Long-form documentary, corporate video, YouTube content production", depth: "Multicam editing, audio sync, Dynamic Link, export optimization" },
  { discipline: "After Effects and Motion", background: "Broadcast animation, title sequences, motion brand identities", depth: "Expression-driven animation, shape layer work, compositing with 3D" },
  { discipline: "DaVinci Resolve", background: "Film colour grading, broadcast finishing, HDR delivery", depth: "Node-based grading, LUT creation, audio mixing in Fairlight" },
  { discipline: "Digital Marketing", background: "Campaign strategy for e-commerce, content-led growth, audience work", depth: "Funnel structure, analytics, content calendars, platform-specific tactics" },
  { discipline: "Adobe InDesign", background: "Magazine layout, brand guidelines, large publications", depth: "Master pages, paragraph styles, data merge, pre-press preparation" },
  { discipline: "Communication Skills", background: "Presentation coaching, client management, public speaking", depth: "Narrative structure, presentation design, persuasive writing, listening" },
];

const mentorApproach = [
  "Every lesson is checked against current software versions before going live.",
  "Instructors record updates whenever a major tool change affects core workflows.",
  "Live sessions have real Q&A blocks. No question gets sent to a forum instead.",
  "Instructors use their own portfolio work as teaching material, not stock examples.",
  "Critique sessions use actual student submissions, not invented examples with planted mistakes.",
];

export default function LearnFromExpertsPage() {
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Instructors</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Who Actually <span className="text-primary">Teaches You</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            The quality of what you learn depends heavily on who's teaching it. At SRK University, every instructor has done the work in real professional environments. This page explains who they are, how they teach, and why that matters for what you'll take away.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Being Good at Something Isn't the Same as Teaching It Well</h2>
              <p className="text-white/50 leading-relaxed mb-5">
                These are two different skills. SRK University instructors demonstrate both. They've worked at a professional level in their field, and they've spent years understanding where learners get stuck, what misconceptions form at each stage, and how to sequence things so the next step always makes sense.
              </p>
              <p className="text-white/50 leading-relaxed">
                That combination is genuinely rare. It's what makes the lessons accurate and up-to-date but also actually useful, the kind that sticks instead of requiring four rewatches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How they teach */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Teaching Method</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How They Teach</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {teachingPrinciples.map((principle, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgPrimary/60 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-orange-400/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-400/5 border border-orange-400/20 flex items-center justify-center mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
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

      {/* Standards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Standards Every Instructor Keeps</h2>
              <div className="space-y-4">
                {mentorApproach.map((standard, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-white/55 text-sm leading-relaxed">{standard}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise areas */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">By Discipline</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What Each Instructor Covers</h2>
          </div>
          <div className="flex flex-col gap-4">
            {expertiseAreas.map((area, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgPrimary/50 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-orange-400/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String((i % 4) * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-primary text-sm">{area.discipline}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Background</p>
                      <p className="text-white/60">{area.background}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">What's Covered</p>
                      <p className="text-white/60">{area.depth}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">The Relationship Continues in Live Sessions</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            In live sessions you interact directly with instructors who've seen your progression through the material. When you ask a question they respond to your specific situation, not a generic version of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="inline-flex items-center justify-center px-7 py-3 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
              View Packages
            </Link>
            <Link to="/learn/live-mentorship" className="inline-flex items-center justify-center px-7 py-3 border border-primary/40 text-primary/80 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors">
              Live Sessions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
