import { Button } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { ArrowRight, BookOpen, Users, Award, Layers } from "lucide-react";
import AffiliateTimeline from "./AffilateTimeline";
import { PrimaryButton } from "../../ReusableComponents";
import EarningProjection from "./EarningProjection";
import { Link, useNavigate } from "react-router-dom";

const benefitsData = [
  {
    icon: <BookOpen className="h-12 w-12 text-primary mb-4" />,
    title: "Partner Recognition",
    descripition:
      "Receive referral credits for every student you help discover our courses",
  },
  {
    icon: <Users className="h-12 w-12 text-primary mb-4" />,
    title: "Instant Access",
    descripition:
      "Get immediate access to sharing tools and your personal referral dashboard",
  },
  {
    icon: <Award className="h-12 w-12 text-primary mb-4" />,
    title: "Milestone Rewards",
    descripition:
      "Unlock special recognition and rewards as you help more students enrol",
  },
  {
    icon: <Layers className="h-12 w-12 text-primary mb-4" />,
    title: "Credit Processing",
    descripition: "Credits reviewed and processed within 14 days",
  },
];

export default function AffiliateProgram({ viewMode }: { viewMode: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen max-w-custom mx-auto  bg-bgPrimary text-gray-400 space-y-8">
      {/* Hero Section */}
      <div className="w-full px-4 space-y-12">
        <div className="text-center w-full space-y-4 ">
          <p>Grow Together</p>
          <h1 className="text-4xl font-bold text-white mb-6">
            Partner <span className="text-primary">Programme</span>
          </h1>
          <p className="text-sm ">
            Welcome to THE SRK UNIVERSITY's Partner Programme. Our partners
            choose us because they genuinely believe in the quality of our
            courses and the value of the knowledge we deliver. If you want to
            recommend courses that help your colleagues, classmates, or friends
            build practical, up-to-date skills in multimedia and creative
            disciplines, join our partner programme today.
          </p>
        </div>
        <div className="w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsData.map((benefit) => (
              <Card className="bg-bgSecondary border-gray-800 p-6">
                {benefit.icon}
                <h3 className="text-xl font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p>{benefit.descripition}</p>
              </Card>
            ))}
          </div>
        </div>
        {viewMode && (
          <div className="w-full flex items-center justify-center  ">
            <PrimaryButton
              label="Become a Partner"
              radius="lg"
              onclick={() => {
                navigate("/study/affiliate-activation");
              }}
            />
          </div>
        )}
      </div>

      {/* Timeline Section */}

      <AffiliateTimeline />

      <EarningProjection />

      {/* CTA Section */}
      {viewMode && (
        <div className="w-full  px-4 py-16">
          <div className="bg-bgPrimary rounded-lg p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Support Your Community?
            </h2>
            <p className="text-xl mb-8">
              Join our partner programme and help fellow learners discover
              high-quality creative education
            </p>
            <Link to={"/study/affiliate-activation"}>
              <Button className="px-10 font-semibold text-black bg-custom-gradient  py-6 rounded hover:bg-red-700 hover:animate-[shake_0.5s_ease-in-out] text-lg">
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className="px-4 w-full">
        <Link to="/affiliate-terms" className="cursor-pointer">
          Read :{" "}
          <span className="text-primary">Partner Programme Terms and Conditions</span>
        </Link>
      </div>
    </div>
  );
}
