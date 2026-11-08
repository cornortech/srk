"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Skeleton,
} from "@heroui/react";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link2,
  Medal,
  Plus,
  Trash2,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CONTENT_PLATFORMS,
  contentRewardApi,
  formatDateKey,
  formatNepalDateTime,
  TContentLeader,
  TContentPlatform,
} from "../../lib/api/contentReward/contentReward.api";
import { platformMeta } from "../../lib/api/contentReward/platforms";
import { getUniversityAssetUrl } from "../../lib/cdn";
import useAlert from "../../hooks/useAlert";

const MAX_LINKS = 3;

const cardClass = "bg-bgSecondary border border-white/5 rounded-2xl shadow-none";

const medalColor = ["text-[#e1ba73]", "text-gray-300", "text-orange-500"];

const placeholderFor = (platform: TContentPlatform | null) =>
  `https://${platform ? platform.toLowerCase() : "example"}.com/your-content`;

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        <Medal className={`w-5 h-5 ${medalColor[rank - 1]}`} />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-sm font-bold text-gray-400">
      #{rank}
    </div>
  );
}

function LeaderRow({ leader }: { leader: TContentLeader }) {
  const meta = platformMeta[leader.platform];
  const Icon = meta.icon;
  const isFirst = leader.rank === 1;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-xl p-3 border ${
        isFirst
          ? "border-primary/40 bg-primary/10"
          : "border-white/5 bg-white/[0.03]"
      }`}
    >
      <RankBadge rank={leader.rank} />
      <Avatar
        size="sm"
        name={leader.userName}
        src={
          leader.profilePicture
            ? getUniversityAssetUrl(leader.profilePicture)
            : undefined
        }
      />
      <div className="flex-1 min-w-[140px]">
        <p className="font-semibold text-textPrimary truncate">
          {leader.userName}
        </p>
        {isFirst && (
          <p className="text-xs text-[#e1ba73] flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Winner of the week
          </p>
        )}
      </div>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {leader.platform}
      </span>
      <div className="flex flex-wrap gap-2">
        {leader.links.map((link, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Post {i + 1}
            <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ContentRewardsPage() {
  const { show } = useAlert();
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState<TContentPlatform | null>(null);
  const [links, setLinks] = useState<string[]>([""]);

  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["contentStatus"],
    queryFn: contentRewardApi.getStatus,
  });

  const { data: leaders, isLoading: isLoadingLeaders } = useQuery({
    queryKey: ["contentLeaderboard"],
    queryFn: contentRewardApi.getLeaderboard,
  });

  const { mutate: submit, isPending } = useMutation({
    mutationFn: contentRewardApi.submitContent,
    onSuccess: () => {
      show("Content submitted successfully", "success");
      setShowForm(false);
      setPlatform(null);
      setLinks([""]);
      refetchStatus();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to submit content", "error");
      refetchStatus();
    },
  });

  const canSubmit =
    !!status && status.isWindowOpen && !status.hasSubmittedToday;

  const handleSubmit = () => {
    const cleaned = links.map((l) => l.trim()).filter(Boolean);
    if (!platform) {
      show("Please choose a platform", "error");
      return;
    }
    if (cleaned.length < 1) {
      show("Add at least 1 link", "error");
      return;
    }
    submit({ platform, links: cleaned });
  };

  // Group the flat leader list by week (API already sorts newest week first)
  const weeks = (leaders ?? []).reduce<Record<string, TContentLeader[]>>(
    (acc, leader) => {
      const key = `${leader.weekStart}|${leader.weekEnd}`;
      (acc[key] ||= []).push(leader);
      return acc;
    },
    {}
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-custom-gradient flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">
            Content Rewards
          </h1>
          <p className="text-sm text-gray-400">
            Share your content and get picked as a weekly leader.
          </p>
        </div>
      </div>

      {/* Upload (only for users the admin has allowed) */}
      {status?.canUpload && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-custom-gradient text-black font-semibold"
              startContent={
                showForm ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Upload className="w-4 h-4" />
                )
              }
              onPress={() => setShowForm((v) => !v)}
            >
              {showForm ? "Close" : "Upload Content"}
            </Button>

            {status.hasSubmittedToday ? (
              <Chip
                variant="flat"
                color="success"
                startContent={<CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
              >
                Submitted today
              </Chip>
            ) : status.isWindowOpen ? (
              <Chip
                variant="flat"
                color="success"
                startContent={<Clock className="w-3.5 h-3.5 ml-1" />}
              >
                Submissions open now
              </Chip>
            ) : (
              <Chip
                variant="flat"
                color="warning"
                startContent={<Clock className="w-3.5 h-3.5 ml-1" />}
              >
                Opens {formatNepalDateTime(status.nextOpensAt)}
              </Chip>
            )}
          </div>

          {showForm && (
            <Card className={cardClass}>
              <CardBody className="p-5 sm:p-6 space-y-6">
                {/* Platform */}
                <div>
                  <p className="text-sm font-semibold text-textPrimary mb-3">
                    Choose platform <span className="text-primary">*</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {CONTENT_PLATFORMS.map((p) => {
                      const meta = platformMeta[p];
                      const Icon = meta.icon;
                      const selected = platform === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          aria-pressed={selected}
                          className={`relative rounded-xl border p-4 flex flex-col items-center gap-2 transition-all ${
                            selected
                              ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(182,137,56,0.6)]"
                              : "border-white/5 bg-white/[0.03] hover:bg-white/[0.07]"
                          }`}
                        >
                          {selected && (
                            <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 right-2" />
                          )}
                          <span
                            className={`w-11 h-11 rounded-full flex items-center justify-center ${meta.bg}`}
                          >
                            <Icon className={`w-5 h-5 ${meta.text}`} />
                          </span>
                          <span className="text-sm font-medium text-textPrimary">
                            {p}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-textPrimary">
                      Post / video links <span className="text-primary">*</span>
                    </p>
                    <span className="text-xs text-gray-400">
                      {links.length} of {MAX_LINKS}
                    </span>
                  </div>
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        aria-label={`Post ${index + 1} link`}
                        variant="bordered"
                        placeholder={placeholderFor(platform)}
                        startContent={
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                            <Link2 className="w-4 h-4" />
                            Post {index + 1}
                          </span>
                        }
                        value={link}
                        onChange={(e) =>
                          setLinks((prev) =>
                            prev.map((l, i) =>
                              i === index ? e.target.value : l
                            )
                          )
                        }
                      />
                      {links.length > 1 && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label={`Remove post ${index + 1}`}
                          onPress={() =>
                            setLinks((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {links.length < MAX_LINKS && (
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<Plus className="w-4 h-4" />}
                      onPress={() => setLinks((prev) => [...prev, ""])}
                    >
                      Add another link
                    </Button>
                  )}
                </div>

                {/* Rules / state */}
                {status && !canSubmit ? (
                  <div className="flex items-start gap-2 rounded-xl bg-warning/10 text-warning p-3 text-sm">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      {status.hasSubmittedToday
                        ? "You have already submitted today. "
                        : `Submissions are only open ${status.windowLabel}. `}
                      Next window opens{" "}
                      {formatNepalDateTime(status.nextOpensAt)} (Nepal time).
                    </span>
                  </div>
                ) : (
                  status && (
                    <p className="text-xs text-gray-400">
                      One submission per day. Submissions are open{" "}
                      {status.windowLabel}.
                    </p>
                  )
                )}

                <Button
                  className="bg-custom-gradient text-black font-semibold w-full sm:w-auto"
                  isDisabled={!canSubmit}
                  isLoading={isPending}
                  onPress={handleSubmit}
                >
                  Submit
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </h2>

        {isLoadingLeaders && (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        )}

        {leaders && leaders.length === 0 && (
          <Card className={cardClass}>
            <CardBody className="py-12 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-textPrimary font-medium">
                No leaders announced yet
              </p>
              <p className="text-sm text-gray-400">
                Weekly winners will appear here.
              </p>
            </CardBody>
          </Card>
        )}

        {Object.entries(weeks).map(([key, entries]) => {
          const [weekStart, weekEnd] = key.split("|");
          return (
            <Card key={key} className={cardClass}>
              <CardBody className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-textPrimary">
                    {formatDateKey(weekStart)} - {formatDateKey(weekEnd)}
                  </span>
                </div>
                {entries.map((leader) => (
                  <LeaderRow key={leader._id} leader={leader} />
                ))}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
