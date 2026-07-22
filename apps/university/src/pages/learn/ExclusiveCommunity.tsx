import { ArrowLeft, Users, MessageCircle, Trophy, Star, Shield, Globe } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const communityPillars = [
  {
    icon: <Users className="w-5 h-5 text-violet-400" />,
    title: "People Who Hold Each Other Accountable",
    description:
      "When you join the community you're surrounded by people working toward the same thing. Study groups happen naturally. Members check in on each other's progress. The accountability isn't enforced by any rule. It just develops when everyone around you is moving in the same direction.",
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-violet-400" />,
    title: "Real Feedback, Not Just Likes",
    description:
      "Channels are organized by skill area. You post work in progress and people who know the craft respond with actual critique. Not 'looks great!' but 'the left side is heavier than the right, here's how to fix it.' That kind of feedback is hard to find and it moves your work forward fast.",
  },
  {
    icon: <Shield className="w-5 h-5 text-violet-400" />,
    title: "Kept Clean on Purpose",
    description:
      "The community doesn't have the noise that makes most online spaces useless. No spam, no self-promotion without contribution, no negativity for its own sake. What's left is a space where people actually help each other and conversations stay focused.",
  },
  {
    icon: <Globe className="w-5 h-5 text-violet-400" />,
    title: "Disciplines Mix",
    description:
      "Graphic designers and video editors talk. Marketers and motion artists compare notes. That's closer to how real creative work happens anyway. Nobody works completely alone in a professional environment, and neither should you here.",
  },
];

const communityBenefits = [
  { title: "Active Every Day", value: "Daily", note: "members posting, reviewing, and discussing throughout the week" },
  { title: "Skill Areas", value: "8+", note: "disciplines with active channels at the same time" },
  { title: "Feedback Turnaround", value: "Quick", note: "most work gets peer or TA feedback within a day" },
  { title: "Access", value: "Ongoing", note: "community access doesn't stop when a course ends" },
];

const howItWorks = [
  {
    step: "01",
    title: "You Get Introduced",
    description: "When you join there's a short onboarding that walks you through how the community is organized, which channels exist, and what the norms are. You meet the people who started at the same time as you.",
  },
  {
    step: "02",
    title: "Find Your Channels",
    description: "Each skill track has its own space. You join the ones relevant to your path and can lurk in others if you want to get a sense of where adjacent disciplines are headed.",
  },
  {
    step: "03",
    title: "Share Before It's Done",
    description: "The community standard is sharing work early. A rough draft gets more useful feedback than a finished piece because the direction can still change. Waiting until something feels perfect usually means waiting too long.",
  },
  {
    step: "04",
    title: "Give Back as You Improve",
    description: "A few months in you'll be able to answer questions you couldn't have answered when you started. Helping people who are behind you reinforces what you know and builds your standing in the community.",
  },
];

export default function ExclusiveCommunityPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Community</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            What the <span className="text-primary">Exclusive Community</span> Is Like
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Learning on your own works up to a point. After that, the people around you matter a lot. This page explains how the SRK University community is structured, what actually happens in it, and why it changes the pace of your progress.
          </p>
        </div>
      </section>

      {/* Why community isn't optional */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Community Isn't Optional</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                People who engage with a learning community consistently retain more, finish more of their course, and apply skills to real projects faster. This isn't a claim about motivation. It's about how people actually learn complex skills.
              </p>
              <p className="text-white/50 leading-relaxed mb-4">
                A video editor watching tutorials alone will get better. A video editor who also posts work for critique, watches someone else's edit being broken down, and talks colour theory with a designer will get better three times as fast. Same concept from three angles at once.
              </p>
              <p className="text-white/50 leading-relaxed">
                The community is built around this. It's not extra. It's part of how the learning is designed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How the community works */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">The Pillars</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How the Community Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {communityPillars.map((pillar, i) => (
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
                    {pillar.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{pillar.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How you participate */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Getting Started</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How You Participate</h2>
          </div>
          <div className="flex flex-col gap-4">
            {howItWorks.map((step, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)]"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6 flex gap-5">
                  <span className="text-3xl font-black text-violet-400/20 flex-shrink-0 leading-none mt-1">{step.step}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community at a glance */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">At a Glance</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Community in Numbers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {communityBenefits.map((b, i) => (
              <div
                key={i}
                className="relative border border-white/[0.09] bg-bgPrimary/50 rounded-2xl overflow-hidden text-center shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.10)]"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.20] to-transparent" />
                <div className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-xl font-bold text-primary">{b.value}</span>
                  </div>
                  <p className="font-semibold text-white text-sm mb-1">{b.title}</p>
                  <p className="text-white/35 text-xs leading-relaxed">{b.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connections block */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">The Connections Outlast the Curriculum</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Community access doesn't end when you finish a course. The relationships built here, the reputation you develop by helping others, the familiarity with instructors who've seen your actual work, these things carry forward.
              </p>
              <p className="text-white/50 leading-relaxed">
                Members have worked on real projects together, referred each other for opportunities, and stayed in contact long after their courses ended. The technical skills are what you came for. The network that forms around them is something you didn't necessarily expect. Both are real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-xl mx-auto text-center">
          <Trophy className="w-9 h-9 text-primary mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-white mb-4">Everyone Here Decided to Show Up</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            The common thread across every member is that they chose to invest in building a real skill. That shared decision creates an environment that's different from most online spaces.
          </p>
          <Link to="/packages" className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
            Join the Community
          </Link>
        </div>
      </section>
    </div>
  );
}
