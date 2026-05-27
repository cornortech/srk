import { BookOpen, Users, Star, type LucideIcon } from "lucide-react";

interface Item {
  Icon: LucideIcon;
  title: string;
  img: string;
  points: { plain: string; bold: string }[];
}

const items: Item[] = [
  {
    Icon: BookOpen,
    title: "Vital learning tools",
    img: "/team/landingImage1.jpg",
    points: [
      { plain: "World-class", bold: "custom-built learning platform" },
      { plain: "Structured pathways to", bold: "master skills faster" },
      { plain: "Progress tracking built for", bold: "consistent growth" },
    ],
  },
  {
    Icon: Users,
    title: "Private network",
    img: "/srklaptop.jpg",
    points: [
      { plain: "Celebrate your wins with", bold: "people who understand" },
      { plain: "Access knowledge", bold: "updated by industry experts" },
      { plain: "Network with", bold: "100,000+ fellow students" },
    ],
  },
  {
    Icon: Star,
    title: "Expert mentorship",
    img: "/bussinessman.jpg",
    points: [
      { plain: "Mentors are", bold: "leaders in their field" },
      { plain: "Build meaningful", bold: "connections along the way" },
      { plain: "Live sessions", bold: "every single week" },
    ],
  },
];

export default function ToolsSection() {
  return (
    <section className="bg-black py-24 px-6 sm:px-10 border-t border-white/[0.06]">
      <div className="max-w-screen-2xl mx-auto">

        <div className="mb-14" data-aos="fade-up" data-aos-duration="600">
          <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-3">
            A step-by-step path
          </p>
          <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            Tools to master your skills
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-white/[0.06]">
          {items.map((item, i) => {
            const Icon = item.Icon;
            return (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-16"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={`${i * 80}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : "lg:order-1"}>
                  <div className="aspect-video overflow-hidden rounded-lg border border-white/[0.08]">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className={`flex flex-col gap-8 ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded border border-white/10 bg-white/[0.03] flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-xs font-medium uppercase tracking-widest text-primary/70">
                      {item.title}
                    </h3>
                  </div>

                  <ul className="flex flex-col">
                    {item.points.map((pt, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-4 py-4 border-b border-white/[0.05] last:border-0"
                      >
                        <span className="text-primary/40 mt-0.5 flex-shrink-0 text-sm leading-none">—</span>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {pt.plain}{" "}
                          <span className="text-white/80 font-medium">{pt.bold}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
