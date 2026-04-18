import { apiClient } from "../../apiClient";

const getTourTargets = async () => {
  const response = await apiClient.get("/tour/targets");
  return response.data;
};

export type TTourTargetUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  tourBalance: number;
  tourEventWallet: number;
};

export type TActiveTourAchievement = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  collectedAmount: number;
};

const getTourTargetUsers = async (): Promise<TTourTargetUser[]> => {
  const response = await apiClient.get("/tour");
  return response.data;
};

const getActiveTourAchievements = async (): Promise<TActiveTourAchievement[]> => {
  const response = await apiClient.get("/tour/active-achievements");
  return response.data;
};

export const tourApi = {
  getTourTargets,
  getTourTargetUsers,
  getActiveTourAchievements,
};
