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
  selectedTypeIndex: number;
  selectedSubTypeIndex: number;
  onSelect: (typeIndex: number, subTypeIndex: number) => void;
  packageData: PackageDetails;
}
export const OptionStep: React.FC<OptionStepProps> = ({
  engagementType,
  selectedTypeIndex,
  selectedSubTypeIndex,
  onSelect,
  packageData,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto space-y-4"
  >
    {packageData.packageTypes?.map((packageType, typeIndex) => (
      <div key={packageType._id}>
        {packageType.packageSubTypes?.map((subType, subTypeIndex) => {
          const relevantField =
            engagementType === 'follow'
              ? subType.noOfFollowers
              : subType.noOfVideos;

          if (!relevantField) return null;

          return (
            <SelectOption
              key={`${typeIndex}-${subTypeIndex}`}
              option={{
                followers:
                  engagementType === 'follow'
                    ? subType.noOfFollowers || 0
                    : subType.noOfVideos || 0,
              }}
              type={engagementType}
              index={subTypeIndex}
              selected={
                selectedTypeIndex === typeIndex &&
                selectedSubTypeIndex === subTypeIndex
              }
              onClick={() => onSelect(typeIndex, subTypeIndex)}
              packageData={packageData}
            />
          );
        })}
      </div>
    ))}
  </motion.div>
);
