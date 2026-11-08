import {
  Facebook,
  Instagram,
  Music2,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { TContentPlatform } from "./contentReward.api";

// Brand tints used for platform tiles and chips (matches the task site look)
export const platformMeta: Record<
  TContentPlatform,
  { icon: LucideIcon; text: string; bg: string }
> = {
  YouTube: { icon: Youtube, text: "text-red-400", bg: "bg-red-500/15" },
  Facebook: { icon: Facebook, text: "text-blue-400", bg: "bg-blue-500/15" },
  Instagram: { icon: Instagram, text: "text-pink-400", bg: "bg-pink-500/15" },
  Twitter: { icon: Twitter, text: "text-sky-400", bg: "bg-sky-500/15" },
  TikTok: { icon: Music2, text: "text-white", bg: "bg-white/10" },
};
