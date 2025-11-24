// import { useQuery } from "@tanstack/react-query";
// import { Package } from "../components/Home/package";
// import { getAllPackagesApi } from "../lib/apiClient";
// import { TPackage } from "../lib/types/entities";
// import { packages } from "../Data/Packages";
import { useQuery } from "@tanstack/react-query";
import { Package } from "../components/Home/package";
import { getAllPackagesApi } from "../lib/apiClient";
import { TPackage } from "../lib/types/entities";
import { AnimationButton } from "../components/ReusableComponents";
import { useNavigate } from "react-router-dom";

export const PackagePage = () => {
  let { data: packages } = useQuery<TPackage[] | undefined>({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await getAllPackagesApi();
      return res;
    },
  });
  const navigate = useNavigate();

  if (!packages) {
    return <div></div>;
  }

  const srkLitePackageId = "67d2e42d2033036da8f85204";
  // remove the first package

  if (packages) {
    packages = packages?.filter((p) => p._id !== srkLitePackageId);
  }

  return (
    <main className="w-full h-full bg-bgPrimary text-textPrimary">
      <section className="max-w-[1450px] px-6 mx-auto h-full py-10">
        <h1 className="text-4xl pt-8 pb-6 font-bold text-center text-white mb-12">
          Choose Your Plan
        </h1>
        <Package packages={packages} />
        <div className="flex items-center justify-center flex-col gap-y-2">
          <AnimationButton
            label="Enroll To SRK Lite"
            onClick={() => {
              navigate(`/auth/sign-up?packageId=${srkLitePackageId}`);
            }}
          />
          <p className="mt-2 text-gray-300">Enroll Now To SRK Lite</p>
        </div>
      </section>
    </main>
  );
};
