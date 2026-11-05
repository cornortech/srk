import { apiClient } from "../../apiClient";

export const CONTENT_PLATFORMS = [
  "YouTube",
  "Facebook",
  "Instagram",
  "Twitter",
  "TikTok",
] as const;
export type TContentPlatform = (typeof CONTENT_PLATFORMS)[number];

export type TContentStatus = {
  canUpload: boolean;
  isWindowOpen: boolean;
  hasSubmittedToday: boolean;
  nextOpensAt: string;
  windowLabel: string;
};

export type TContentLeader = {
  _id: string;
  rank: number;
  weekStart: string;
  weekEnd: string;
  userName: string;
  profilePicture?: string | null;
  platform: TContentPlatform;
  links: string[];
};

export type TAdminContentSubmission = {
  _id: string;
  user: { _id: string; fullName: string; email: string; phoneNumber: string };
  platform: TContentPlatform;
  links: string[];
  submittedAt: string;
  leader: { rank: number; weekStart: string; weekEnd: string } | null;
};

export type TPaginatedSubmissions = {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  data: TAdminContentSubmission[];
};

const getStatus = async (): Promise<TContentStatus> =>
  (await apiClient.get("/content-reward/user/status")).data;

const submitContent = async (data: {
  platform: TContentPlatform;
  links: string[];
}) => (await apiClient.post("/content-reward/user/submit", data)).data;

const getLeaderboard = async (): Promise<TContentLeader[]> =>
  (await apiClient.get("/content-reward/user/leaderboard")).data;

const getSubmissionsForAdmin = async (params: {
  page: number;
  from?: string;
  to?: string;
}): Promise<TPaginatedSubmissions> =>
  (
    await apiClient.get("/content-reward/admin/submissions", {
      params: { ...params, limit: 10 },
    })
  ).data;

const selectLeader = async (data: {
  submissionId: string;
  rank: number;
  weekStart: string;
  weekEnd: string;
}) => (await apiClient.post("/content-reward/admin/leaders", data)).data;

const getLeadersForAdmin = async (): Promise<TContentLeader[]> =>
  (await apiClient.get("/content-reward/admin/leaders")).data;

const removeLeader = async (leaderId: string) =>
  (await apiClient.delete(`/content-reward/admin/leaders/${leaderId}`, { data: {} }))
    .data;

const setUploadPermission = async (userId: string, canUpload: boolean) =>
  (
    await apiClient.post(`/content-reward/admin/users/${userId}/permission`, {
      canUpload,
    })
  ).data;

export const contentRewardApi = {
  getStatus,
  submitContent,
  getLeaderboard,
  getSubmissionsForAdmin,
  selectLeader,
  getLeadersForAdmin,
  removeLeader,
  setUploadPermission,
};

// ---- shared formatting (all dates shown in Nepal time) ----

export const formatNepalDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    timeZone: "Asia/Kathmandu",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/** 'YYYY-MM-DD' (a plain calendar date) -> '5 Nov 2026' */
export const formatDateKey = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** Today's date in Nepal as YYYY-MM-DD, shifted by `offsetDays` */
export const nepalDateKey = (offsetDays = 0) => {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kathmandu",
  });
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
