import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../ReusableComponents";
import { claimPersistentHero, releasePersistentHero } from "../../lib/persistentHero";

const HERO_HEIGHT_CLASSES = "h-[500px] sm:h-[600px] md:h-[700px] xl:h-[90vh]";

export const IntroSection = () => {
  const navigate = useNavigate();
  const [usingPersistent] = useState(claimPersistentHero);

  useEffect(() => {
    if (!usingPersistent) return;
    return () => releasePersistentHero();
  }, [usingPersistent]);

  if (usingPersistent) {
    // The real hero is already visible — static markup living outside
    // #root (see index.html's #persistent-hero). This reserves the same
    // flow space so everything below it lines up correctly.
    return <div className={HERO_HEIGHT_CLASSES} />;
  }

  return (
    <section className={`relative ${HERO_HEIGHT_CLASSES} overflow-hidden`}>
      {/* Background Image */}
      {/* Fixed size, not responsive srcset — see the comment on the
          matching preload link in index.html for why. */}
      <img
        src="/team/landingImage1-1080.webp"
        alt="Landing Image"
        className="absolute inset-0 w-full h-full object-cover animate-zoom-in"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {/* Overlay to Darken Background */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content Aligned to the Left */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-start justify-center h-full text-left">
        {/* Subheading */}
        <h1 className="text-white text-sm font-semibold mb-2 tracking-widest animate-fade-in">
          Welcome to The SRK University
        </h1>

        {/* Main Heading */}
        <h2 className="text-white text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-bold mb-4 animate-fade-in">
          PRACTICAL LEARNING FOR FUTURE SUCCESS
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg animate-fade-in">
          Develop important skills with flexible online courses and guidance
          from experts. The SRK University assists you with the development
          of knowledge, its application, and preparation for academic,
          career, and business success.
        </p>

        {/* Call to Action Button */}
        <PrimaryButton
          label="Enroll Now"
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
          Begin learning today and invest in your future.
        </p>
      </div>
    </section>
  );
};
