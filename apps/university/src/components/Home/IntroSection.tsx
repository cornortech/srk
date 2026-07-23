import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../ReusableComponents";

export const IntroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] xl:h-[90vh] overflow-hidden ">
      {/* Background Image */}
      <img
        src="/team/landingImage1-1920.webp"
        srcSet="/team/landingImage1-640.webp 640w, /team/landingImage1-1080.webp 1080w, /team/landingImage1-1920.webp 1920w"
        sizes="100vw"
        alt="Landing Image"
        className="absolute inset-0 w-full h-full object-cover animate-zoom-in"
        loading="eager"
        fetchPriority="high"
        decoding="sync"
      />

      {/* Overlay to Darken Background Slightly */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Blurred Yellow Light Effect Centered Vertically on the Right */}
      <div className="absolute bg-yellow-500 blur-[300px] w-[400px] h-[400px] right-[-200px] top-1/2 -translate-y-1/2 rotate-45"></div>

      {/* Gradient Overlay: Dark on the Left, Bright Golden on the Right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/25 to-black/25 opacity-60 pointer-events-none"></div>

      {/* Content Aligned to the Left */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-start justify-center h-full text-left">
        {/* Subheading */}
        <h1 className="text-white text-sm font-semibold mb-2 tracking-widest animate-fade-in">
          Welcome to The SRK University
        </h1>

        {/* Main Heading */}
        <h2 className="text-white text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-bold mb-4 animate-fade-in">
          THE REVOLUTION OF ENTREPRENEURSHIP
        </h2>

        {/* Subheading */}
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold mb-6 animate-fade-in">
          UNLOCK THE TOOLS TO MASTERY & CONFIDENCE
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg animate-fade-in">
          The SRK University empowers entrepreneurs with hands-on guidance,
          expert-led training, and a thriving community—all in one place.
        </p>

        {/* Call to Action Button */}
        <PrimaryButton
          label="Get Started Now"
          radius="none"
          className="bg-yellow-600 hover:bg-yellow-700 text-white w-48 py-3 text-lg animate-fade-in"
          onclick={() => {
            navigate(
              `/auth/sign-up?packageId=${import.meta.env.VITE_PRO_PACKAGE_ID}`
            );
          }}
        />

        {/* Subtext for the Button */}
        <p className="text-gray-400 text-sm mt-4 animate-fade-in">
          Secure your access today and start your journey.
        </p>
      </div>
    </section>
  );
};
