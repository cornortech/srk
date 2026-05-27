import { AnimationButton } from "../ReusableComponents";
import { useNavigate } from "react-router-dom";
import { whyChooseUsData } from "../../Data/WhyChooseUsData";
import TradingSchool from "./Test";

export function WhyChooseSection() {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  const sectionRoutes = [
    "/learn/uncover-essentials",
    "/learn/exclusive-community",
    "/learn/learn-from-experts",
  ];
  const sectionCaptions = [
    "dive into the foundational lessons",
    "explore how the community works",
    "meet the mentors behind the curriculum",
  ];

  return (
    <div className="min-h-screen bg-black gap-y-8 pb-8 flex flex-col text-white relative z-10">
      {whyChooseUsData.map((section, index) => (
        <TradingSchool
          key={section.id}
          feature={section}
          index={index}
          knowMoreRoute={sectionRoutes[index]}
          knowMoreCaption={sectionCaptions[index]}
        />
      ))}
      <AnimationButton
        onClick={() => {
          navigate(`/auth/sign-up?packageId=${proPackageId}`);
        }}
      />
      <p className="mt-2 text-gray-300">Enroll Now</p>
    </div>
  );
}
