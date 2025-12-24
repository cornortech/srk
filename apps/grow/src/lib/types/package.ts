export interface packageSubTypes {
  _id: string;
  growSocialMediaPackageTypeId: string;
  name: string;
  description: string;
  noOfLikes?: number;
  noOfVideos?: number;
  noOfFollowers?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface packageTypes {
  _id: string;
  growSocialMediaPackageId: string;
  name: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  packageSubTypes: packageSubTypes[];
}

export interface PackageDataTypes {
  _id: string;
  name: string;
  description: string;
  socialMediaPlatforms: string[];
  features: string[];
  amount: number;
  amountBeforeDiscount: number;
  variant?: 'blue' | 'violet' | 'gold';
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
  packageTypes: packageTypes[];
}
