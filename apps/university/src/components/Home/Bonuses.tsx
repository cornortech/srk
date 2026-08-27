import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimationButton } from "../AnimationButton";
import { ArrowRight } from "lucide-react";

const BonusTimeline = () => {
  const milestones = [
    {
      month: "1st Month",
      title: "Build a Strong Foundation",
      description:
        "Start with essential learning modules that introduce core concepts, practical skills, and a structured roadmap for success. Join the SRK University community and begin your journey with confidence.",
      badge:
        "https://framerusercontent.com/images/plKaBkHMa06dVIe6HWAbN4Pbo.png?scale-down-to=512",
    },
    {
      month: "2nd Month",
      title: "Learn from Industry Leaders",
      description:
        "Attend live learning sessions, hear from industry experts and learn through engaging conversations and networking.",
      badge:
        "https://framerusercontent.com/images/YFix4Deko7x1GshIpktU9HpQTqw.png?scale-down-to=512",
    },
    {
      month: "3rd Month",
      title: "Advance Your Personal and Professional Growth",
      description:
        "Learn practical workplace and leadership skills. Build better communication, improve productivity, and gain knowledge that supports your career growth.",
      badge:
        "https://framerusercontent.com/images/n5kZjDcBi59NvLAWTe6LWsf4WTk.png?scale-down-to=512",
    },
    {
      month: "4th Month",
      title: "Receive Expert Guidance",
      description:
        "Join live sessions and ask your questions directly. Learn from experienced instructors and receive practical guidance that helps you keep improving.",
      badge:
        "https://framerusercontent.com/images/YpitNuObeF9iU8BVZHfVm7CPhc.png?scale-down-to=512",
    },
    {
      month: "6th Month",
      title: "Expand Your Professional Network",
      description:
        "Make meaningful relationships with mentors, industry professionals and other students, and connect with them to discuss practical solutions for growth.",
      badge:
        "https://framerusercontent.com/images/MQeeVeaUyDRbUIGFuyvbZtYSPw.png?scale-down-to=512",
    },
    {
      month: "12th Month",
      title: "Graduate with Confidence",
      description:
        "Have practical skills and confidence to finish your learning journey. Demonstrate an understanding of what you've learned to a chosen career, business, or future learning objectives.",
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
            Your Learning Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Your Learning Journey at The SRK University
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Build your skills through a structured learning journey. Each
            stage introduces practical lessons, expert guidance, and
            valuable learning resources. Continue learning with live
            sessions, mentorship, and activities that help you apply your
            knowledge with confidence.
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
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
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
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16"
                />
                <p className="text-gray-400 text-sm text-center mt-2 uppercase">
                  {milestone.month}
                </p>
              </div>
            </div>
          ))}
        </div>
        <AnimationButton
          onClick={() => {
            navigate(`/auth/sign-up?packageId=${VITE_PRO_PACKAGE_ID}`);
          }}
        />
        <p className="mt-2 text-gray-300">Enroll Now</p>
        <div className="flex flex-col items-center gap-1.5 mb-4 mt-4">
          <Link
            to="/learn/milestone-journey"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
          >
            Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11px] text-white/25">see what you unlock each month</span>
        </div>
      </div>
    </>
  );
};

export default BonusTimeline;
