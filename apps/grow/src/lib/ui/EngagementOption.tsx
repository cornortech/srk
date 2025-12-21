import React from 'react';
import { motion } from 'framer-motion';
import { Users, Video, CheckCircle } from 'lucide-react';
import { EngagementType, PackageDetails } from '../types/types';
import { formatRupees } from '../utils/formatters';

interface EngagementOptionProps {
  type: EngagementType;
  selected: boolean;
  onClick: () => void;
  packageData: PackageDetails;
}

const EngagementOption: React.FC<EngagementOptionProps> = ({
  type,
  selected,
  onClick,
  packageData,
}) => {
  const isFollow = type === 'follow';
  const borderColor = isFollow
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(59, 130, 246, 0.3)';
  const bgColor = isFollow
    ? 'rgba(16, 185, 129, 0.1)'
    : 'rgba(59, 130, 246, 0.1)';

  return (
    <motion.div
      className={`relative p-8 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${
        selected
          ? 'ring-4 ring-offset-4 ring-offset-[#0a0705] ring-[#b68938]/50 shadow-2xl'
          : ''
      }`}
      style={{
        background: bgColor,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${borderColor}`,
        boxShadow: selected
          ? `0 0 40px ${
              isFollow ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'
            }`
          : 'none',
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isFollow
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/30'
                  : 'bg-blue-500/20 border-2 border-blue-500/30'
              }`}
            >
              {isFollow ? (
                <Users size={24} className="text-emerald-400" />
              ) : (
                <Video size={24} className="text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isFollow ? 'Follow/Subscribe' : 'Reach & Engagement'}
              </h3>
              <p className="text-sm text-gray-400">
                {isFollow
                  ? 'Grow your follower base'
                  : 'Increase post engagement'}
              </p>
            </div>
          </div>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isFollow ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
            >
              <CheckCircle size={16} className="text-white" />
            </motion.div>
          )}
        </div>
        <div className="text-center pt-4 border-t border-white/10">
          <div className="text-2xl font-bold text-[#b68938] mb-1">
            {formatRupees(packageData.amount)}
          </div>
          <p className="text-sm text-gray-400">{packageData.name} Package</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EngagementOption;
