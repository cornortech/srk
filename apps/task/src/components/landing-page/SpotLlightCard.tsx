import { useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  className = "", 
  delay = 0, 
  hoverable = true 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !hoverable) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  }, [hoverable]);

  const handleMouseLeave = useCallback(() => {
    if (!hoverable) return;
    setMousePosition({ x: 0, y: 0 });
  }, [hoverable]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className={`group relative rounded-3xl backdrop-blur-xl border bg-gradient-to-br from-white/5 to-transparent transition-all duration-500 ${hoverable ? 'hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(182,137,56,0.15)]' : ''} ${className}`}
      style={{
        background: 'rgba(26, 20, 16, 0.4)',
        borderColor: 'rgba(182, 137, 56, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(225, 186, 115, 0.1), transparent 40%)`,
        }}
      />

      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#e1ba73]/0 via-[#e1ba73]/10 to-[#b68938]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>

      <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-[#e1ba73]/20 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-[#b68938]/20 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-[#e1ba73]/20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-[#b68938]/20 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};