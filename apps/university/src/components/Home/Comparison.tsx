import { Card, Button, CardBody } from "@nextui-org/react";
import { Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ComparisonSection() {
  const navigate = useNavigate();
  const  VITE_PRO_PACKAGE_ID = import.meta.env.VITE_PRO_PACKAGE_ID

  return (
    <>
      <section className="bg-bgSecondary  flex flex-col items-center justify-center p-8 ">
        <div className="max-w-7xl">
          <h2 className="text-3xl md:text-3xl font-bold text-center mb-12 text-white">
            TWO PATHS, ONE CHOICE
          </h2>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-36 md:gap-8 relative">
              {/* Left Card */}
              <Card
                className="bg-[#111111] border-[#C4A24C] border p-8"
                radius="sm"
              >
                <CardBody className="text-center space-y-6">
                  <p className="text-[#C4A24C] text-xl">PAY</p>
                  <h2 className="text-5xl md:text-6xl font-bold text-white">
                    $15,000+
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Invest years and thousands on a traditional degree, only to
                    find yourself among countless others with similar
                    qualifications.
                  </p>
                  <Button
                    className="w-full bg-transparent border border-[#C4A24C] cursor-default text-[#C4A24C] py-4"
                    endContent={<Ban className="w-5 h-5" />}
                  >
                    STICK TO THE SAME RESULT
                  </Button>
                </CardBody>
              </Card>

              {/* VS Circle */}
              <div className="absolute left-1/2 top-[48%] md:top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex md:block">
                <div className="w-16 h-16 rounded-full bg-black border-2 border-[#C4A24C] flex items-center justify-center">
                  <span className="text-[#C4A24C] font-bold text-xl">VS</span>
                </div>
              </div>

              {/* Right Card */}
              <Card className="bg-custom-gradient p-8" radius="sm">
                <CardBody className="text-center space-y-6">
                  <p className="text-white/90 text-xl">PAY</p>
                  <h2 className="text-5xl md:text-6xl font-bold text-white">
                    $100
                  </h2>
                  <p className="text-black text-lg leading-relaxed">
                    Gain instant access to cutting-edge online strategies that
                    are working right now. Equip yourself with the latest
                    actionable insights and real-world tactics to accelerate
                    your growth.
                  </p>
                  <Button
                    className="w-full bg-bgSecondary hover:bg-gray-900 text-[#C4A24C] py-4 font-semibold"
                    onPress={() => {
                      navigate(`/auth/sign-up?packageId=${VITE_PRO_PACKAGE_ID}`);
                    }}
                  >
                    Give me my Enrollment now
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
