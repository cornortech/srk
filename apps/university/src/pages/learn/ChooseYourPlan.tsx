import { ArrowLeft, Check, BookOpen, Users, Award, Clock, Headphones, Zap } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "SRK Basic",
    tagline: "Start your learning journey.",
    features: [
      "Access to 3 courses",
      "Course completion certificate",
      "3+ Pro tips and mentorship",
    ],
    forWho: "Perfect for absolute beginners who want to test the waters before committing to a full programme.",
  },
  {
    name: "SRK Standard",
    tagline: "Build real momentum.",
    features: [
      "Access to 5 courses",
      "Course completion certificate",
      "24/7 exclusive, dedicated support system",
      "5+ Pro tips and mentorship",
      "Complimentary access to advanced training systems",
    ],
    forWho: "Ideal for learners who know what they want and are ready to build consistent skills across multiple disciplines.",
  },
  {
    name: "SRK Premium",
    tagline: "Accelerate with expert support.",
    features: [
      "Access to 7 courses",
      "Course completion certificate",
      "Complimentary access to advanced training systems",
      "24/7 exclusive, dedicated support system",
      "Personalized coaching sessions by certified coaches",
      "7+ Pro tips and mentorship",
      "Live Session",
    ],
    forWho: "Built for driven learners who want structured coaching, live interaction, and accountability alongside their curriculum.",
  },
  {
    name: "SRK PRO",
    tagline: "The complete SRK experience.",
    features: [
      "Access to 10 courses",
      "Course completion certificate",
      "Complimentary access to advanced training systems",
      "24/7 exclusive, dedicated support system",
      "10+ Pro tips and mentorship",
      "Personalized coaching sessions by certified coaches",
      "Live Session",
      "Access to all items from the Ultimate SRK VIP collection",
    ],
    forWho: "The full suite. For learners who want everything — maximum courses, live sessions, VIP access, and the deepest level of mentorship available.",
  },
];

const whyChoose = [
  { icon: <BookOpen className="w-5 h-5" />, title: "Structured Curriculum", body: "Every course is built from foundational to advanced, with no gaps or assumptions. You learn the right way from the start." },
  { icon: <Headphones className="w-5 h-5" />, title: "24/7 Dedicated Support", body: "Available in Standard, Premium, and PRO plans. Your questions get answered around the clock by a team that knows the material." },
  { icon: <Users className="w-5 h-5" />, title: "Community Access", body: "Every plan includes access to the SRK University community — a network of learners and mentors progressing alongside you." },
  { icon: <Clock className="w-5 h-5" />, title: "Self-Paced Learning", body: "No deadlines, no rigid schedules. Learn when it works for you and revisit lessons as many times as you need." },
  { icon: <Award className="w-5 h-5" />, title: "Completion Certificates", body: "Every plan includes verifiable course completion certificates that demonstrate your skills to employers and clients." },
  { icon: <Zap className="w-5 h-5" />, title: "Constantly Updated", body: "New courses and skills are added regularly. Your enrolment grows with the platform — not frozen at the point of purchase." },
];

const faqs = [
  { q: "Can I upgrade my plan later?", a: "Yes. You can upgrade to a higher tier at any time. Your progress and certificates carry over — you only pay the difference." },
  { q: "How long does course access last?", a: "Course access is provided for 120 days from the date of purchase, giving you a substantial window to complete at your own pace." },
  { q: "What is the difference between Pro Tips and Live Sessions?", a: "Pro Tips are written guidance and strategic insights from SRK University mentors, delivered directly to enrolled students. Live Sessions are real-time, interactive online sessions where you can ask questions and receive direct feedback." },
  { q: "Is the VIP collection a physical product?", a: "The Ultimate SRK VIP collection is a curated bundle of premium digital resources, exclusive materials, and access credentials available only to SRK PRO members." },
  { q: "Do I need prior experience to start?", a: "No. Every course begins at the foundational level. The SRK Basic plan is specifically designed for complete beginners. Prior knowledge is not required for any entry-level course." },
];

export default function ChooseYourPlanPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">

      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(182,137,56,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Plans & Pricing</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Find the Plan That Fits Where You Are
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Each SRK University plan is built around a different stage of your learning journey — from first steps to full immersion. Here's everything you need to make the right choice.
          </p>
        </div>
      </section>

      {/* Plan breakdown */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">What Each Plan Includes</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Plan by Plan Breakdown</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase mb-1">{plan.name}</p>
                    <h3 className="text-white font-bold text-lg">{plan.tagline}</h3>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{plan.forWho}</p>
                  <div className="flex flex-col gap-2 pt-1">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-primary/70 mt-0.5 flex-shrink-0" />
                        <span className="text-white/55 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why these plans */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Built With Purpose</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What Every Plan Is Built Around</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChoose.map((item, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgPrimary/60 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/15 transition-all duration-500 p-5"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String((i % 3) * 70)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                <div className="w-10 h-10 rounded-lg bg-custom-gradient flex items-center justify-center text-black shadow-[0_4px_12px_rgba(182,137,56,0.2)] mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Common Questions</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Before You Choose a Plan</h2>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/15 transition-all duration-500 p-6"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 50)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <h3 className="text-white font-semibold text-sm mb-3">{faq.q}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Choose Your Plan?</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Every plan gives you immediate access to your courses and the SRK University community. Start today.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]"
          >
            View All Plans
          </Link>
        </div>
      </section>

    </div>
  );
}
