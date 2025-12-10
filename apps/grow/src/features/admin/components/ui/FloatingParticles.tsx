import { motion } from 'framer-motion';
import { useMemo } from 'react';

export const FloatingParticles: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x:
          Math.random() *
          (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y:
          Math.random() *
          (typeof window !== 'undefined' ? window.innerHeight : 800),
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-[1px] h-[1px] bg-gradient-to-r from-[#b68938] to-[#e1ba73] rounded-full"
          initial={{ x: particle.x, y: particle.y }}
          animate={{ y: [null, -20, 20, 0], x: [null, 10, -10, 0] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};
