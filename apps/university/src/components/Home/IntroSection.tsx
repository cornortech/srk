import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../ReusableComponents';
import {
  claimPersistentHero,
  releasePersistentHero,
} from '../../lib/persistentHero';

const HERO_HEIGHT_CLASSES = 'h-[500px] sm:h-[600px] md:h-[700px] xl:h-[90vh]';

export const IntroSection = () => {
  const navigate = useNavigate();
  const [usingPersistent] = useState(claimPersistentHero);

  useEffect(() => {
    if (!usingPersistent) return;
    return () => releasePersistentHero();
  }, [usingPersistent]);

  if (usingPersistent) {
    return <div className={HERO_HEIGHT_CLASSES} />;
  }

  return (
    <section className={`relative ${HERO_HEIGHT_CLASSES} overflow-hidden`}>
      {/* Background Image: Keep its existing animation */}
      <img
        src="/team/landingImage1-1080.webp"
        alt="Landing Image"
        className="absolute inset-0 w-full h-full object-cover animate-zoom-in"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Stationary Text Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-start justify-center h-full text-left">
        <h1 className="text-white text-sm font-semibold mb-2 tracking-widest">
          Welcome to The SRK University
        </h1>

        <h2 className="text-white text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-bold mb-4">
          PRACTICAL LEARNING FOR FUTURE SUCCESS
        </h2>

        <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg">
          Develop important skills with flexible online courses and guidance
          from experts. The SRK University assists you with the development of
          knowledge, its application, and preparation for academic, career, and
          business success.
        </p>

        <PrimaryButton
          label="Enroll Now"
          radius="none"
          className="bg-yellow-600 hover:bg-yellow-700 text-white w-48 py-3 text-lg"
          onclick={() => {
            navigate(
              `/auth/sign-up?packageId=${import.meta.env.VITE_PRO_PACKAGE_ID}`
            );
          }}
        />

        <p className="text-gray-400 text-sm mt-4">
          Begin learning today and invest in your future.
        </p>
      </div>
    </section>
  );
};
