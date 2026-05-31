import { ArrowLeft, CheckCircle, Layers, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const tracks = [
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    img: "/courses/photoshop.png",
    category: "Visual Design",
    level: "Beginner",
    duration: "8 weeks",
    what: "Adobe Photoshop is the world's leading image editing and design software, used by photographers, designers, and marketers across every industry. It gives you complete control over images, from basic retouching to complex compositing and digital illustration.",
    skills: [
      "Photo retouching and restoration",
      "Layer-based compositing and masking",
      "Typography and text effects",
      "Social media graphic creation",
      "Digital illustration and painting",
      "Export optimisation for web and print",
    ],
    careers: [
      "Graphic Designer",
      "Social Media Content Creator",
      "Photo Editor",
      "Marketing Creative",
      "Brand Designer",
    ],
    insight: "Photoshop proficiency is listed as a required skill in over 60% of creative industry job postings globally. Mastering it opens doors across photography, marketing, publishing, and digital art.",
  },
  {
    id: "graphic-design",
    name: "Graphic Design Foundations",
    img: "/courses/graphicDesign.png",
    category: "Visual Design",
    level: "Beginner",
    duration: "14 weeks",
    what: "Graphic design is about more than making things look good. It combines psychology, communication, and visual art to get messages across with clarity and impact. This course teaches you the principles behind every good design decision.",
    skills: [
      "Typography: choosing and pairing typefaces",
      "Colour theory and palette creation",
      "Grid systems and layout fundamentals",
      "Visual hierarchy and composition",
      "Logo and brand identity design",
      "Print and digital design adaptation",
    ],
    careers: [
      "Graphic Designer",
      "Brand Identity Designer",
      "UI/UX Designer",
      "Marketing Designer",
      "Print Production Specialist",
    ],
    insight: "Understanding design principles makes you effective not just as a designer, but as a communicator. These skills translate directly to how you present ideas, structure documents, and build visual identities.",
  },
  {
    id: "premiere-pro",
    name: "Premiere Pro Mastery",
    img: "/courses/pr.png",
    category: "Video Production",
    level: "Intermediate",
    duration: "10 weeks",
    what: "Adobe Premiere Pro is the professional standard for video editing in television, film, and digital media. From YouTube creators to broadcast journalists, it's the tool that powers visual storytelling across the world's biggest platforms.",
    skills: [
      "Non-linear video editing workflow",
      "Colour grading and correction",
      "Audio editing and mixing",
      "Titles, captions, and motion text",
      "Multi-camera sequence editing",
      "Export settings for all platforms",
    ],
    careers: [
      "Video Editor",
      "Content Creator",
      "Videographer",
      "Post-Production Specialist",
      "YouTube Channel Producer",
    ],
    insight: "Video content consumption has grown by over 150% in the last five years. Skilled video editors are among the most in-demand creative professionals today, with opportunities spanning every industry.",
  },
  {
    id: "after-effects",
    name: "After Effects for Motion Graphics",
    img: "/courses/AE.png",
    category: "Animation & Motion",
    level: "Advanced",
    duration: "12 weeks",
    what: "After Effects is the industry standard for motion graphics, visual effects, and animated content. It adds movement, storytelling, and visual polish to your video work in ways that static editing tools simply can't.",
    skills: [
      "Keyframe animation and easing",
      "Motion graphics and kinetic typography",
      "Visual effects compositing",
      "Green screen / chroma key workflows",
      "Expression scripting for automation",
      "3D space and camera animation",
    ],
    careers: [
      "Motion Graphics Designer",
      "VFX Artist",
      "Broadcast Designer",
      "Animation Director",
      "Creative Technologist",
    ],
    insight: "Motion designers are among the highest-paid creative professionals. As brands increasingly rely on animated content for social media, advertising, and product demos, the skill gap in motion design is growing rapidly.",
  },
  {
    id: "davinci",
    name: "DaVinci Resolve",
    img: "/courses/davinci.png",
    category: "Video Production",
    level: "Beginner",
    duration: "10 weeks",
    what: "DaVinci Resolve is a professional-grade video editing and colour grading platform used by Hollywood productions and independent filmmakers alike. It's available as a fully functional free version, which makes it one of the most accessible ways into high-quality video work.",
    skills: [
      "Video editing with the Cut and Edit pages",
      "Professional colour grading with colour wheels",
      "Fusion visual effects integration",
      "Audio post-production with Fairlight",
      "Collaboration features for team projects",
      "Delivery and export for broadcast standards",
    ],
    careers: [
      "Colourist",
      "Video Editor",
      "Documentary Filmmaker",
      "Corporate Video Producer",
      "Freelance Editor",
    ],
    insight: "DaVinci Resolve's free version offers capabilities previously only available in enterprise software. Learning it gives you access to the same tools used in Oscar-winning productions at zero software cost.",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing Mastery",
    img: "/courses/digitalMarketing.png",
    category: "Marketing",
    level: "Intermediate",
    duration: "12 weeks",
    what: "Digital marketing is about growing audiences, building brands, and communicating value through online channels. This course covers the full range, from search engine optimisation and paid advertising to social media strategy and making decisions from data.",
    skills: [
      "Search Engine Optimisation (SEO) fundamentals",
      "Google Ads campaign creation and management",
      "Social media strategy and content planning",
      "Email marketing and audience segmentation",
      "Analytics: reading and acting on data",
      "Brand positioning and messaging",
    ],
    careers: [
      "Digital Marketing Specialist",
      "SEO Analyst",
      "Social Media Manager",
      "Content Strategist",
      "Growth Marketer",
    ],
    insight: "Digital marketing is one of the few fields where results genuinely matter more than credentials. What you can demonstrate outweighs where you studied. And every business on the planet needs these skills.",
  },
  {
    id: "indesign",
    name: "Adobe InDesign",
    img: "/courses/Id.png",
    category: "Publishing & Layout",
    level: "Intermediate",
    duration: "8 weeks",
    what: "Adobe InDesign is the professional tool for multi-page documents, print publications, interactive PDFs, and digital magazines. It's the final step in the creative workflow, where design and content come together into something ready to publish.",
    skills: [
      "Document setup for print and digital",
      "Master pages and paragraph styles",
      "Typography and text flow management",
      "Image placement and linking",
      "Interactive PDF creation",
      "Pre-press and print production",
    ],
    careers: [
      "Editorial Designer",
      "Publication Designer",
      "Book Layout Artist",
      "Proposal and Report Designer",
      "Marketing Production Artist",
    ],
    insight: "InDesign bridges the gap between design and publishing. Professionals who can deliver print-ready, publication-quality documents are highly valued in agencies, publishing houses, and corporate communications teams.",
  },
  {
    id: "communication",
    name: "Communication Skills",
    img: "/coursesCommunicationSkill.png",
    category: "Professional Development",
    level: "Beginner",
    duration: "6 weeks",
    what: "Communication is the foundation of every professional relationship, every leadership role, and every creative collaboration. This course trains you in verbal, non-verbal, and written communication, giving you the confidence and clarity to express ideas effectively in any context.",
    skills: [
      "Active listening and comprehension",
      "Verbal communication and voice modulation",
      "Non-verbal communication and body language",
      "Public speaking and presentation skills",
      "Professional writing and email etiquette",
      "Conflict resolution and difficult conversations",
    ],
    careers: [
      "Team Leader",
      "Client Relations Manager",
      "Public Speaker",
      "Teacher or Trainer",
      "Any professional role requiring human interaction",
    ],
    insight: "Research consistently shows that communication skills are the number one quality employers seek in candidates, regardless of field. Technical expertise without communication ability is significantly undervalued in the workplace.",
  },
];

