import React from "react";
import { PrimaryButton } from "../ReusableComponents";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Define interfaces
interface Feature {
  text: string;
  highlight: string;
}

interface IWhyChooseUsSection {
  id: number;
  title: string;
  titleHighlight: string;
  image: string;
  imageAlt: string;
  features: Feature[];
  reverse?: boolean;
  icon: React.ReactNode;
}

interface IAccessFeature {
  title: string;
  description: string;
  image: string;
  points: string[];
}

// Generic type constraint
type FeatureType = IAccessFeature | IWhyChooseUsSection;

const TradingSchool: React.FC<{
  feature: FeatureType;
  index: number;
  knowMoreRoute?: string;
  knowMoreCaption?: string;
}> = ({ feature, index, knowMoreRoute, knowMoreCaption }) => {
  // Safely extract properties
  const title = "title" in feature ? feature.title : "";
  const titleHighlight =
    "titleHighlight" in feature ? feature.titleHighlight : "";
  const description = "description" in feature ? feature.description : "";
  const imageAlt = "imageAlt" in feature ? feature.imageAlt : "Feature Image";

  // Determine points
  const points =
    "points" in feature && feature.points
      ? feature.points
      : "features" in feature
      ? feature.features.map((f) => `${f.text} ${f.highlight}`)
      : [];

  const VITE_PRO_PACKAGE_ID = import.meta.env.VITE_PRO_PACKAGE_ID;
  const navigate = useNavigate()



  return (
    <div
      data-aos="fade-right"
      data-aos-duration="1200"
      className="h-fit bg-black border-l border-r border-b md:border border-primary shadow-md text-white flex items-center justify-center w-[95%] md:w-[80%] mx-auto rounded-[20px] px-4 py-12"
    >
      {/* Main Content */}
      <div
        className={`flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl ${
          index % 2 === 0 ? "md:flex-row-reverse flex-row-reverse" : ""
        }`}
      >
        {/* Left Section: Text and Button */}
        <div className="flex flex-col items-center md:items-start md:w-1/2 space-y-6">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-gray-300 bg-[#121212] rounded-full">
            Education
          </span>
          <h1 className="text-3xl md:text-3xl text-start font-bold leading-tight">
            {title} {titleHighlight}
          </h1>
          {description && (
            <p className="text-lg text-start text-gray-400">{description}</p>
          )}
          <ul className="space-y-2 text-gray-300">
            {points.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-blue-500">✔</span>
                <span className="text-start">{point}</span>
              </li>
            ))}
          </ul>
          <PrimaryButton
            onclick={() => {
              navigate(`/auth/sign-up?packageId=${VITE_PRO_PACKAGE_ID}`);
            }}
            label="Start Learning Now"
            radius="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white md:w-48 w-full py-6 text-lg animate-fade-in"
          />
          {knowMoreRoute && (
            <div className="flex flex-col items-start gap-1 mt-2">
              <Link
                to={knowMoreRoute}
                className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
              >
                Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {knowMoreCaption && (
                <span className="text-[10px] text-white/25 pl-1">{knowMoreCaption}</span>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Image */}
        <div className="md:w-1/2 flex flex-col items-center mt-10 md:mt-0">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Chart-like Background */}
            <div className="absolute rounded-full animate-spin-slow" />
            <img
              src={"/logo/transparentLogo.png"}
              alt={imageAlt}
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSchool;
