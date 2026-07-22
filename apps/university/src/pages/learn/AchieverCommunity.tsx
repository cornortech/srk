import { ArrowLeft, Users, Star, Target, Heart, Handshake, Trophy, CheckCircle } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const communityValues = [
  {
    icon: <Target className="w-5 h-5 text-emerald-400" />,
    title: "Everyone Is Headed in the Same Direction",
    description: "Every member made a decision to build a skill set that matters. That shared direction changes every conversation in the space. Talk is oriented toward doing. Doing is oriented toward improving. The culture selects for people who actually mean it.",
  },
  {
    icon: <Heart className="w-5 h-5 text-emerald-400" />,
    title: "Sharing What You Know Doesn't Cost You",
    description: "In a community of people building skills, sharing a useful tip doesn't give anyone an advantage over you. It builds your reputation. The people who give the most freely are the most respected in the community. That's just how it plays out.",
  },
  {
    icon: <Handshake className="w-5 h-5 text-emerald-400" />,
    title: "Honest Feedback Over Empty Praise",
    description: "When someone's composition isn't working, they're told why, with reference to actual design principles. When an edit is slow, the pacing issue is identified specifically. Vague encouragement doesn't help anyone improve. Honest feedback at this level is treated as something valuable.",
  },
  {
    icon: <Trophy className="w-5 h-5 text-emerald-400" />,
    title: "Other People's Progress Is Good News",
    description: "When someone finishes their first real project, completes a capstone, or gets their first piece of positive outside feedback, it gets celebrated. This isn't a competitive environment. Someone else reaching a milestone is proof that the same milestone is within reach for you.",
  },
];

const communityActivities = [
  {
    title: "Weekly Showcase",
    description: "Members post a piece of work each week in the showcase channel. Feedback comes from peers and tagged instructors. Over time your showcase becomes a visible record of how your work has developed. You can look back at what you made in month one.",
  },
  {
    title: "Monthly Challenges",
    description: "A brief gets issued each month, a design brief, an editing prompt, a marketing scenario. Participation is optional but consistently high because having a deadline and a shared topic makes it easier to sit down and actually do the work.",
  },
  {
    title: "Skill Exchange",
    description: "Members from different disciplines review each other's work. A graphic designer's eye on a video edit, a motion artist's take on a marketing visual. That cross-discipline perspective regularly surfaces improvements that someone inside the same field would miss.",
  },
  {
    title: "Progress Threads",
    description: "Some members document their full journey from day one in a long thread. These attract genuine mentorship from more advanced members who recognize the early stages of their own path. They're among the most read things in the community.",
  },
];

const achieverTraits = [
  "Taking feedback with curiosity rather than defensiveness",
  "Sharing process as freely as finished work",
  "Coming back to help after receiving help",
  "Treating a plateau as information, not failure",
  "Looking at what adjacent disciplines are doing",
  "Caring about getting better more than looking finished",
];

export default function AchieverCommunityPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(5,150,105,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Community of Achievers</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            The People You Learn <span className="text-primary">Alongside</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            The people around you while you're learning shape how fast you grow, how long you stick with it, and how high you set your own bar. The SRK University community of achievers isn't just an audience for your progress. It's actively part of it.
          </p>
        </div>
      </section>

      {/* What makes it different */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">What Makes This Community Different</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Most general learning communities have low engagement, vague encouragement, and no shared context. This one doesn't, because every member is working in the same direction. That shared reference point changes every interaction.
              </p>
              <p className="text-white/50 leading-relaxed mb-4">
                When a graphic design student posts a composition for feedback, the people responding understand what the designer was trying to do, what tools produced it, and what a professional version looks like. Feedback at that level of context is qualitatively different from generic praise or criticism.
              </p>
              <p className="text-white/50 leading-relaxed">
                Everyone here is working. That's the whole difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community values */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">The Foundation</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What the Community Is Built On</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {communityValues.map((value, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgPrimary/60 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-400/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 border border-emerald-400/20 flex items-center justify-center mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                    {value.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{value.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What actually happens */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Day to Day</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What Actually Happens in the Community</h2>
          </div>
          <div className="flex flex-col gap-4">
            {communityActivities.map((activity, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] border-l-2 border-l-emerald-400/30 bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)]"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6">
                  <h3 className="text-emerald-400 font-bold text-sm mb-2">{activity.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achiever traits */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-primary/[0.12] bg-bgPrimary/40 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(182,137,56,0.12)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-custom-gradient flex items-center justify-center shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                  <Star className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-xl font-bold text-white">What Achievers Actually Do</h2>
              </div>
              <p className="text-white/50 leading-relaxed mb-6">
                The word 'achiever' isn't a label. It describes how people in this community behave. The most engaged and fastest-improving members share some consistent traits:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {achieverTraits.map((trait, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-white/55 text-sm">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Why It Changes How Fast You Learn</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Members who participate actively in community channels consistently progress through the curriculum faster and produce better final projects than those who only watch content. The reason is simple: active participation creates multiple feedback loops running at the same time.
              </p>
              <p className="text-white/50 leading-relaxed mb-4">
                You get critique on your own work. You see how your feedback lands on other people's. You watch instructors handle problems you haven't reached yet. Each of those teaches something the lessons alone don't.
              </p>
              <p className="text-white/50 leading-relaxed">
                And when a technique isn't clicking and progress feels slow, being surrounded by people pushing through the same difficulty and coming out the other side is genuinely useful. That's harder to quantify but it's real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-xl mx-auto text-center">
          <Users className="w-9 h-9 text-emerald-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-white mb-4">You Won't Learn Alone Here</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            The community is set up so that regardless of what level you join at, there are people ahead of you to learn from and people behind you to teach. That dynamic is one of the most powerful learning structures there is.
          </p>
          <Link to="/packages" className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
            Join the Community
          </Link>
        </div>
      </section>
    </div>
  );
}
