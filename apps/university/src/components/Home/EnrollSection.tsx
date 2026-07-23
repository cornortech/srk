import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimationButton } from "../AnimationButton";
import { ArrowRight } from "lucide-react";

export const EnrollSection = () => {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <section className="py-8 px-4 sm:px-6 h-full flex flex-col gap-12 items-center bg-bgSecondary">
      <section className="w-full">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-snug sm:leading-tight">
            <span className="text-white">ENROLL </span>
            <span className="text-primary">TODAY</span>
            <span className="text-white"> AND BEGIN YOUR NEW JOURNEY </span>
            <span className="text-primary">TOMORROW</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Seize the moment and start creating the life you've always
            envisioned. With The SRK University, you'll acquire the skills,
            guidance, and resources necessary to reshape your future. Whether
            your goal is to increase your earnings, start a new venture, or
            master in-demand skills, your journey begins here.
          </p>
        </div>
      </section>

      <div className="w-full max-w-3xl mx-auto text-center">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8">
            Join our courses today and take the first step towards mastering
            your craft.
          </p>
          <AnimationButton
            onClick={() => navigate(`/auth/sign-up?packageId=${proPackageId}`)}
          />
          <p className="mt-3 text-sm sm:text-base text-gray-300">Enroll Now</p>
          <div className="flex flex-col items-center gap-1.5 mt-5">
            <Link
              to="/learn/why-enroll"
              className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
            >
              Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="text-[11px] text-white/25">learn what's included in your journey</span>
          </div>
        </div>
      </div>
    </section>
  );
};
