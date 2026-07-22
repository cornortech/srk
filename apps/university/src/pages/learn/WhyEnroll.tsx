import { ArrowLeft, CheckCircle, BookOpen, Users, Award, Clock, MessageCircle, Layers } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const includes = [
  { icon: <BookOpen className="w-5 h-5" />, title: "Full Course Access", body: "Immediate access to all courses in your chosen package. No waiting, no drip-feeding. Start learning from day one." },
  { icon: <Clock className="w-5 h-5" />, title: "Self-Paced Learning", body: "No schedules, no deadlines. Learn when you want, at whatever speed feels right. Revisit lessons as many times as you need." },
  { icon: <Users className="w-5 h-5" />, title: "Community Membership", body: "Join an active community of learners, practitioners, and mentors. Ask questions, share your progress, and give and receive feedback." },
  { icon: <Award className="w-5 h-5" />, title: "Milestone Recognition", body: "Progress through monthly milestones that unlock new access, resources, and recognition. Consistent commitment gets rewarded." },
  { icon: <MessageCircle className="w-5 h-5" />, title: "Expert Mentorship Access", body: "From Month 4 onwards, participate in live monthly calls with SRK University's expert instructors. Get real answers to real questions." },
  { icon: <Layers className="w-5 h-5" />, title: "Structured Curriculum", body: "Every course is structured from foundational to advanced. No gaps, no assumptions. Build your knowledge on solid ground." },
];

const faqs = [
  { q: "How soon can I start after enrolling?", a: "Immediately. Your course access is activated as soon as your enrolment is confirmed. No waiting period. You can begin your first lesson within minutes." },
  { q: "What if I find the material too difficult?", a: "Every course begins from the foundations. If you find a concept challenging, you can rewatch lessons as many times as needed. The community and support team are also available to help you work through any difficulties." },
  { q: "Can I access courses from a mobile device?", a: "Yes. The SRK University platform is fully responsive and works across desktop, tablet, and mobile devices. Many students complete significant portions of their learning during commutes and short breaks." },
  { q: "How long does access to the courses last?", a: "Course access is provided for 120 days from the date of purchase. This gives you a substantial window to complete your programme at a comfortable pace." },
  { q: "Are the instructors available to answer my questions?", a: "Beyond the community support channels, students gain direct live access to SRK University instructors from Month 4 of their journey. This is one of the most valued features of the programme." },
  { q: "Is SRK University a legitimate, registered institution?", a: "Yes. SRK University operates under SRK Group Private Limited, a registered corporate entity. The platform launched officially in February 2025 and has since trained over 100,000 students." },
];

const learningPath = [
  { step: "1", title: "Choose Your Package", desc: "Select the learning package that matches your goals and the courses you want to access." },
  { step: "2", title: "Create Your Account", desc: "Set up your student profile and get immediate access to your course dashboard." },
  { step: "3", title: "Begin Your First Lesson", desc: "Start with the introduction module of your chosen course and set your learning intention." },
  { step: "4", title: "Engage With the Community", desc: "Join the community channels relevant to your courses and introduce yourself to fellow learners." },
  { step: "5", title: "Complete Projects", desc: "Apply your learning through practical exercises and project work at the end of each module." },
  { step: "6", title: "Unlock Milestones", desc: "Progress through monthly milestones that reward your commitment and open new resources." },
];

export default function WhyEnrollPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(182,137,56,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Your Journey Starts Here</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Everything That's Waiting for You Inside SRK University
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Enrolling in SRK University isn't just signing up for a course. It's joining a structured learning experience built to develop real, lasting skills through expert guidance, community, and consistent practice.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">What You Get</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What's Included in Every Enrolment</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {includes.map((item, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6 flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-lg bg-custom-gradient flex items-center justify-center text-black shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning path */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Your First Week</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How Your Learning Journey Begins</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {learningPath.map((step, i) => (
              <div
                key={i}
                className="relative flex gap-4 border border-white/[0.07] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/15 hover:shadow-[0_6px_24px_rgba(0,0,0,0.28)] transition-all duration-500 p-5 bg-bgPrimary/40"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String((i % 2) * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                <div className="w-9 h-9 rounded-full bg-custom-gradient flex items-center justify-center text-black font-black text-sm shrink-0 shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why now */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">The Case for Starting</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Genuine Learners Choose SRK University</h2>
          </div>
          <div className="space-y-3">
            {[
              "SRK University teaches skills with direct, real-world applications. Not theoretical frameworks that take years to become useful.",
              "Every course is taught by someone with real working experience in their field, not just academic credentials.",
              "The structured curriculum means you build skills the right way from the start. Self-taught learners often pick up bad habits that take longer to unlearn than they did to form.",
              "The community provides accountability, feedback, and motivation that solo study simply doesn't replicate.",
              "The milestone system rewards consistency, making long-term engagement feel purposeful and progressive rather than open-ended.",
              "Over 100,000 students have already been through the programme, providing a track record of genuine impact.",
            ].map((point, i) => (
              <div
                key={i}
                className="relative flex items-start gap-3 border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/15 hover:shadow-[0_6px_20px_rgba(0,0,0,0.26)] transition-all duration-500 p-5"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 50)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-white/55 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Common Questions</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Before You Enrol</h2>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/15 hover:shadow-[0_6px_24px_rgba(0,0,0,0.28)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 50)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-3">{faq.q}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Learning Journey Starts With One Decision</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Choose the package that fits your goals and begin immediately. Everything you need is already inside.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="inline-flex items-center justify-center px-7 py-3 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]">
              View Packages
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center px-7 py-3 border border-primary/40 text-primary/80 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors">
              About SRK University
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
