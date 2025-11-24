import { TPackage } from "../../lib/types/entities";

interface SignupComponentProps {
  packageDetails: TPackage;
}

export const SignupContent = ({ packageDetails }: SignupComponentProps) => {
  return (
    <div className=" w-[95%] p-12 space-y-6">
      <h1 className="text-3xl font-medium">
        Pay SRK University
        <div className="bg-white w-full h-[1px]" />
      </h1>

      <div className="space-y-4">
        <h2 className="text-primary text-4xl font-bold w-fit">
          {packageDetails.currency}.{packageDetails.price} / Month
          <div className="bg-white w-full h-[1px]" />
        </h2>
        <div className="border border-gray-800 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* <div className="w-10 h-10 bg-gray-800 rounded-lg"></div> */}
              <div>
                <p className="font-medium">{packageDetails?.title}</p>
                <p className="text-sm text-gray-400">
                  {" "}
                  {packageDetails.currency}.{packageDetails.price} / month
                </p>
              </div>
            </div>
            {/* <p>
              {packageDetails.currency}.{packageDetails.price}
            </p> */}
          </div>
          <div className="border-t border-gray-800 pt-4 flex justify-between">
            <p className="font-medium">Total</p>
            <p>Rs.{packageDetails.price}</p>
          </div>
        </div>
      </div>
      <div>
        <p>
          For any queries, contact in whatsapp -
          <span className="text-primary font-bold">9769223013</span>
        </p>
      </div>
    </div>
  );
};
