import { useNavigate } from "react-router-dom";
import { AnimationButton } from "../ReusableComponents";

interface Card {
  num: string;
  title: string;
  body: string;
  img: string;
}

const cards: Card[] = [
  {
    num: "01",
    title: "Your time is now",
    body: "The professional world is evolving fast. Those who invest in the right skills today position themselves ahead of the curve.",
    img: "/team/landingImage1.jpg",
  },
  {
    num: "02",
    title: "Skills shape your future",
    body: "Mastering a craft that opens doors across industries gives you the confidence and career trajectory you have always aimed for.",
    img: "/srklaptop.jpg",
  },
  {
    num: "03",
    title: "Invest in yourself",
    body: "Structured learning guided by experts who have walked the path gives you an edge that no shortcut can replicate.",
    img: "/bussinessman.jpg",
  },
];

export default function WhyNowSection() {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <section className="bg-[#0a0a0a] py-24 px-6 sm:px-10 border-t border-white/[0.06]">
      <div className="max-w-screen-2xl mx-auto">

        <div className="mb-16" data-aos="fade-up" data-aos-duration="600">
          <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-3">
            The SRK University
          </p>
          <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            Three reasons to start today
          </h2>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="80"
        >
          {cards.map((card) => (
            <div key={card.num} className="relative pt-6">

              {/* Number badge — centered on the card's top border */}
              <div className="group/badge absolute top-0 left-1/2 -translate-x-1/2 z-10 w-12 h-12 flex items-center justify-center border border-white/[0.14] hover:border-primary/40 bg-[#0a0a0a] hover:bg-primary/[0.06] transition-all duration-300 cursor-default">
                <span className="font-mono text-sm font-semibold text-white/50 group-hover/badge:text-primary/80 leading-none transition-colors duration-300">
                  {card.num}
                </span>
              </div>

              {/* Card */}
              <div className="group border border-white/[0.08] hover:border-primary/30 bg-[#0a0a0a] hover:bg-primary/[0.02] transition-all duration-300 flex flex-col">

                <div className="aspect-video overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="flex flex-col items-center gap-3 px-7 pt-7 pb-9 text-center">
                  <h3 className="text-sm font-semibold text-white/90 tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {card.body}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 mt-14">
          <AnimationButton
            onClick={() => navigate(`/auth/sign-up?packageId=${proPackageId}`)}
          />
          <p className="text-xs text-white/30 tracking-widest uppercase mt-1">Enroll now</p>
        </div>

      </div>
    </section>
  );
}
