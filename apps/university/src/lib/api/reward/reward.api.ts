import { apiClient } from "../../apiClient";

export type TReward = {
  _id: string;
  title: string;
  description: string;
  photoUrl: string;
  requiredEarning: number;
  isActive: boolean;
  claimCount: number;
  createdAt: string;
};

export type TUserReward = {
  _id: string;
  title: string;
  description: string;
  photoUrl: string;
  requiredEarning: number;
  createdAt: string;
  isEligible: boolean;
  currentEarning: number;
  isCompleted: boolean;
  isClaimed: boolean;
  claimedAt?: string;
};

export type TRewardClaim = {
  _id: string;
  rewardTitle: string;
  requiredEarning: number;
  earningAtClaim: number;
  user: { _id: string; fullName: string; email: string; phoneNumber: string };
  claimedAt: string;
};

export type TPaginated<T> = {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
};

export type TCreateRewardPayload = {
  title: string;
  description: string;
  photoUrl: string;
  requiredEarning: number;
};

const getAllRewards = async (page: number): Promise<TPaginated<TReward>> => {
  const response = await apiClient.get("/reward/admin", {
    params: { page, limit: 10 },
  });
  return response.data;
};

const getRewardClaims = async (
  page: number
): Promise<TPaginated<TRewardClaim>> => {
  const response = await apiClient.get("/reward/admin/claims", {
    params: { page, limit: 10 },
  });
  return response.data;
};

const createReward = async (data: TCreateRewardPayload) => {
  const response = await apiClient.post("/reward/admin", data);
  return response.data;
};

const toggleRewardActive = async (rewardId: string) => {
  const response = await apiClient.post(
    `/reward/admin/${rewardId}/toggle-active`,
    {}
  );
  return response.data;
};

const getMyRewards = async (): Promise<TUserReward[]> => {
  const response = await apiClient.get("/reward/my");
  return response.data;
};

const claimReward = async (rewardId: string) => {
  const response = await apiClient.post(`/reward/my/${rewardId}/claim`, {});
  return response.data as { success: boolean; message: string };
};

export const rewardApi = {
  getAllRewards,
  getRewardClaims,
  createReward,
  toggleRewardActive,
  getMyRewards,
  claimReward,
};
