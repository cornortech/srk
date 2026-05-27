import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimationButton } from "../ReusableComponents";
import { ArrowRight } from "lucide-react";

const BonusTimeline = () => {
  const milestones = [
    {
      month: "1st Month",
      title: "You Start Off as an Apprentice...",
      description:
        "In your first month, you'll unlock essential programs and gain access to the community, where you'll receive guidance from experienced coaches and connect with fellow users who are further along in their journey.",
      badge:
        "https://framerusercontent.com/images/plKaBkHMa06dVIe6HWAbN4Pbo.png?scale-down-to=512",
    },
    {
      month: "2nd Month",
      title: "Get Access to the 8-Figure Network",
      description:
        "By month two, you'll gain access to SRK University's exclusive network, with monthly live calls featuring 8- and 9-figure entrepreneurs. Learn directly from those who've mastered the art of wealth-building, and get actionable insights that can help you achieve your goals faster.",
      badge:
        "https://framerusercontent.com/images/YFix4Deko7x1GshIpktU9HpQTqw.png?scale-down-to=512",
    },
    {
      month: "3rd Month",
      title: "Master All Areas of Your Life",
      description:
        "In month three, unlock a bundle of lifestyle programs designed to elevate every aspect of your life—health, relationships, style, and more. Get access to Detox 101 for holistic wellness and The Perfect Fit to upgrade your appearance with expert fashion guidance.",
      badge:
        "https://framerusercontent.com/images/n5kZjDcBi59NvLAWTe6LWsf4WTk.png?scale-down-to=512",
    },
    {
      month: "4th Month",
      title: "Join Monthly Live Calls with SRK University's Expert",
      description:
        "Starting in month four, join monthly live calls with SRK University's expert, where you can ask questions and receive personalized advice. Get your questions answered in real-time and receive mentorship to accelerate your growth. This is one of the program's most valuable features.",
      badge:
        "https://framerusercontent.com/images/YpitNuObeF9iU8BVZHfVm7CPhc.png?scale-down-to=512",
    },
    {
      month: "6th Month",
      title: "Access Exclusives with Leaders of the Nation",
      description:
        "By month six, connect to exclusive channels for interactions with the nation's leading mentors, offering personalized wisdom and strategies from SRK University's finest.",
      badge:
        "https://framerusercontent.com/images/MQeeVeaUyDRbUIGFuyvbZtYSPw.png?scale-down-to=512",
    },
    {
      month: "12th Month",
      title: "Achieve Emperor Status with Exceptional Skills",
      description:
        "In month twelve, attain 'Emperor' status, equipped with hands-on skills honed to perfection, ready to dominate your field with confidence and capability.",
      badge:
        "https://framerusercontent.com/images/GOHVqZW4GaDzczOm3gPf6VkBgs.png?scale-down-to=512",
    },
  ];

  const VITE_PRO_PACKAGE_ID = import.meta.env.VITE_PRO_PACKAGE_ID;

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-black text-white py-12 relative ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm uppercase tracking-wider mb-2">
            Along the Way
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Unlock Exclusive Bonuses...
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            After completing each month inside of SRK University, you unlock
            exclusive bonuses...
          </p>
        </div>

        {/* Milestones Section */}
        <div className="max-w-4xl mx-auto mb-4">
          {milestones.map((milestone, index) => (
            <div
              data-aos="fade-up"
              data-aos-duration="1200"
              key={index}
              className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 border-b border-l border-[#343333] rounded-sm p-6 bg-black/50"
            >
              {/* Badge and Month (for small screens) */}
              <div className="flex items-center justify-between space-x-4 md:space-x-0 w-full md:w-auto ">
                <div className="flex md:hidden flex-col justify-between items-center ">
                  <img
                    src={milestone.badge}
                    alt={`${milestone.month} Badge`}
                    className="w-12 h-12"
                  />
                  <p className="text-gray-400 text-xs text-center mt-1 uppercase">
                    {milestone.month}
                  </p>
                </div>

                {/* Month Number with Opacity */}
                <div className="relative">
                  <div className="text-primary text-5xl md:text-6xl font-bold opacity-80">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col items-start">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {milestone.title}
                </h2>
                <p className="text-gray-400 mt-2 text-sm text-start">
                  {milestone.description}
                </p>
              </div>

              {/* Badge (for larger screens) */}
              <div className="hidden md:flex flex-col items-center">
                <img
                  src={milestone.badge}
                  alt={`${milestone.month} Badge`}
                  className="w-16 h-16"
                />
                <p className="text-gray-400 text-sm text-center mt-2 uppercase">
                  {milestone.month}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Know More button */}
        <div className="flex flex-col items-center gap-1.5 mb-4">
          <Link
            to="/learn/milestone-journey"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
          >
            Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11px] text-white/25">see what you unlock each month</span>
        </div>

        <AnimationButton
          onClick={() => {
            navigate(`/auth/sign-up?packageId=${VITE_PRO_PACKAGE_ID}`);
          }}
        />
        <p className="mt-2 text-gray-300">Enroll Now</p>
      </div>
    </>
  );
};

export default BonusTimeline;
