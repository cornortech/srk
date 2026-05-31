import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimationButton } from "../ReusableComponents";
import { ArrowRight } from "lucide-react";

export const MoneySection = () => {
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`w-full h-full sm:h-[80vh] bg-[url('/dollar.jpg')] bg-cover bg-no-repeat bg-left `}
      >
        <div className="w-full h-full bg-black bg-opacity-75   ">
          <div
            className="flex flex-col items-center justify-center gap-8 text-textPrimary p-4 w-full h-full "
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="1200"
          >
            <h1 className="text-4xl font-semibold ">
              <span className="font-bold ">HERE'S THE BITTER REALITY:</span>{" "}
              TIME IS YOUR ADVERSARY
            </h1>
            <div className="space-y-4 text-lg  lg:w-[40rem]">
              <h2 className="text-gray-300">
                While you fret over financial burdens, visionaries and
                innovators are amassing wealth by the second.
              </h2>
              <h2 className="text-gray-200 font-semibold">
                Opportunities are rare and this could be your final shot at
                grasping one.
              </h2>
              <h2 className="text-gray-300">
                The moment to seize control of your destiny and master the
                ultimate transformative skill is now:
              </h2>
              <h3>The craft of generating experience online. </h3>
              <h4>Embark on your journey today.</h4>
              <AnimationButton
                onClick={() =>
                  navigate(`/auth/sign-up?packageId=${proPackageId}`)
                }
              />
              <div className="flex flex-col items-center gap-1.5 mt-1">
                <Link
                  to="/learn/seize-your-moment"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
                >
                  Get to Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <span className="text-[10px] text-white/25">how skills transform your future</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
