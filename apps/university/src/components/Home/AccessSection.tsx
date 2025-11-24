import { Divider } from "@nextui-org/react";
import { accessFeatures } from "../../Data/AccessFeatures";
import { AnimationButton } from "../ReusableComponents";
import TradingSchool from "./Test";

const AccessSection = () => {
  return (
    <>
      <div className="flex flex-col bg-black gap-y-8 relative">
        <Divider className="" />
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h6 className="text-primary text-center font-bold tracking-wider">
            skills and knowledge
          </h6>
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            YOU WILL GET ACCESS TO
          </h2>
        </div>

        {/* <div className="w-96 h-64 rotate-x-[340deg]  rounded-full  bg-primary blur-[100px] absolute top-[-50px] left-[0] right-[0] mx-auto"></div> */}

        {accessFeatures.map((feature, index) => (
          <TradingSchool key={index} feature={feature} index={index} />
        ))}
        <AnimationButton
          onClick={() => {
            // navigate(`/auth/sign-up?packageId=${proPackageId}`);
          }}
        />
        <p className="mt-2 text-gray-300">Enroll Now</p>
      </div>
    </>
  );
};

export default AccessSection;
