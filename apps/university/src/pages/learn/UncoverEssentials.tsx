import { ArrowLeft, BookOpen, Layers, Target, Zap, CheckCircle, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const coreModules = [
  {
    icon: <Compass className="w-5 h-5 text-blue-400" />,
    title: "How Professionals Think About Their Tools",
    description:
      "The first lessons aren't about clicking buttons. They're about understanding how professional workflows are organized, why projects are structured the way they are, and how creative teams actually talk to each other. That context makes everything else easier to absorb.",
    points: [
      "File structure and project organization",
      "Industry naming conventions",
      "Reading and working from a creative brief",
      "How revisions and feedback cycles work",
    ],
  },
  {
    icon: <Layers className="w-5 h-5 text-blue-400" />,
    title: "Building Concepts, Not Just Skills",
    description:
      "Each lesson is connected to the one before it. You're not picking up random tips. You're building a way of thinking that holds up when software updates or a project throws something unexpected at you. That's what makes the knowledge actually stick.",
    points: [
      "Layer-based thinking across tools",
      "Non-destructive editing habits",
      "Color theory in real contexts",
      "Typography and visual balance",
    ],
  },
  {
    icon: <Target className="w-5 h-5 text-blue-400" />,
    title: "Practice From Day One",
    description:
      "Every essential lesson ends with something to make. A poster. A cut sequence. A motion graphic. Not a quiz. You don't get to sit on theory for weeks before touching the tools. The practice starts immediately, and that's what makes it real.",
    points: [
      "Project-based modules with real briefs",
      "Peer feedback on your work",
      "Difficulty increases gradually",
      "Portfolio-ready assets from early on",
    ],
  },
  {
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    title: "Working Fast and Efficiently",
    description:
      "Speed matters in professional work. The essentials include shortcuts, workspace setup, and how to batch repetitive tasks. These habits take time to build but they separate people who produce a lot from those who spend half their day doing the same thing manually.",
    points: [
      "Keyboard shortcuts for each application",
      "Custom workspace setup",
      "Basic batch export and automation",
      "Simple habits that save hours each week",
    ],
  },
];

const learningPrinciples = [
  {
    number: "01",
    title: "Understand It Before You Use It",
    description:
      "Every tool is taught with its purpose first. When you know why something exists, how to use it becomes obvious. And it stays obvious across different software versions.",
  },
  {
    number: "02",
    title: "Revisiting Things on Purpose",
    description:
      "Core ideas come up again in different contexts across the curriculum. Not because we're repeating ourselves but because that's how things move from short-term memory into something you can actually rely on.",
  },
  {
    number: "03",
    title: "Apply It Right Away",
    description:
      "Within minutes of learning something you use it on a real file. Passive watching is kept short. The doing starts early.",
  },
  {
    number: "04",
    title: "Common Mistakes Shown Clearly",
    description:
      "Instructors walk through mistakes on purpose so you can recognize and fix them quickly. It's faster than finding out the hard way.",
  },
];

const skillAreas = [
  "Adobe Photoshop",
  "Graphic design and composition",
  "Adobe Premiere Pro",
  "After Effects and motion",
  "DaVinci Resolve colour basics",
  "Digital marketing fundamentals",
  "Adobe InDesign layout",
  "Communication and presentation",
];

export default function UncoverEssentialsPage() {
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Curriculum</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            What the Essential Lessons <span className="text-primary">Actually Cover</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Before any advanced technique, there are foundational lessons that decide whether your skills will hold up or fall apart under pressure. Here's what those lessons are, how they're taught, and why they matter.
          </p>
        </div>
      </section>

      {/* Why foundations matter */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Foundations Actually Matter</h2>
              <p className="text-white/50 leading-relaxed mb-5">
                Most people who struggle with creative tools do so because they skipped the fundamentals. They learned one technique, applied it, and when something went wrong they had no idea where to look. The essentials fix that.
              </p>
              <p className="text-white/50 leading-relaxed">
                A designer who properly understands resolution, colour profiles, and layers can pick up almost any design tool in a few days. A video editor who gets timeline architecture can troubleshoot export issues without spending an hour searching online. The foundational lessons aren't slow. They're the fastest path forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four core areas */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">What's Inside</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The Four Core Areas</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {coreModules.map((mod, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgPrimary/60 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-blue-400/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-400/5 border border-blue-400/20 flex items-center justify-center mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                    {mod.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{mod.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{mod.description}</p>
                  <ul className="space-y-2">
                    {mod.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/45">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How lessons are taught */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Pedagogy</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How the Lessons Are Taught</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {learningPrinciples.map((p, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)]"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6 flex gap-5">
                  <span className="text-3xl font-black text-blue-400/20 flex-shrink-0 leading-none mt-1">{p.number}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-2">{p.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{p.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Every discipline starts here */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgPrimary/40 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Every Discipline Starts Here</h2>
              <p className="text-white/50 leading-relaxed mb-7">
                The essential lessons run across all eight disciplines at SRK University. Each one starts from the foundation before moving forward. No discipline throws you into the middle.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {skillAreas.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-white/55 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">The Foundation Is What Lets You Go Further</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Once the essentials are solid you move into more complex work. Real client briefs, multi-layer compositions, motion projects. That work feels manageable because you spent time here first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="inline-flex items-center justify-center px-7 py-3 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
              View Packages
            </Link>
            <Link to="/learn/course-tracks" className="inline-flex items-center justify-center px-7 py-3 border border-primary/40 text-primary/80 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
