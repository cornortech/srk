import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Instagram, Twitter, Music2, CheckCircle } from 'lucide-react';
import { SocialPlatform } from '../types/types';

interface SocialPlatformCardProps {
  platform: SocialPlatform;
  selected: boolean;
  onClick: () => void;
}

const getPlatformIcon = (platform: SocialPlatform): React.ReactNode => {
  switch (platform) {
    case 'youtube': return <Youtube className="w-8 h-8" />;
    case 'facebook': return <Facebook className="w-8 h-8" />;
    case 'instagram': return <Instagram className="w-8 h-8" />;
    case 'twitter': return <Twitter className="w-8 h-8" />;
    case 'tiktok': return <Music2 className="w-8 h-8" />;
    default: return <Youtube className="w-8 h-8" />;
  }
};

const SocialPlatformCard: React.FC<SocialPlatformCardProps> = ({ 
  platform, 
  selected, 
  onClick 
}) => {
  const color = {
    youtube: '#FF0000',
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    tiktok: '#000000'
  }[platform];

  return (
    <motion.div
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        selected ? 'ring-4 ring-offset-4 ring-offset-[#0a0705] ring-[#b68938]/50 shadow-2xl' : ''
      }`}
      style={{
        background: 'rgba(20, 17, 14, 0.8)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${selected ? color : 'rgba(182, 137, 56, 0.2)'}`,
        boxShadow: selected ? `0 0 30px ${color}40` : '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center border-4"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}40)`,
            borderColor: `${color}30`,
            boxShadow: selected ? `0 0 20px ${color}60` : 'none'
          }}
        >
          {getPlatformIcon(platform)}
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg text-white capitalize">{platform}</h3>
          <p className="text-sm text-gray-400 mt-1">Select this platform</p>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: color }}
          >
            <CheckCircle size={20} className="text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialPlatformCard;