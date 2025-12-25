import React from 'react';
import { motion } from 'framer-motion';
import { Users, Video } from 'lucide-react';
import { PackageDetails } from '../types/types';
import { formatRupees } from '../utils/formatters';

interface SelectionOptionProps {
  option: { videos?: number; likesPerVideo?: number; followers?: number };
  type: 'follow' | 'reach';
  index: number;
  selected: boolean;
  onClick: () => void;
  packageData: PackageDetails;
}

const SelectOption: React.FC<SelectionOptionProps> = ({
  option,
  type,
  selected,
  onClick,
  packageData,
}) => {
  const isFollow = type === 'follow';
  const borderColor = selected
    ? isFollow
      ? 'rgba(16, 185, 129, 0.4)'
      : 'rgba(59, 130, 246, 0.4)'
    : 'rgba(182, 137, 56, 0.2)';
  const bgColor = selected
    ? isFollow
      ? 'rgba(16, 185, 129, 0.15)'
      : 'rgba(59, 130, 246, 0.15)'
    : 'rgba(255, 255, 255, 0.03)';

  return (
    <motion.div
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 ${
        selected ? 'ring-2 ring-[#b68938]/50 shadow-xl' : 'hover:bg-white/5'
      }`}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        backdropFilter: 'blur(10px)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isFollow
                ? 'bg-emerald-500/20 border-2 border-emerald-500/30'
                : 'bg-blue-500/20 border-2 border-blue-500/30'
            }`}
          >
            {isFollow ? (
              <Users size={20} className="text-emerald-400" />
            ) : (
              <Video size={20} className="text-blue-400" />
            )}
          </div>
          <div>
            {isFollow ? (
              <div>
                <h4 className="text-lg font-bold text-white">
                  {option.followers} Followers
                </h4>
                <p className="text-sm text-gray-400">
                  One-time growth for your profile
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold text-white">
                  {option.videos} Video
                  {option.videos && option.videos > 1 ? 's' : ''}
                </h4>
                <p className="text-sm text-gray-400">
                  {option.likesPerVideo} likes per video • Total:{' '}
                  {(option.videos || 0) * (option.likesPerVideo || 0)} likes
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-xl font-bold ${
              isFollow ? 'text-emerald-400' : 'text-blue-400'
            }`}
          >
            {formatRupees(packageData.amount)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectOption;
