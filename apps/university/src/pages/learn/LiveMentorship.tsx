import { ArrowLeft, Video, Clock, MessageSquare, CalendarDays, CheckCircle, Radio } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const sessionFormats = [
  {
    icon: <Radio className="w-5 h-5 text-blue-400" />,
    title: "Structured Teaching at the Start",
    description: "Each live session opens with a 20 to 30 minute teaching block. The instructor takes a concept from the current module and adds dimension to it, covering things that wouldn't fit into a recorded lesson. This isn't a recap. It's new, live content.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    title: "Open Q&A",
    description: "After the teaching block the session opens to questions. All questions are taken live, no queue, no deferral to a forum post. Instructors often share their screen to answer in context rather than abstractly. A specific question gets a specific answer.",
  },
  {
    icon: <Video className="w-5 h-5 text-blue-400" />,
    title: "Live Work Critique",
    description: "Work submitted by community members gets reviewed live. The instructor walks through a piece, what works, what could be stronger, and why, with the author present to ask follow-up questions right away. Watching someone else's work critiqued is often as instructive as having your own reviewed.",
  },
  {
    icon: <CalendarDays className="w-5 h-5 text-blue-400" />,
    title: "Deep Dive Sessions",
    description: "Some sessions are dedicated entirely to one concept. Two hours on colour grading. A full session on typography in motion. These are announced in advance so you can prepare questions or make sure you're there live.",
  },
];

const howToMaximise = [
  {
    number: "01",
    title: "Come With a Specific Question",
    description: "Vague questions get vague answers. Come with context: you're trying to do X, the output looks like Y, what are you missing? That gets you something you can use immediately.",
  },
  {
    number: "02",
    title: "Watch the Critique Section Even When It's Not Your Work",
    description: "You learn a lot from watching an instructor break down someone else's piece. The mistakes other people make are often the same ones you've made or will make. Catching them in someone else's work is efficient.",
  },
  {
    number: "03",
    title: "Watch Recordings With Your Project Open",
    description: "If you catch a session recording instead of attending live, have your current project open on the other screen. Apply each insight as you hear it. The gap between watching and doing is where most learning gets lost.",
  },
  {
    number: "04",
    title: "Submit Work in Progress",
    description: "You don't need to finish something to submit it for critique. Work in progress often gets more useful feedback because the direction can still change. Waiting for 'done' usually means waiting too long.",
  },
];

const whatInstructorsCover = [
  "Troubleshooting common export and rendering issues",
  "Explaining why a creative decision does or doesn't work",
  "Demonstrating techniques that aren't in the core curriculum",
  "Answering questions about software updates and workflow changes",
  "Reviewing how student work compares to professional standards",
  "Sharing context from their own current projects when they can",
  "Discussing differences between tools and when to switch",
  "Addressing skill gaps that keep coming up across many students",
];

export default function LiveMentorshipPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Live Sessions</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            What the Live Daily Sessions <span className="text-primary">Actually Look Like</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Recorded video is powerful but it can't answer a follow-up question. SRK University's live daily sessions are where specific problems get addressed in real time, by someone who can look at your situation and respond to it directly.
          </p>
        </div>
      </section>

      {/* Why live learning */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Live Learning Changes How Fast You Improve</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Recorded courses solve the access problem: learn from anyone, anywhere, any time. But they don't solve the feedback problem. When something doesn't make sense, you can't ask. When you apply a technique wrong, nobody tells you until much later.
              </p>
              <p className="text-white/50 leading-relaxed mb-4">
                Live sessions solve the feedback problem. An expert looks at what you're doing and tells you specifically what needs to change and why. That loop, try something, have it observed, get corrected, is the fastest known path to getting good at anything.
              </p>
              <p className="text-white/50 leading-relaxed">
                Daily access to live sessions means that loop is always available. You don't wait a week for the next scheduled class.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Session formats */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Session Format</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How Sessions Are Structured</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {sessionFormats.map((format, i) => (
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
                    {format.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{format.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{format.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics covered */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">What Gets Covered in Sessions</h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Sessions cover more than the structured curriculum because real questions from real learners surface problems that no static course can fully anticipate.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {whatInstructorsCover.map((topic, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-white/55 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to get the most */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Make It Count</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How to Get the Most From Each Session</h2>
          </div>
          <div className="flex flex-col gap-4">
            {howToMaximise.map((tip, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgPrimary/50 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)]"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6 flex gap-5">
                  <span className="text-3xl font-black text-blue-400/20 flex-shrink-0 leading-none mt-1">{tip.number}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-2">{tip.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recordings block */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-custom-gradient flex items-center justify-center shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                  <Clock className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-xl font-bold text-white">Sessions Are Recorded</h2>
              </div>
              <p className="text-white/50 leading-relaxed mb-4">
                Every live session is recorded and available to all SRK University members. If your timezone makes attendance difficult, or something comes up, you don't lose the content. The recording includes all questions asked, answers given, and work reviewed.
              </p>
              <p className="text-white/50 leading-relaxed">
                Recordings are indexed and searchable. If you're stuck on a specific topic, you can look through past sessions for instances where it came up. Usually more useful than a forum thread.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Daily Access to Expert Thinking Compounds</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Most people learning a skill get expert feedback once a week if they're lucky. SRK University members can get it every day. Over the length of a full learning path, that difference adds up significantly.
          </p>
          <Link to="/packages" className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
            View Packages
          </Link>
        </div>
      </section>
    </div>
  );
}
