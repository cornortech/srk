import { Check } from "lucide-react";
import { AnimationButton } from "../ReusableComponents";
import { useNavigate } from "react-router-dom";
import { accessFeatures } from "../../Data/AccessFeatures";
import { getUniversityAssetUrl } from "../../lib/cdn";



export default function YouWillGetAccess() {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <div className="h-full  text-white  bg-[#1E2025] py-6">
      <div className=" p-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-24">
          YOU WILL GET ACCESS TO
        </h2>

        <div className="space-y-14">
          {accessFeatures.map((feature, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="space-y-6">
                <h2 className="text-left text-2xl md:text-3xl font-bold tracking-wide">
                  {feature.title}
                </h2>
                <p className="text-left text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                {feature.points.length > 0 && (
                  <ul className="space-y-3">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`${index % 2 === 1 ? "md:order-first" : ""}`}>
                <video preload="auto" autoPlay loop muted>
                  <source src={getUniversityAssetUrl(feature.image)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimationButton
        onClick={() => {
          navigate(`/auth/sign-up?packageId=${proPackageId}`);
        }}
      />
      <p className="mt-2 text-gray-300">Enroll Now</p>
    </div>
  );
}
