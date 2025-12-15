import React from 'react';
import { motion } from 'framer-motion';
import {
  SocialPlatform,
  EngagementType,
  PackageDetails,
} from '../../../../lib/types/types';
import SocialPlatformCard from '../../../../lib/ui/SocialPlatformCard';
import EngagementOption from '../../../../lib/ui/EngagementOption';
import SelectOption from '../../../../lib/ui/SelectOption';

interface PlatformStepProps {
  platforms: SocialPlatform[];
  selected: SocialPlatform | null;
  onSelect: (p: SocialPlatform) => void;
}
export const PlatformStep: React.FC<PlatformStepProps> = ({
  platforms,
  selected,
  onSelect,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
  >
    {platforms.map((platform) => (
      <SocialPlatformCard
        key={platform}
        platform={platform}
        selected={selected === platform}
        onClick={() => onSelect(platform)}
      />
    ))}
  </motion.div>
);

interface EngagementStepProps {
  selected: EngagementType | null;
  onSelect: (t: EngagementType) => void;
  packageData: PackageDetails;
}
export const EngagementStep: React.FC<EngagementStepProps> = ({
  selected,
  onSelect,
  packageData,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
  >
    <EngagementOption
      type="follow"
      selected={selected === 'follow'}
      onClick={() => onSelect('follow')}
      packageData={packageData}
    />
    <EngagementOption
      type="reach"
      selected={selected === 'reach'}
      onClick={() => onSelect('reach')}
      packageData={packageData}
    />
  </motion.div>
);

interface OptionStepProps {
  engagementType: EngagementType;
  selectedOption: number;
  onSelect: (i: number) => void;
  packageData: PackageDetails;
}
export const OptionStep: React.FC<OptionStepProps> = ({
  engagementType,
  selectedOption,
  onSelect,
  packageData,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto space-y-4"
  >
    {engagementType === 'follow'
      ? packageData.followerOptions.map((f, i) => (
          <SelectOption
            key={i}
            option={{ followers: f }}
            type="follow"
            index={i}
            selected={selectedOption === i}
            onClick={() => onSelect(i)}
            packageData={packageData}
          />
        ))
      : packageData.reachOptions.map((o, i) => (
          <SelectOption
            key={i}
            option={o}
            type="reach"
            index={i}
            selected={selectedOption === i}
            onClick={() => onSelect(i)}
            packageData={packageData}
          />
        ))}
  </motion.div>
);
