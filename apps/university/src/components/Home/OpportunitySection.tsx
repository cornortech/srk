import { Button } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OpportunitySection() {
  const features = [
    "Access to 10 professional courses",
    "Course completion certificates",
    "Advanced learning resources",
    "24/7 learner support",
    "Personalized coaching sessions",
    "Expert mentorship",
    "Live learning sessions",
    "Access to SRK VIP learning resources",
  ];
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <div className="relative h-[1020px]  flex flex-col items-center p-4 bg-[url('/team/sidelookDark.webp')] bg-no-repeat  bg-cover bg-center ">
      <div className="absolute inset-0 bg-black bg-opacity-65 z-10"></div>
      <div className="relative z-10 space-y-4 mb-8 text-center">
        <h1 className="text-xl font-semibold text-primary">
          Don't Miss Out –{" "}
        </h1>
        <h2 className="text-2xl font-bold">
          Act Now Before the Opportunity Disappears!
        </h2>
      </div>

      <div
        data-aos="fade-right"
        data-aos-duration="1200"
        className="relative z-10 w-[90%] lg:w-[32rem] flex items-center justify-center bg-bgSecondary  filter drop-shadow-[0_2px_6px_#b68938] text-white border-0 p=12 rounded-2xl mb-10"
      >
        <div className="w-[80%] lg:w-[29rem] py-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight leading-tight">
              MEMBERSHIP INCLUDES
            </h2>
          </div>
          <div className="border mt-8 border-gray-300 border-opacity-75"></div>
          {/* Pricing Section */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="text-xl md:text-2xl text-gray-500 line-through">
              $250
            </span>
            <span className="text-3xl md:text-5xl font-bold text-primary">
              $50
            </span>
          </div>

          {/* Features List */}
          <div className="space-y-1">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-start text-sm md:text-lg gap-3"
              >
                <Check className="h-5 w-5 text-textPrimary" />
                <span className="text-gray-200">{feature}</span>
              </div>
            ))}
          </div>

          <div className="border mt-8 border-gray-400 border-opacity-50"></div>

          {/* Cancel Notice */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-300">
            <X className="h-4 w-4" />
            <span className="text-lg font-bold">Cancel your membership anytime</span>
          </div>

          {/* Monthly Price */}
          <div className="text-center text-primary my-4 font-semibold">
            Continue your membership for $50 per month
          </div>

          <div className="w-full flex flex-col space-y-4">
            <Button
              className="w-full py-6 text-sm text-bgPrimary font-semibold  bg-custom-gradient hover:from-primary hover:to-primary transition-all duration-300"
              onPress={() => {
                navigate(`/auth/sign-up?packageId=${proPackageId}`);
              }}
            >
              Join The SRK University.com
            </Button>
            <span className="text-gray-300 text-center">Enroll Now</span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-semibold text-textPrimary">
          OR DO NOTHING...
        </h1>
        <h4 className="text-md text-textPrimary">
          Go watch Netflix. Work a 9-5.
        </h4>
      </div>
    </div>
  );
}
