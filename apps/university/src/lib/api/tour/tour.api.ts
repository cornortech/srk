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

export type TTourTargetInput = {
  destination: string;
  description: string;
  targetAmount: number;
  /** Days users have to reach the target */
  duration: number;
  accommodation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  rating: number;
  /** https URL, emoji, stored key, or an image data URL when uploading */
  image: string;
  features: string[];
  isActive?: boolean;
};

/** True when the value is a picture (URL or stored file) rather than an emoji. */
export const isTourImage = (value?: string | null): boolean => {
  if (!value) return false;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:image/")) return true;
  return /^[\w\-./]+\.(png|jpe?g|webp|gif|avif)$/i.test(value);
};

const createTourTarget = async (data: TTourTargetInput) =>
  (await apiClient.post("/tour/admin/targets", data)).data;

const updateTourTarget = async (id: string, data: TTourTargetInput) =>
  (await apiClient.put(`/tour/admin/targets/${id}`, data)).data;

const setTourTargetActive = async (id: string, isActive: boolean) =>
  (await apiClient.post(`/tour/admin/targets/${id}/active`, { isActive })).data;

const deleteTourTarget = async (id: string) =>
  (await apiClient.delete(`/tour/admin/targets/${id}`, { data: {} })).data;

export const tourApi = {
  createTourTarget,
  updateTourTarget,
  setTourTargetActive,
  deleteTourTarget,
  getTourTargets,
  getTourTargetUsers,
  getActiveTourAchievements,
};
