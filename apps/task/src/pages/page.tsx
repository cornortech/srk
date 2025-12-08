import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing-page/Navbar';
import { Hero } from '../components/landing-page/Hero';
import { StatsBar } from '../components/landing-page/StatusBar';
import { TrustGrid } from '../components/landing-page/TrustGrid';
import { SynergySection } from '../components/landing-page/SynergySection';
import { AvailableEverywhere } from '../components/landing-page/AvailableEverywhere';
import { TrustedByCreators } from '../components/landing-page/TrustedByCreaters';
import { FinalCTA } from '../components/landing-page/FinalCTA';
import { Footer } from '../components/landing-page/Footer';

export const TaskLandingPage = () => {
  const [, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <div 
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} 
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 blur-[128px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-[#b68938]/10 to-[#e1ba73]/10 blur-[128px] rounded-full"
        />
      </div>

      <Navbar />
      <Hero />
      <StatsBar />
      <TrustGrid />
      <SynergySection />
      <AvailableEverywhere />
      <TrustedByCreators />
      <FinalCTA />
      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
    </main>
  );
};