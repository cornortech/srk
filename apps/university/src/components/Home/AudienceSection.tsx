import { Building2, BookOpen, Crown, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardBody } from "@nextui-org/react";
import { Link } from "react-router-dom";

const DROP_POSITIONS = ["12%", "37.3%", "62.7%", "88%"] as const;

export function AudienceSection() {
  const audiences = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "BEGINNERS",
      description:
        "Jumpstart your journey with step-by-step guidance, practical resources, and supportive community",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "PROFESSIONALS",
      description:
        "Learn how to launch a profitable online business while keeping your full-time job.",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "ENTREPRENEURS",
      description:
        "Expand your toolkit with insights and tactics from experts who have been where you are.",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "BUSINESS OWNERS",
      description:
        "Modernize your approach and find new ways to scale and optimize your existing business.",
    },
  ];

  return (
    <section className="bg-bgPrimary flex flex-col items-center justify-center pt-6 pb-10 px-4 sm:px-6">
      <div className="w-full max-w-7xl">

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-0">
          WHO IS THE SRK UNIVERSITY FOR?
        </h2>

        {/* ── Figma-style connector tree — desktop only ─────────────────── */}
        <div className="relative hidden lg:block h-14 pointer-events-none">

          {/* Trunk — center vertical drop */}
          <div
            className="absolute w-px top-0 h-7 -translate-x-px"
            style={{
              left: "50%",
              background: "linear-gradient(to bottom, rgba(182,137,56,0.1), rgba(182,137,56,0.5))",
            }}
          />

          {/* Horizontal branch */}
          <div
            className="absolute h-px top-7"
            style={{
              left: "12%",
              right: "12%",
              background: "rgba(182,137,56,0.35)",
            }}
          />

          {/* Four vertical drops from branch to card tops */}
          {DROP_POSITIONS.map((left) => (
            <div
              key={left}
              className="absolute w-px"
              style={{
                left,
                top: "28px",
                height: "28px",
                background: "linear-gradient(to bottom, rgba(182,137,56,0.5), rgba(182,137,56,0.15))",
              }}
            />
          ))}

          {/* Junction squares on horizontal bar (boxy/Figma style) */}
          {DROP_POSITIONS.map((left) => (
            <div
              key={left}
              className="absolute animate-pulse"
              style={{
                left,
                top: "24px",
                width: "7px",
                height: "7px",
                transform: "translateX(-50%)",
                background: "rgba(182,137,56,0.75)",
                boxShadow: "0 0 6px rgba(182,137,56,0.5)",
              }}
            />
          ))}

          {/* Centre spine junction */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "24px",
              width: "5px",
              height: "5px",
              transform: "translateX(-50%)",
              background: "rgba(182,137,56,0.45)",
            }}
          />

          {/* Bottom endpoint squares — sit right on the card's top edge */}
          {DROP_POSITIONS.map((left) => (
            <div
              key={left}
              className="absolute"
              style={{
                left,
                bottom: "0px",
                width: "5px",
                height: "5px",
                transform: "translateX(-50%)",
                background: "rgba(182,137,56,0.5)",
                boxShadow: "0 0 4px rgba(182,137,56,0.4)",
              }}
            />
          ))}

        </div>
        {/* ──────────────────────────────────────────────────────────────── */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <Card
              key={index}
              isPressable
              className="bg-content1/5 backdrop-blur-sm border border-primary border-opacity-60 bg-bgSecondary"
              shadow="sm"
            >
              <CardBody className="flex flex-col items-center text-center px-6 py-8 gap-5 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-primary text-lg sm:text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="text-default-500 text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Know More button */}
        <div className="flex flex-col items-center gap-1.5 mt-8">
          <Link
            to="/learn/who-is-it-for"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
          >
            Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11px] text-white/25">find out if it's the right fit for you</span>
        </div>

      </div>
    </section>
  );
}
