import { Check, X } from "lucide-react";
import { AnimationButton } from "../ReusableComponents";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllPackagesApi } from "../../lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { TPackage } from "../../lib/types/entities";
import clsx from "clsx";

const srkLitePackageId = "67d2e42d2033036da8f85204";

export const Package = ({ packages }: { packages: TPackage[] }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {packages?.map((pkg, index) => (
        <div
          key={index}
          className="group relative flex flex-col rounded-2xl overflow-hidden
                     bg-[#0d0d0d] border border-white/[0.07]
                     hover:border-primary/35
                     hover:shadow-[0_4px_36px_rgba(182,137,56,0.1)]
                     transition-all duration-400"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay={`${index * 80}`}
        >
          {/* Top shimmer */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

          {/* Header */}
          <div className="px-6 pt-7 pb-5 flex flex-col gap-3 border-b border-white/[0.05]">
            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
              {pkg.title}
            </span>
            <p className="text-2xl font-black text-white leading-none">
              Rs.{pkg.price}
              <span className="text-white/30 text-sm font-normal">/Month</span>
            </p>
            <button
              onClick={() => navigate(`/packages/${pkg._id}`)}
              className="w-full py-2.5 rounded-xl bg-custom-gradient text-black text-sm font-bold
                         hover:opacity-90 hover:scale-[1.02] transition-all duration-300
                         shadow-[0_2px_12px_rgba(182,137,56,0.25)]"
            >
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="px-6 py-5 flex flex-col gap-2.5 flex-1">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
              Includes
            </p>
            {pkg.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-start gap-2.5">
                {feature.included ? (
                  <Check className="w-3.5 h-3.5 text-primary/70 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-white/15 mt-0.5 flex-shrink-0" />
                )}
                <span
                  className={clsx(
                    "text-[12px] leading-snug text-left",
                    feature.included ? "text-white/55" : "text-white/20 line-through"
                  )}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom hover bar */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export function PackageSection() {
  let { data: packages } = useQuery<TPackage[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const data = await getAllPackagesApi();
      return data;
    },
  });
  const navigate = useNavigate();

  if (!packages) return null;

  packages = packages.filter((p) => p._id !== srkLitePackageId);

  return (
    <section className="relative bg-black py-20 px-4 overflow-hidden">

      {/* Top double-line separator */}
      <div className="absolute top-0 inset-x-0 pointer-events-none flex flex-col gap-[3px]">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>

      {/* Bottom double-line separator */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none flex flex-col gap-[3px]">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>

      {/* Faint ambient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_30%_at_50%_0%,rgba(182,137,56,0.06),transparent)]" />

      <div className="relative max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
          <p className="text-primary text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Plans & Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            CHOOSE YOUR LEARNING JOURNEY
          </h2>
          <p className="text-white/30 text-sm mt-3 max-w-sm mx-auto">
            Every plan is designed to match a different stage of your learning path.
          </p>
        </div>

        {/* Cards */}
        <Package packages={packages} />

        {/* Tag lines */}
        <div className="text-center mt-8 flex flex-col gap-1">
          <p className="text-white/30 text-sm">Unlock Your Potential with TheSrkUniversity</p>
          <p className="text-primary/60 text-xs italic">"Elevate Your Skills, Illuminate Your Future"</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <AnimationButton
            onClick={() => navigate(`/auth/sign-up?packageId=${packages![0]._id}`)}
          />
          <p className="text-white/25 text-xs mt-1 tracking-widest uppercase">Enroll Now</p>
        </div>

        {/* Know More */}
        <div className="flex flex-col items-center gap-1.5 mt-8 pt-6 border-t border-white/[0.05]">
          <Link
            to="/learn/choose-your-plan"
            className="group inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
          >
            Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11px] text-white/25">see what's included in each plan</span>
        </div>

      </div>
    </section>
  );
}
