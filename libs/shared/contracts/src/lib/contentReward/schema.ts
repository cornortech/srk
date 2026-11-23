import { z } from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../common';

export const CONTENT_PLATFORM_VALUES = [
  'YouTube',
  'Facebook',
  'Instagram',
  'Twitter',
  'TikTok',
] as const;

export const contentPlatformSchema = z.enum(CONTENT_PLATFORM_VALUES);

const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

const contentLinkSchema = z
  .string()
  .trim()
  .url('Enter a valid link')
  .refine((v) => /^https?:\/\//i.test(v), 'Link must start with http:// or https://');

export const submitContentSchema = z.object({
  platform: contentPlatformSchema,
  links: z
    .array(contentLinkSchema)
    .min(1, 'Add at least 1 link')
    .max(3, 'You can add at most 3 links')
    .refine((l) => new Set(l.map((x) => x.toLowerCase())).size === l.length, {
      message: 'Links must be different from each other',
    }),
});

export const contentSubmissionStatusSchema = z.object({
  canUpload: z.boolean(),
  isWindowOpen: z.boolean(),
  hasSubmittedToday: z.boolean(),
  nextOpensAt: z.string(),
  windowLabel: z.string(),
});

export const contentLeaderSchema = z.object({
  _id: z.string(),
  rank: z.number(),
  weekStart: z.string(),
  weekEnd: z.string(),
  userName: z.string(),
  profilePicture: z.string().nullable().optional(),
  platform: contentPlatformSchema,
  links: z.array(z.string()),
  postImage: z.string().nullable().optional(),
  rewardAmount: z.number().optional(),
});

export const contentLeadersSchema = z.array(contentLeaderSchema);

export const contentRewardStatementSchema = z.array(
  z.object({
    _id: z.string(),
    amount: z.number(),
    rank: z.number(),
    weekStart: z.string(),
    weekEnd: z.string(),
    platform: contentPlatformSchema,
    // When the admin confirmed the reward and it reached the user's earnings
    creditedAt: z.string(),
  })
);

export const getContentSubmissionsQuerySchema =
  commonPaginatedQueryParamsSchema.extend({
    from: dateKeySchema.optional(),
    to: dateKeySchema.optional(),
  });

export const adminContentSubmissionSchema = z.object({
  _id: z.string(),
  user: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
  }),
  platform: contentPlatformSchema,
  links: z.array(z.string()),
  submittedAt: z.string(),
  leader: z
    .object({
      rank: z.number(),
      weekStart: z.string(),
      weekEnd: z.string(),
      rewardAmount: z.number().optional(),
    })
    .nullable(),
});

export const paginatedContentSubmissionsSchema =
  commonPaginationResponse.extend({
    data: z.array(adminContentSubmissionSchema),
  });

export const selectContentLeaderSchema = z.object({
  submissionId: z.string(),
  // Only 1st, 2nd and 3rd place are selectable
  rank: z.number().int().min(1).max(3),
  weekStart: dateKeySchema,
  weekEnd: dateKeySchema,
  // Image data URL from the admin form; the upload middleware swaps it for an R2 key
  postImage: z.string().optional(),
  // Credited to the user's earnings; 0/omitted = no payment
  // NRS, at most 500 per leader
  rewardAmount: z.number().min(0).max(500).optional(),
});

export const setContentLeaderImageSchema = z.object({
  // Image data URL from the admin form; the upload middleware swaps it for a stored key
  postImage: z.string().min(1, 'Choose an image'),
});

export const setContentPermissionSchema = z.object({
  canUpload: z.boolean(),
});
