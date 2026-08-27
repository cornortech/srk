import { ArrowLeft, CheckCircle } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const milestones = [
  {
    month: "1st Month",
    badge: "https://framerusercontent.com/images/plKaBkHMa06dVIe6HWAbN4Pbo.png?scale-down-to=512",
    title: "Apprentice: The Foundation Stage",
    summary: "Your journey begins with access to the essential curriculum and an introduction to the SRK University community.",
    what: "The first month is about establishing your foundation. You unlock the core learning programs and get introduced to mentors and peers who are further along in their own journey. Orientation here isn't just to the software tools. It's to the habits of someone who actually commits to getting better.",
    skills: [
      "Introduction to your chosen creative software tools",
      "Foundational design or editing principles",
      "Community onboarding and peer networking",
      "Goal-setting frameworks for structured learning",
      "First practical projects and exercises",
    ],
    significance: "The Apprentice stage is the most important one. Not because it covers the most material, but because the habits built here determine everything that follows. Students who engage properly in Month 1 finish at much higher rates across the whole program.",
  },
  {
    month: "2nd Month",
    badge: "https://framerusercontent.com/images/YFix4Deko7x1GshIpktU9HpQTqw.png?scale-down-to=512",
    title: "Network Access: Connect with High-Achievers",
    summary: "Access SRK University's exclusive learning network, with monthly live sessions featuring experienced professionals.",
    what: "By Month 2 your foundational skills are taking shape. You gain access to a network of experienced professionals through monthly live calls and sessions. These are people who built real careers using the same skills you're developing. Their experiences, both successes and setbacks, become part of your education.",
    skills: [
      "Access to exclusive monthly live sessions",
      "Peer network of serious learners and practitioners",
      "Q&A opportunities with experienced professionals",
      "Real-world case studies and project breakdowns",
      "Cross-discipline insights that expand your perspective",
    ],
    significance: "The people you learn alongside and the mentors you can reach are often just as valuable as the curriculum itself. The network here is kept focused and serious, and it shows in the quality of what happens inside it.",
  },
  {
    month: "3rd Month",
    badge: "https://framerusercontent.com/images/n5kZjDcBi59NvLAWTe6LWsf4WTk.png?scale-down-to=512",
    title: "Lifestyle Mastery: Beyond the Craft",
    summary: "Unlock programs focused on holistic development, health, presentation, and personal effectiveness.",
    what: "Month 3 introduces something most skill platforms overlook: the whole person. The skills you're building are only as useful as the person applying them. This milestone unlocks programs focused on physical wellness, personal presentation, and the habits that support sustained high performance.",
    skills: [
      "Holistic wellness and sustainable energy management",
      "Personal presentation and professional appearance",
      "Productivity habits and focused work principles",
      "The relationship between physical health and cognitive performance",
      "Building a lifestyle that supports long-term growth",
    ],
    significance: "The most technically skilled people often underperform because they neglect the physical and mental habits that fuel their best work. Month 3 addresses this directly. The goal is to be more complete and more sustainable, not just more capable.",
  },
  {
    month: "4th Month",
    badge: "https://framerusercontent.com/images/YpitNuObeF9iU8BVZHfVm7CPhc.png?scale-down-to=512",
    title: "Live Mentorship: Direct Access to Expertise",
    summary: "Monthly live calls with SRK University's expert team. Ask questions, get guidance on your actual work, and push your progress.",
    what: "From Month 4 onwards, you participate in direct monthly live sessions with SRK University's expert instructors. These are live, interactive sessions where you can ask about your specific projects, challenges, and goals. Not pre-recorded answers to generic questions. Real responses to your real situation.",
    skills: [
      "Real-time feedback on your projects and work",
      "Personalised guidance tailored to your progress",
      "Advanced technique discussion with practicing experts",
      "Problem-solving support for specific creative challenges",
      "Strategic advice on building your skill portfolio",
    ],
    significance: "Access to experienced mentors is usually reserved for formal apprenticeships or expensive coaching. SRK University makes this kind of guidance available to all members, removing one of the main barriers to actually developing fast.",
  },
  {
    month: "6th Month",
    badge: "https://framerusercontent.com/images/MQeeVeaUyDRbUIGFuyvbZtYSPw.png?scale-down-to=512",
    title: "Elite Channels: The Inner Circle",
    summary: "Access exclusive channels connecting you with the most accomplished members of the SRK University network.",
    what: "By Month 6 you've built a real working skill set and a strong foundation in your chosen disciplines. This milestone unlocks exclusive access to channels at the highest level of the SRK University network, where you connect with the platform's most experienced members and community leaders.",
    skills: [
      "Access to exclusive high-level community channels",
      "Exposure to advanced strategies and methodologies",
      "Mentorship from the platform's most experienced members",
      "Portfolio review and advanced critique opportunities",
      "Collaborative project and partnership opportunities",
    ],
    significance: "Month 6 marks the shift from learner to active participant among seriously committed people. The connections formed here often turn out to be among the most valuable things that came from the whole journey.",
  },
  {
    month: "12th Month",
    badge: "https://framerusercontent.com/images/GOHVqZW4GaDzczOm3gPf6VkBgs.png?scale-down-to=512",
    title: "Emperor Status: Mastery Achieved",
    summary: "The pinnacle of the SRK University journey. A marker of genuine expertise, sustained learning, and real commitment.",
    what: "Month 12 represents the full completion of the SRK University learning journey. At this stage you're not a beginner or a student still finding their footing. You're someone with a track record of learning, applying, and improving across a real span of time. Emperor status isn't given. It's earned through consistent, serious engagement with both the curriculum and the community.",
    skills: [
      "Demonstrated proficiency across your chosen course tracks",
      "A portfolio of completed projects spanning real applications",
      "Advanced creative and strategic decision-making ability",
      "Peer and mentor recognition within the community",
      "The foundation to continue growing independently",
    ],
    significance: "Emperor status matters not because of the title, but because of what it represents. Someone who stayed with a structured program for 12 months, engaged with mentors, and applied skills to real projects has built something that can't be faked.",
  },
];

