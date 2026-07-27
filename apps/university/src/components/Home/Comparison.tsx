import { Card, Button, CardBody } from "@nextui-org/react";
import { Ban, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function ComparisonSection() {
  const navigate = useNavigate();
  const  VITE_PRO_PACKAGE_ID = import.meta.env.VITE_PRO_PACKAGE_ID

  return (
    <>
      <section className="bg-bgSecondary  flex flex-col items-center justify-center p-8 ">
        <div className="max-w-7xl">
          <h2 className="text-3xl md:text-3xl font-bold text-center mb-12 text-white">
            A SMARTER WAY TO LEARN
          </h2>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-36 md:gap-8 relative">
              {/* Left Card */}
              <Card
                className="bg-[#111111] border-[#C4A24C] border p-8"
                radius="sm"
              >
                <CardBody className="text-center space-y-6">
                  <p className="text-[#C4A24C] text-xl">TRADITIONAL EDUCATION</p>
                  <h2 className="text-5xl md:text-6xl font-bold text-white">
                    $15,000+
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Many degree programs require a significant financial
                    investment and several years of study before you can
                    apply your knowledge in the real world.
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
                  <p className="text-white/90 text-xl">PRACTICAL ONLINE LEARNING</p>
                  <h2 className="text-5xl md:text-6xl font-bold text-white">
                    Starting from $100
                  </h2>
                  <p className="text-black text-lg leading-relaxed">
                    Gain instant access to industry-based courses designed to
                    help you develop desirable skills with hands-on lessons
                    and scenarios. Do things at your own speed; apply
                    learning as soon as possible.
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

        <div className="flex flex-col items-center gap-1.5 mt-10">
          <Link
            to="/learn/why-srk-university"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
          >
            Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11px] text-white/25">see how we deliver real value</span>
        </div>
      </section>
    </>
  );
}
