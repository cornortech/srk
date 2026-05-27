import {
  Film, Palette, TrendingUp, Sparkles, Layout,
  Monitor, Layers, BookOpen, MessageCircle, type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Skill {
  Icon: LucideIcon;
  title: string;
  description: string;
  img: string;
}

const skills: Skill[] = [
  {
    Icon: Film,
    title: "Premiere Pro Mastery",
    description: "Professional video editing from basic cuts to advanced post-production workflows.",
    img: "/courses/pr.png",
  },
  {
    Icon: Palette,
    title: "Photoshop Essentials",
    description: "Image manipulation, compositing, and professional graphic creation.",
    img: "/courses/photoshop.png",
  },
  {
    Icon: TrendingUp,
    title: "Digital Marketing",
    description: "SEO, social media strategy, and campaigns that drive measurable results.",
    img: "/courses/digitalMarketing.png",
  },
  {
    Icon: Sparkles,
    title: "After Effects",
    description: "Motion graphics, visual effects, and dynamic animation for any medium.",
    img: "/courses/AE.png",
  },
  {
    Icon: Layout,
    title: "Graphic Design",
    description: "Typography, layout, and colour theory — the foundations of strong visual design.",
    img: "/courses/graphicDesign.png",
  },
  {
    Icon: Monitor,
    title: "DaVinci Resolve",
    description: "Industry-standard colour grading and professional video production.",
    img: "/courses/davinci.png",
  },
  {
    Icon: Layers,
    title: "AI & Automation",
    description: "Leverage AI tools to streamline creative workflows and stay ahead of the curve.",
    img: "/courses/AI.png",
  },
  {
    Icon: BookOpen,
    title: "Adobe InDesign",
    description: "Layout design for print and digital publications with precision control.",
    img: "/courses/Id.png",
  },
  {
    Icon: MessageCircle,
    title: "Communication Skills",
    description: "Verbal, written, and visual communication that creates lasting impact.",
    img: "/coursesCommunicationSkill.png",
  },
];

export default function SkillsGridSection() {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <section className="bg-[#0a0a0a] py-24 px-6 sm:px-10 border-t border-white/[0.06]">
      <div className="max-w-screen-2xl mx-auto">

        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60">
              The SRK University curriculum
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
              10+ in-demand skills
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed sm:text-right">
            Every course is built around real skills that matter in today's professional world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {skills.map((skill, i) => {
            const Icon = skill.Icon;
            return (
              <div
                key={i}
                className="group bg-[#0a0a0a] hover:bg-[#0d0d0d] transition-colors duration-200 flex flex-col cursor-pointer"
                onClick={() => navigate(`/auth/sign-up?packageId=${proPackageId}`)}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={`${(i % 3) * 60}`}
              >
                <div className="flex flex-col gap-3 p-7 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded border border-white/10 bg-white/[0.03] flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white/85 tracking-tight">
                      {skill.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="aspect-video overflow-hidden border-t border-white/[0.06]">
                  <img
                    src={skill.img}
                    alt={skill.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-white/20 mt-8 tracking-widest uppercase text-center">
          More skills added regularly
        </p>

      </div>
    </section>
  );
}
