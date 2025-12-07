import { z } from 'zod';

export const createBalancePayoutSchema = z.object({
  userId: z.string(),
  amount: z.number(),
});

export type TCreateBalancePayout = z.TypeOf<typeof createBalancePayoutSchema>;

export const getBalancePayoutSchema = z.array(
  z.object({
    _id: z.string(),
    username: z.string(),
    paymentMethod: z.string(),
    status: z.string(),
    userId: z.string(),
    paymentProofUrl: z.string(),
    tdsAmount: z.number(),
    qrUrl: z.string(),
    totalAmount: z.number(),
    transactionNumber: z.string(),
    packageTitle: z.string(),
    amount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export const upsertBankDetailsSchema = z.object({
  accountHolderName: z.string().min(1, 'Account holder name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  ifscCode: z.string().optional(),
  bankName: z.string().min(1, 'Bank name is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  accountType: z.string().min(1, 'Account type is required'),
  relationWithAccount: z.string().min(1, 'Relation is required'),
  qrUrl: z.string().optional(),
});

export const upsertKYCDetailsSchema = z.object({
  frontImage: z.string().min(1, 'Front image is required'),
  backImage: z.string().min(1, 'Back image is required'),
  documentType: z.string().min(1, 'Document type is required'),
  documentNumber: z.string().min(1, 'Document number is required'),
  verificationImage: z.string().min(1, 'Verification image is required'),
});

export const getFinanceDetailsOfUserSchema = z.object({
  todayEarnings: z.number(),
  last7DaysEarnings: z.number(),
  last30DaysEarnings: z.number(),
  allTimeEarnings: z.number(),
  srkBonus: z.number(),
  eventWallet: z.number(),
  walletBalance: z.number(),
  totalTds: z.number(),
  totalWithdraw: z.number(),
  srkBankAmount: z.number(),
  totalBankPayout: z.number(),
  tourBalance: z.number(),
});

export const getEarningLeaderboardSchema = z.array(
  z.object({
    userId: z.string(),
    username: z.string(),
    profilePicture: z.string().nullable().optional(),
    totalEarnings: z.number(),
    country: z.string(),
    position: z.number(),
  })
);

export const getAdminEarningDetailsSchema = z.object({
  ceoSalary: z.number(),
  officeManagementCharge: z.number(),
  companyTurnover: z.number(),
  eventWallet: z.number(),
  tdsAmount: z.number(),
  companyWallet: z.number(),
  totalTurnover: z.number(),
  pendingDistribution: z.number(),
  srkBankAmount: z.number(),
  srkUniversityAmount: z.number().nullable().optional(),
  srkUniversityPendingAmount: z.number().nullable().optional(),
});

export const getBankStatementOfUserSchema = z.array(
  z.object({
    _id: z.string(),
    amount: z.number(),
    username: z.string(),
    profilePicture: z.string().nullable().optional(),
    description: z.string(),
    type: z.string(),
    bankId: z.string(),
    currentAmount: z.number().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export const createBankPayoutRequestSchema = z.object({
  userId: z.string(),
  amount: z.number(),
});

export const getSrkBankDetailsForAdminSchema = z.object({
  amount: z.number(),
  totalPendingPayout: z.number(),
});

export const getBankStatementOfSrkUniversitySchema = z.array(
  z.object({
    _id: z.string(),
    amount: z.number(),
    description: z.string(),
    type: z.string(),
    bankId: z.string(),
    currentAmount: z.number().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export const getSrkBonusCashFlowSchema = z.object({
  _id: z.string(),
  purpose: z.string(),
  username: z.string(),
  package: z.string(),
  registeredUser: z.string(),
  bonusAmount: z.number(),
  createdAt: z.date(),
});

export type TGetSrkBonusCashFlow = z.infer<typeof getSrkBonusCashFlowSchema>;

export const getSrkBonusCashFlowForAdminSchema = z.object({
  _id: z.string(),
  storeName: z.string(),
  purpose: z.string(),
  email: z.string(),
  noOfSrkBonus: z.number(),
  totalSrkBonus: z.number(),
  registeredAt: z.date(),
});

export type TGetSrkBonusCashFlowForAdmin = z.infer<typeof getSrkBonusCashFlowForAdminSchema>;
