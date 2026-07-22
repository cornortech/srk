import { ArrowLeft, Map, BarChart2, Clock, Repeat, CheckCircle, ArrowRight } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const pathwayStages = [
  {
    stage: "Stage 1",
    title: "Orientation and Setup",
    duration: "Days 1 to 3",
    description: "You get your workspace configured, install the tools, and do a short orientation module that explains how the curriculum is laid out. By the end you know exactly where you're headed and how each module connects to the next.",
    items: ["Software setup and configuration", "Workspace layout", "Overview of the full learning path", "First exercise: use the tool without guidance"],
  },
  {
    stage: "Stage 2",
    title: "Foundational Modules",
    duration: "Weeks 1 to 3",
    description: "Core concepts are introduced in order. Each module ends with a short project. Nothing is assumed understood. Everything gets checked through practice before moving on.",
    items: ["Tool navigation and interface", "Core workflow principles", "First project submission and review", "The vocabulary and mental models of the discipline"],
  },
  {
    stage: "Stage 3",
    title: "Intermediate Work",
    duration: "Weeks 4 to 8",
    description: "With the basics in place, lessons get more complex. Projects combine multiple concepts. You start hitting real constraints: tight briefs, multi-layer files, ambiguous instructions. All in a guided setting.",
    items: ["Projects that combine multiple concepts", "Iterating based on feedback", "Introduction to professional standards", "Participating in peer review"],
  },
  {
    stage: "Stage 4",
    title: "Advanced Techniques",
    duration: "Weeks 9 to 14",
    description: "The techniques that separate people who know the tool from people who can work professionally in it. Projects at this stage look and feel like actual client work.",
    items: ["Complex multi-layer projects", "Speed and efficiency techniques", "Advanced workflow customization", "Portfolio-grade deliverables"],
  },
  {
    stage: "Stage 5",
    title: "Capstone Project",
    duration: "Weeks 15 to 16",
    description: "A full self-directed project from brief to final delivery with minimal guidance. You interpret the brief, make the decisions, and deliver. This is what professional practice actually looks like.",
    items: ["Self-directed brief", "Complete project from start to finish", "Instructor capstone review", "Portfolio presentation"],
  },
];

const structureFeatures = [
  { icon: <Map className="w-5 h-5 text-cyan-400" />, title: "A Visual Roadmap", description: "Every learner has a clear view of their full curriculum, where they are in it, and what's next. Progress is never invisible." },
  { icon: <BarChart2 className="w-5 h-5 text-cyan-400" />, title: "Progress Tracking", description: "Completion, project history, and feedback received are tracked in your dashboard. You always know where you stand." },
  { icon: <Clock className="w-5 h-5 text-cyan-400" />, title: "Paced but Flexible", description: "There's a recommended pace that builds skills without overwhelming you. Move faster and the next module unlocks. Life gets busy and your progress waits exactly where you left it." },
  { icon: <Repeat className="w-5 h-5 text-cyan-400" />, title: "Go Back Anytime", description: "No lesson locks after you complete it. When a later module references something earlier, you can return and rewatch as many times as needed." },
];

export default function StructuredLearningPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Curriculum Structure</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            How the Learning <span className="text-primary">Pathway Is Built</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A collection of random tutorials isn't a curriculum. The pathways at SRK University are laid out so each lesson prepares you for the next, and every module builds toward something you can actually use. Here's how that works.
          </p>
        </div>
      </section>

      {/* Why order matters */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why the Order Matters</h2>
              <p className="text-white/50 leading-relaxed mb-5">
                The order in which you learn creative skills matters a lot. Someone who tries compositing before they understand layers will struggle and probably give up. A video editor who attempts colour grading before they understand their timeline will create problems further down the line. Structure isn't a restriction. It's a shortcut.
              </p>
              <p className="text-white/50 leading-relaxed">
                The pathways at SRK University were designed by people who remember which gaps cost them the most time and confidence early in their careers. Each sequence fills those gaps in the right order so your understanding is cumulative rather than scattered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five stages */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">The Pathway</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The Five Stages</h2>
          </div>
          <div className="flex flex-col gap-4">
            {pathwayStages.map((stage, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgPrimary/50 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-cyan-400/20 hover:shadow-[0_8px_28px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.09)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold text-cyan-400 border border-cyan-400/30 bg-cyan-400/5 rounded-full px-3 py-0.5 w-fit uppercase tracking-wider">
                      {stage.stage}
                    </span>
                    <h3 className="text-white font-bold text-base">{stage.title}</h3>
                    <span className="text-white/30 text-xs sm:ml-auto">{stage.duration}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{stage.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {stage.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/50 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">How It Works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Features of the Pathway System</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {structureFeatures.map((f, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-cyan-400/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-discipline block */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgPrimary/40 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">One Structure Across Eight Disciplines</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                The five-stage structure runs across all eight courses. Whether you're learning Photoshop, DaVinci Resolve, or Digital Marketing, the same logic guides your progression from orientation to final delivery.
              </p>
              <p className="text-white/50 leading-relaxed mb-5">
                This has a practical benefit. Once you complete one discipline, starting a second feels familiar from day one. You already know the pace, the project expectations, the feedback process, how the community works. Your second track is faster to start because the environment isn't new. Just the craft.
              </p>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">All eight disciplines are available to every SRK University member</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">The Pathway Saves You Months</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            People who learn on their own often spend months finding the right sequence through trial and error. The structured pathways here solve that upfront.
          </p>
          <Link to="/packages" className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
            View Packages
          </Link>
        </div>
      </section>
    </div>
  );
}
