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
