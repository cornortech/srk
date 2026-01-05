import { z } from 'zod';

export const createPackageSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  price: z.number(),
  currency: z.string(),
  discountedPrice: z.number(),
  features: z.array(
    z.object({
      text: z.string(),
      included: z.boolean(),
    })
  ),
});

export type TCreatePackageSchema = z.TypeOf<typeof createPackageSchema>;

export const getAllPackagesSchema = z.array(
  z.object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    price: z.number(),
    currency: z.string(),
    features: z.array(
      z.object({
        text: z.string(),
        included: z.boolean(),
      })
    ),
    createdAt: z.date(),
    updatedAt: z.date(),
    discountedPrice: z.number(),
  })
);
export type TGetAllPackagesSchema = z.TypeOf<typeof getAllPackagesSchema>;

export const getPackageByIdSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  price: z.number(),
  currency: z.string(),
  features: z.array(
    z.object({
      text: z.string(),
      included: z.boolean(),
    })
  ),
  discountedPrice: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type TGetPackageByIdSchema = z.TypeOf<typeof getPackageByIdSchema>;

export const growPackageSubTypesSchema = z.object({
  _id: z.string(),
  growSocialMediaPackageTypeId: z.string(),
  name: z.string(),
  description: z.string(),
  noOfLikes: z.number().optional(),
  noOfVideos: z.number().optional(),
  noOfFollowers: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export const srkGrowPackageSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  socialMediaPlatforms: z.array(z.string()),
  features: z.array(z.string()),
  amount: z.number(),
  amountBeforeDiscount: z.number(),
  isPopular: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  packageTypes: z.array(
    z.object({
      _id: z.string(),
      growSocialMediaPackageId: z.string(),
      name: z.string(),
      description: z.string(),
      amount: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
      packageSubTypes: z.array(growPackageSubTypesSchema),
    })
  ),
});

export type TSrkGrowPackagesSchema = z.TypeOf<
  typeof srkGrowPackageSchema
>;


export const getAllSrkGrowPackagesSchema = z.array(srkGrowPackageSchema);

export type TGetAllSrkGrowPackagesSchema = z.TypeOf<
  typeof getAllSrkGrowPackagesSchema
>;

// Create Grow Social Media Package Schema
export const createGrowSocialMediaPackageSchema = z.object({
  name: z.string().min(1, 'Package name is required'),
  description: z.string().min(1, 'Description is required'),
  socialMediaPlatforms: z.array(
    z.enum(['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook'])
  ).min(1, 'At least one platform is required'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  amountBeforeDiscount: z.number().positive('Amount before discount must be positive'),
  amount: z.number().positive('Amount must be positive'),
  isPopular: z.boolean().default(false),
});

export type TCreateGrowSocialMediaPackage = z.infer<typeof createGrowSocialMediaPackageSchema>;

// Create Package Type Schema
export const createGrowPackageTypeSchema = z.object({
  growSocialMediaPackageId: z.string().min(1, 'Package ID is required'),
  name: z.string().min(1, 'Type name is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
});

export type TCreateGrowPackageType = z.infer<typeof createGrowPackageTypeSchema>;

// Create Package SubType Schema
export const createGrowPackageSubTypeSchema = z.object({
  growSocialMediaPackageId: z.string().min(1, 'Package ID is required'),
  growSocialMediaPackageTypeId: z.string().min(1, 'Package Type ID is required'),
  name: z.string().min(1, 'SubType name is required'),
  description: z.string().min(1, 'Description is required'),
  taskType: z.enum(['follow', 'engagement']),
  noOfLikes: z.number().optional(),
  noOfVideos: z.number().optional(),
  noOfFollowers: z.number().optional(),
});

export type TCreateGrowPackageSubType = z.infer<typeof createGrowPackageSubTypeSchema>;

// Update schemas
export const updateGrowSocialMediaPackageSchema = createGrowSocialMediaPackageSchema.partial().extend({
  _id: z.string().min(1, 'Package ID is required'),
});

export type TUpdateGrowSocialMediaPackage = z.infer<typeof updateGrowSocialMediaPackageSchema>;

export const updateGrowPackageTypeSchema = createGrowPackageTypeSchema.partial().extend({
  _id: z.string().min(1, 'Type ID is required'),
});

export type TUpdateGrowPackageType = z.infer<typeof updateGrowPackageTypeSchema>;

export const updateGrowPackageSubTypeSchema = createGrowPackageSubTypeSchema.partial().extend({
  _id: z.string().min(1, 'SubType ID is required'),
});

export type TUpdateGrowPackageSubType = z.infer<typeof updateGrowPackageSubTypeSchema>;

// Delete schemas
export const deletePackageSchema = z.object({
  _id: z.string().min(1, 'Package ID is required'),
});

export type TDeletePackage = z.infer<typeof deletePackageSchema>;