export default function MilestoneJourneyPage() {
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
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">The Learning Journey</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Your Milestone Journey at SRK University
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Every month of committed learning at SRK University unlocks a new layer of access, expertise, and
            recognition. Here is the complete breakdown of what each milestone means and what it gives you.
          </p>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

            <div className="flex flex-col gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="sm:flex gap-6" data-aos="fade-up" data-aos-duration="600" data-aos-delay={String(i * 60)}>
                  {/* Dot */}
                  <div className="hidden sm:flex flex-col items-center pt-6">
                    <div className="w-3 h-3 rounded-full border-2 border-primary/60 bg-bgPrimary shadow-[0_0_8px_rgba(182,137,56,0.4)] z-10 shrink-0" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 relative border border-white/[0.08] bg-bgSecondary rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)] hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.20] to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                    {/* Card header */}
                    <div className="relative p-6 sm:p-8 border-b border-white/[0.06] flex items-start gap-5">
                      <img src={m.badge} alt={`${m.month} Badge`} className="w-16 h-16 shrink-0" />
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold tracking-widest uppercase mb-2">
                          {m.month}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{m.title}</h2>
                        <p className="text-white/40 text-sm">{m.summary}</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">What This Unlocks</h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-5">{m.what}</p>
                        <h3 className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">Specific Benefits</h3>
                        <ul className="space-y-2">
                          {m.skills.map((s, si) => (
                            <li key={si} className="flex items-start gap-2.5 text-white/50 text-sm">
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative border border-primary/[0.14] rounded-xl p-5 bg-bgPrimary/40 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(182,137,56,0.10)] h-fit">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
                        <h3 className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">Why This Matters</h3>
                        <p className="text-white/55 text-sm leading-relaxed">{m.significance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Begin Your Milestone Journey</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Every milestone above is available to you, one month at a time. Start with Month 1 and discover
            what a committed year of structured learning can produce.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]"
          >
            View Packages
          </Link>
        </div>
      </section>
    </div>
  );
}
