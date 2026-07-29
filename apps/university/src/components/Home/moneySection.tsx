import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimationButton } from "../AnimationButton";
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
              Build Skills That Create Long-Term Value
            </h1>
            <div className="space-y-4 text-lg  lg:w-[40rem]">
              <h2 className="text-gray-300">
                Learning is a way to grow both personally and
                professionally. At The SRK University, you will gain useful
                knowledge, improve your abilities, and develop your skills,
                all of which will support you in reaching your future goals.
                Each program is tailored to educate you with confidence and
                to apply your education to the places that matter most.
              </h2>
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
