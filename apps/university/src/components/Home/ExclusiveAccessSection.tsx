import { Check } from "lucide-react";

const rows = [
  {
    num: "01",
    title: "Step-by-step learning",
    description: "A structured curriculum built around real skills — not theory. Each module builds on the last.",
    video: "/videos/laptopAnimation.mp4",
    points: [
      { plain: "Easy-to-follow", bold: "structured curriculum" },
      { plain: "New in-demand skills", bold: "constantly added" },
      { plain: "Learn on our", bold: "hyper-advanced platform" },
    ],
  },
  {
    num: "02",
    title: "Daily live sessions",
    description: "Join live sessions with expert coaches every day. Get answers in real time, not days later.",
    video: "/videos/phoneAnimationHorizontal.mp4",
    points: [
      { plain: "Live sessions with", bold: "expert coaches" },
      { plain: "Get your questions", bold: "answered in real-time" },
      { plain: "Network with", bold: "100,000+ students" },
    ],
  },
  {
    num: "03",
    title: "An exclusive community",
    description: "Surround yourself with driven, like-minded people who push you forward every step of the way.",
    video: "/videos/phoneAnimationVertical.mp4",
    points: [
      { plain: "Connect with", bold: "driven, like-minded individuals" },
      { plain: "Get guided at", bold: "every step of your journey" },
      { plain: "Share milestones with", bold: "a community that cares" },
    ],
  },
];

export default function ExclusiveAccessSection() {
  return (
    <section className="bg-[#0a0a0a] py-24 px-6 sm:px-10 border-t border-white/[0.06]">
      <div className="max-w-screen-2xl mx-auto">

        <div className="mb-14" data-aos="fade-up" data-aos-duration="600">
          <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-3">
            Exclusive features
          </p>
          <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            What you get access to
          </h2>
        </div>

        <div className="flex flex-col gap-px bg-white/[0.06]">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a]"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={`${i * 80}`}
            >
              <div className="flex flex-col justify-center gap-6 p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                <span className="text-xs font-mono text-white/20 tracking-wider">{row.num}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-white/90 tracking-tight">
                    {row.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {row.description}
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5 pt-2">
                  {row.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/50 leading-relaxed">
                        {pt.plain}{" "}
                        <span className="text-white/80 font-medium">{pt.bold}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-h-[280px] lg:min-h-0 overflow-hidden bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={row.video} type="video/mp4" />
                </video>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
