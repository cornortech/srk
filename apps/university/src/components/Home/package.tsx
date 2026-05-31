import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { Check, ArrowRight } from "lucide-react";
import { AnimationButton, PrimaryButton } from "../ReusableComponents";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getAllPackagesApi } from "../../lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { TPackage } from "../../lib/types/entities";

export const Package = ({ packages }: { packages: TPackage[] }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-16 justify-center items-stretch p-8"
      data-aos="zoom-in"
      data-aos-easing="linear"
      data-aos-duration="600"
    >
      {packages &&
        packages.length > 1 &&
        packages?.map((pkg, index) => (
          <Card
            key={index}
            className="w-full md:w-80 bg-bgSecondary filter drop-shadow-[0_2px_6px_#b68938]  text-textPrimary hover:scale-105 duration-500 cursor-pointer"
            // style={{
            //   boxShadow:
            //     "0 0 0 1px #ddb66e, 0 4px 6px -1px rgba(221, 182, 110, 0.1), 0 2px 4px -1px rgba(221, 182, 110, 0.06)",

            // }}
          >
            <CardHeader className="flex flex-col items-start px-4 p pt-6 pb-4 space-y-3">
              <h2 className="text-2xl font-bold text-textSecondary">
                {pkg.title}
              </h2>
              <p className="text-3xl font-bold mt-2">Rs.{pkg.price}/Month</p>
              <PrimaryButton
                // label={pkg.buttonText}
                label="Buy Now"
                radius="md"
                className="w-full"
                onclick={() => {
                  navigate(`/packages/${pkg._id}`);
                }}
              />
            </CardHeader>
            <Divider className="bg-[#ddb66e] opacity-50" />
            <CardBody className="px-4 py-6">
              <ul className="space-y-3">
                <h2>Packages</h2>
                {/* {pkg.features?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 mr-2 text-primary" />

                    <span>{feature}</span>
                  </li>
                ))} */}
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-5 h-5 mr-2 text-primary" />
                    ) : (
                      <span className="w-5 h-5 mr-2" />
                    )}
                    <span
                      className={clsx(
                        feature.included ? "" : "text-red-400 line-through",
                        "text-sm"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter className="px-4 pb-6"></CardFooter>
          </Card>
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

  if (!packages) {
    return <></>;
  }

  const srkLitePackageId = "67d2e42d2033036da8f85204";
  // remove the first package

  if (packages) {
    console.log("Filtered packages:", packages);
    packages = packages?.filter((p) => p._id !== srkLitePackageId);
  }

  return (
    <>
      <div className="w-full bg-bgSecondary pb-6  py-4">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-extrabold text-[#ffffff] mb-4">
              Choose Your Learning Journey
            </h2>
            <Package packages={packages} />
            <p className="mt-2 text-xl text-[#ddb66e]">
              Unlock Your Potential with TheSrkUniversity
            </p>
            <p className="mt-2 text-lg text-[#ddb66e]">
              "Elevate Your Skills, Illuminate Your Future"
            </p>
          </div>
        </div>
        <div>
          <AnimationButton
            onClick={() => {
              navigate(`/auth/sign-up?packageId=${packages[0]._id}`);
            }}
          />
          <p className="mt-2 text-gray-300">Enroll Now</p>
        </div>
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
    </>
  );
}
