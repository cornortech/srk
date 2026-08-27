import { ArrowLeft, CheckCircle, Clock, Target, Zap, BookOpen } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const realities = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Skills become obsolete faster than ever",
    body: "The tools and practices that defined professional work five years ago are already being replaced. The digital creative field moves fast. The best time to build a relevant skill set is before you need it, not after you realize you've fallen behind.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "The window for early advantage is narrow",
    body: "In every skill area that's still emerging, motion design, digital marketing, video production, early learners have a real advantage just by being ahead. That window doesn't stay open. As a skill becomes common, the value of having learned it early shows up in how you're perceived and what you get asked to do.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Procrastination has a real opportunity cost",
    body: "Every month without building a meaningful skill is a month of growth that doesn't come back. The person who starts today and the person who starts in six months will be in very different places. Not because of talent. Because of time spent practicing.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Structured learning beats random internet searching",
    body: "Most people try to learn by piecing together free tutorials. The result is knowledge with gaps, and usually some wrong fundamentals underneath the right-looking surface. A structured curriculum taught by people who work in the field means the foundation is solid before anything complex gets added.",
  },
];

const transformations = [
  {
    before: "Consuming content passively",
    after: "Creating content that others consume",
    skill: "Video Editing & Motion Graphics",
  },
  {
    before: "Outsourcing all design work",
    after: "Owning your visual identity",
    skill: "Graphic Design & Photoshop",
  },
  {
    before: "Guessing at marketing",
    after: "Making data-driven decisions",
    skill: "Digital Marketing Mastery",
  },
  {
    before: "Struggling to communicate ideas clearly",
    after: "Persuading and inspiring audiences",
    skill: "Communication Skills",
  },
];

const learningPrinciples = [
  {
    title: "Deliberate Practice Over Passive Consumption",
    body: "Learning happens through doing, not watching. SRK University's curriculum is built around this. Each module ends with a practical exercise, not a quiz. You apply the concept immediately after encountering it, and that's what makes it stay.",
  },
  {
    title: "The Compound Effect of Consistent Effort",
    body: "30 minutes every day for 90 days produces vastly different results than a single weekend intensive. Consistency compounds. SRK University's self-paced structure is designed to support regular engagement. Short focused sessions that build over time into something real.",
  },
  {
    title: "Community Accountability Accelerates Growth",
    body: "Learning alongside others creates accountability and opens up feedback you wouldn't get on your own. SRK University's community is where questions get answered, work gets reviewed, and progress gets acknowledged. Solo study just doesn't replicate that.",
  },
  {
    title: "Real Skills Translate Directly to Real Life",
    body: "Every skill in SRK University's catalogue has a clear, immediate use. Photoshop skills show up in a portfolio. Video editing produces content. Digital marketing knowledge shapes real decisions. There's no waiting for graduation. The skills work from the first week.",
  },
];

export default function SeizeYourMomentPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">The Case for Now</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Why the Right Moment to Learn Is Always Now
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Waiting for the "right time" is itself a decision, and it quietly delays your growth. Here's a realistic look at why skill development is time-sensitive, and how SRK University helps you make the most of the time you have.
          </p>
        </div>
      </section>

      {/* Four Realities */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">The Landscape</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Four Realities of Skill Development in 2025</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {realities.map((r, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-amber-400/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-lg bg-custom-gradient flex items-center justify-center text-black mb-4 shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                    {r.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{r.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation table */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Skills in Action</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">From Passive to Active: What a Skill Changes</h2>
          </div>
          <div className="flex flex-col gap-4">
            {transformations.map((t, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgPrimary/50 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/20 hover:shadow-[0_6px_24px_rgba(0,0,0,0.30)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-5 sm:p-6 grid sm:grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
                  <div>
                    <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1">Before</p>
                    <p className="text-white/50 text-sm">{t.before}</p>
                  </div>
                  <div className="hidden sm:flex text-primary/40 font-black text-xl px-2">→</div>
                  <div>
                    <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1">After</p>
                    <p className="text-white/80 text-sm font-medium">{t.after}</p>
                  </div>
                  <div className="sm:border-l sm:border-white/[0.07] sm:pl-4">
                    <span className="px-2.5 py-1 rounded-full border border-primary/25 text-primary/60 text-[10px] font-medium whitespace-nowrap">
                      {t.skill}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning principles */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">How We Help</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The Learning Principles Behind SRK University</h2>
          </div>
          <div className="flex flex-col gap-4">
            {learningPrinciples.map((p, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/15 hover:shadow-[0_6px_24px_rgba(0,0,0,0.28)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6 flex gap-5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/25 text-primary font-black text-sm shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What meaningful skill feels like */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgPrimary/50 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">What "Learning Something Meaningful" Actually Looks Like</h2>
              <div className="space-y-4 text-white/50 text-sm sm:text-base leading-relaxed">
                <p>
                  Real skill development isn't about finishing a course. It's about changing how you operate. Someone who completes SRK University's Photoshop course doesn't just know what layers are. They can open a brief, understand what's being asked, execute the design, and present it clearly. That's a different kind of capability.
                </p>
                <p>
                  Learning something properly also changes how you see the world. A person who has studied digital marketing reads a brand campaign differently. They notice the targeting logic, the message structure, the call to action design. Someone who's done the motion graphics course watches a title sequence and understands every decision in it.
                </p>
                <p>
                  That depth of understanding is what SRK University is designed to produce. Not surface familiarity with tools, but genuine working knowledge that keeps building with every month you put into it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">The best time to start is always now.</h2>
          <p className="text-white/40 text-sm mb-8">
            Every day of meaningful learning is an investment in the person you're becoming. SRK University is here to make every day count.
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
