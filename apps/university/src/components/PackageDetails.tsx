import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { PrimaryButton } from "./ReusableComponents";
import { Check } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { getPackageDetailsApi } from "../lib/apiClient";
// import { TPackage } from "../lib/types/entities";
import { IPackage, packages } from "../Data/Packages";
import clsx from "clsx";
export const PackageDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const data: IPackage | undefined = packages.find((pkg) => pkg.id === id);
  // const { data } = useQuery<TPackage | null>({
  //   queryKey: ["packages", id],
  //   queryFn: async () => {
  //     if (!id) return null;
  //     const data = await getPackageDetailsApi(id);
  //     return data;
  //   },
  // });

  if (!data) return;

  return (
    <div className="w-ful h-screen flex items-center justify-center bg-[url('/srklaptop.jpg')] bg-center bg-cover bg-no-repeat">
      <Card className="w-full md:w-72 bg-bgSecondary filter drop-shadow-[0_2px_6px_#b68938]  text-textPrimary hover:scale-105 duration-500 cursor-pointer mt-24">
        <CardHeader className="flex flex-col items-start px-4 p pt-6 pb-4 space-y-3">
          <h2 className="text-2xl font-bold text-textSecondary">{data.name}</h2>
          <p className="text-3xl font-bold mt-2">{data.price}</p>
          <PrimaryButton
            // label={data?.buttonText as string}
            label="Buy Now"
            radius="md"
            className="w-full"
            onclick={() => {
              navigate(`/auth/sign-up?packageId=${data.id}`);
            }}
          />
        </CardHeader>
        <Divider className="bg-[#ddb66e] opacity-50" />
        <CardBody className="px-4 py-6">
          <ul className="space-y-4">
            <h2>Packages</h2>
            {/* {data.features?.map((feature: string, featureIndex: number) => (
              <li key={featureIndex} className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-primary" />
                <span>{feature}</span>
              </li>
            ))} */}
            {data.features.map((feature, featureIndex) => (
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
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="px-4 pb-6"></CardFooter>
      </Card>
    </div>
  );
};
