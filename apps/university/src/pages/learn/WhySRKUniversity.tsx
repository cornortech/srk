import { ArrowLeft, CheckCircle, Users, BookOpen, Award, Clock, Layers, Shield } from "lucide-react";
import { useAOS } from "../../lib/aos";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Industry-Relevant Curriculum",
    body: "Every course at SRK University is built around one question: what does the industry actually need right now? The curriculum covers tools and workflows that people in creative roles, marketing, and communication use every day. Not theoretical frameworks that rarely come up in real work.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Instructors with Real Experience",
    body: "Instructors here aren't academics teaching from textbooks. They're people with real working experience in their fields. From video editors to digital marketers, each one brings the kind of knowledge you only get from doing the work, not studying it.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Truly Self-Paced Learning",
    body: "Life doesn't run on a fixed schedule. SRK University gives you full flexibility. Watch lessons at 2 AM, rewatch anything you found difficult, go as slowly or as quickly as your life allows. No penalties for going slow, no limits on going fast.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Structured Progression from Zero to Advanced",
    body: "Many platforms assume you already know things and jump straight in. SRK University builds skills layer by layer, starting from foundational concepts and adding complexity gradually. Each module reinforces what came before it. Advanced skills get built on something solid.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "A Platform You Can Trust",
    body: "SRK University operates under SRK Group Private Limited, a registered corporate entity. The platform launched officially in February 2025 following months of curriculum development and infrastructure testing. Every course has been reviewed for quality, accuracy, and practical applicability before it reaches students.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "A Community That Grows With You",
    body: "Learning isn't just about content. It's also about the people around you. SRK University has an active community where students ask questions, share work, get feedback, and celebrate each other's progress. The connections formed here often last well beyond the course.",
  },
];

const courses = [
  { name: "Adobe Photoshop", category: "Visual Design", level: "Beginner" },
  { name: "Graphic Design Foundations", category: "Visual Design", level: "Beginner" },
  { name: "Adobe Illustrator", category: "Visual Design", level: "Intermediate" },
  { name: "Adobe InDesign", category: "Publishing", level: "Intermediate" },
  { name: "Premiere Pro Mastery", category: "Video Production", level: "Intermediate" },
  { name: "After Effects for Motion Graphics", category: "Animation", level: "Advanced" },
  { name: "DaVinci Resolve", category: "Video Production", level: "Beginner" },
  { name: "Digital Marketing Mastery", category: "Marketing", level: "Intermediate" },
  { name: "Communication Skills", category: "Professional Skills", level: "Beginner" },
];

export default function WhySRKUniversityPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(182,137,56,0.10) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
            Our Approach
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            How SRK University Delivers Real Value
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            There are plenty of online courses. What's rare is a platform that combines good instruction, practical curriculum, a real community, and structured progression into one thing that actually holds together.
          </p>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">What Sets Us Apart</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The Six Pillars of SRK University</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="group relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(index * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-24 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-6 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-custom-gradient flex items-center justify-center text-black shrink-0 shadow-[0_4px_12px_rgba(182,137,56,0.25)]">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-2">{pillar.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{pillar.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Not Traditional */}
      <section className="py-16 px-4 sm:px-6 bg-bgSecondary border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">A Different Way to Learn</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Skills Education Is Changing</h2>
          </div>
          <div className="relative border border-white/[0.08] bg-bgPrimary/50 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]" data-aos="fade-up" data-aos-duration="600">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            <div className="p-8 grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white/50 font-semibold mb-4 text-base">The Old Way</h3>
                <ul className="space-y-3">
                  {[
                    "Fixed class schedules that don't fit working adults",
                    "Broad theoretical curricula with limited practical application",
                    "Years of commitment before seeing career-relevant results",
                    "One-size-fits-all instruction regardless of prior knowledge",
                    "Expensive, location-dependent access to quality instruction",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/35 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-primary font-semibold mb-4 text-base">The SRK Way</h3>
                <ul className="space-y-3">
                  {[
                    "Learn on your own schedule, from anywhere in the world",
                    "Practical, tool-specific training applicable from day one",
                    "Skill-building structured for fast, visible progress",
                    "Layered curriculum that adapts to where you start",
                    "Premium instruction at a fraction of traditional costs",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalogue */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">Our Curriculum</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Courses Available Right Now</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">
              SRK University currently offers Part 1 of our planned four-part curriculum. New courses are
              added based on learner demand and industry developments.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <div
                key={i}
                className="relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-primary/20 hover:shadow-[0_6px_24px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.10)] transition-all duration-500"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String((i % 3) * 60)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
                <div className="p-5 flex flex-col gap-2">
                  <span className="text-primary/50 text-[10px] uppercase tracking-[0.2em] font-medium">{course.category}</span>
                  <h3 className="text-white font-semibold text-sm">{course.name}</h3>
                  <span className="inline-flex w-fit mt-1 px-2.5 py-0.5 rounded-full border border-white/10 text-white/30 text-[10px]">
                    {course.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility section */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Our Track Record</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Built on Real Results</h2>
          <p className="text-white/45 text-sm sm:text-base leading-relaxed mb-10">
            Since our official launch in February 2025, SRK University has trained over 100,000 students
            across Nepal and beyond. Our learners have gone on to build portfolios, apply creative skills in
            their careers, and contribute meaningfully to the communities around them. We are proud of every
            story, and we're committed to creating many more.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { number: "100K+", label: "Students Trained" },
              { number: "9+", label: "Active Courses" },
              { number: "2025", label: "Officially Launched" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative border border-primary/[0.15] rounded-xl py-6 px-4 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(182,137,56,0.12)]"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String(i * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                <div className="text-2xl sm:text-3xl font-black bg-custom-gradient bg-clip-text text-transparent">{stat.number}</div>
                <div className="text-white/35 text-[10px] uppercase tracking-[0.2em] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">See It for Yourself</h2>
          <p className="text-white/40 text-sm mb-8">
            Explore our courses, read student stories, and find the learning path that's right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/packages"
              className="inline-flex items-center justify-center px-7 py-3 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]"
            >
              View Packages
            </Link>
            <Link
              to="/learn/course-tracks"
              className="inline-flex items-center justify-center px-7 py-3 border border-primary/40 text-primary/80 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
