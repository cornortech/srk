import { Navbar } from '../../features/landing-page/components/Navbar';
import { Hero } from '../../features/landing-page/components/Hero';
import { StatsBar } from '../../features/landing-page/components/StatsBar';
import { TrustGrid } from '../../features/landing-page/components/TrustGrid';
import { SynergySection } from '../../features/landing-page/components/SynergySection';
import { AvailableEverywhere } from '../../features/landing-page/components/AvailableEverywhere';
import { TrustedByCreators } from '../../features/landing-page/components/TrustedByCreaters';
import { FinalCTA } from '../../features/landing-page/components/FinalCTA';
import { Footer } from '../../features/landing-page/components/Footer';

export const TaskLandingPage = () => {
  return (
    <main className="bg-bgPrimary min-h-screen text-white overflow-x-hidden">

      <Navbar />
      <Hero />
      <StatsBar />
      <TrustGrid />
      <SynergySection />
      <AvailableEverywhere />
      <TrustedByCreators />
      <FinalCTA />
      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
     

        body {
          background-color: #000000;
          color: #ffffff;
          font-family: 'Manrope', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0705;
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #b68938, #e1ba73);
          border-radius: 6px;
          border: 2px solid #0a0705;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #e1ba73, #b68938);
        }
        
        ::selection {
          background: rgba(225, 186, 115, 0.3);
          color: white;
        }
        
        ::-moz-selection {
          background: rgba(225, 186, 115, 0.3);
          color: white;
        }
        
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }
        
        :focus-visible {
          outline: 2px solid #e1ba73;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        img {
          -webkit-user-drag: none;
          user-select: none;
          -webkit-user-select: none;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        h1, h2, h3, h4, h5, h6 {
          text-rendering: optimizeLegibility;
          letter-spacing: -0.02em;
        }
      `,
        }}
      />
    </main>
  );
};