export default function CourseTracksPage() {
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
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Course Catalogue</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            What You'll Learn at SRK University
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Each course is built around a specific tool or discipline with clear career applications. Here's a detailed
            look at every track we offer, what it covers, and where it can take you.
          </p>
        </div>
      </section>

      {/* Course Tracks */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="relative border border-white/[0.08] rounded-2xl bg-bgSecondary overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)] hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-500"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={String((index % 3) * 60)}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.20] to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative p-6 sm:p-8 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={track.img}
                  alt={track.name}
                  className="w-14 h-14 rounded-xl object-cover bg-bgPrimary shrink-0"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-semibold uppercase tracking-wider">
                      {track.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-white/10 text-white/30 text-[10px] uppercase tracking-wider">
                      {track.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-white/10 text-white/30 text-[10px] uppercase tracking-wider">
                      {track.duration}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{track.name}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-8">
                {/* Left */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" /> About This Course
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{track.what}</p>
                  </div>

                  <div>
                    <h3 className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5" /> Skills You'll Develop
                    </h3>
                    <ul className="space-y-2">
                      {track.skills.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/55 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Career Paths
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {track.careers.map((c, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full border border-primary/25 text-primary/70 text-xs font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative border border-primary/[0.14] rounded-xl p-5 bg-bgPrimary/40 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(182,137,56,0.10)]">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
                    <h3 className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Why It Matters
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{track.insight}</p>
                  </div>

                  <Link
                    to={`/course/${index + 1}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary/35 text-primary/70 text-sm font-medium rounded hover:border-primary hover:text-primary transition-colors"
                  >
                    View Full Curriculum
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Every course above is included in one of our learning packages. Pick the package that fits your goals
            and get started today.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]"
          >
            View Packages
          </Link>
        </div>
      </section>
    </div>
  );
}
