import { useNavigate } from "react-router-dom";
import { AnimationButton } from "../ReusableComponents";

const stats = [
  { value: "100K+", label: "Students enrolled" },
  { value: "10+", label: "In-demand skills" },
  { value: "Daily", label: "Live sessions" },
];

export default function CommitmentSection() {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <section className="bg-black py-24 px-6 sm:px-10 border-t border-white/[0.06]">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        <div className="flex flex-col gap-10" data-aos="fade-up" data-aos-duration="600">

          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60">
              Ask yourself
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
              Are you prepared<br />
              to <span className="text-primary">grow?</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 text-sm leading-relaxed text-white/50 max-w-lg">
            <p>
              <span className="text-white/80 font-medium">Learning is a skill.</span>{" "}
              Like every other skill it can be mastered — the speed depends on
              the effort you put in, your mentors, and the environment you learn in.
            </p>
            <p>
              <span className="text-white/80 font-medium">Our mentors practice what they teach.</span>{" "}
              They know what it takes to succeed and are the first to identify
              and apply new strategies as they emerge.
            </p>
            <p>
              There is no better place on the planet to{" "}
              <span className="text-white/80 font-medium">
                develop the skills that matter today.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
            {stats.map((s) => (
              <div key={s.value} className="bg-black px-5 py-5 flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white tracking-tight">{s.value}</span>
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2">
            <AnimationButton
              onClick={() => navigate(`/auth/sign-up?packageId=${proPackageId}`)}
            />
            <p className="text-xs text-white/30 tracking-widest uppercase mt-1">Enroll now</p>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="120"
        >
          <div className="aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-lg border border-white/[0.08]">
            <img
              src="/team/landingImage2.jpg"
              alt="Learning environment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
