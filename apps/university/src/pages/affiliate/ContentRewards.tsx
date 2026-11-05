"use client";

import { useState } from "react";
import { Avatar, Button, Card, CardBody, Chip, Input } from "@heroui/react";
import {
  Facebook,
  Instagram,
  Music2,
  Plus,
  Trash2,
  Trophy,
  Twitter,
  Upload,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { getUniversityAssetUrl } from "../../lib/cdn";
import useAlert from "../../hooks/useAlert";

const MAX_LINKS = 3;

const platformIcons: Record<TContentPlatform, LucideIcon> = {
  YouTube: Youtube,
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  TikTok: Music2,
};

const placeholderFor = (platform: TContentPlatform | null) =>
  `https://${platform ? platform.toLowerCase() : "example"}.com/your-content`;

export default function ContentRewardsPage() {
  const { show } = useAlert();
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState<TContentPlatform | null>(null);
  const [links, setLinks] = useState<string[]>([""]);

  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["contentStatus"],
    queryFn: contentRewardApi.getStatus,
  });

  const { data: leaders } = useQuery({
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
    <div className="w-full px-4 py-8 space-y-6">
      {status?.canUpload && (
        <div className="space-y-4">
          <Button
            color="primary"
            startContent={<Upload className="w-4 h-4" />}
            onPress={() => setShowForm((v) => !v)}
          >
            Upload Content
          </Button>

          {showForm && (
            <Card>
              <CardBody className="space-y-5">
                <div>
                  <p className="text-sm font-semibold mb-2">
                    Choose platform *
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {CONTENT_PLATFORMS.map((p) => {
                      const Icon = platformIcons[p];
                      const selected = platform === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-colors ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-default-200 hover:bg-default-100"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">
                    POST/VIDEO LINKS * (1 to {MAX_LINKS})
                  </p>
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm w-14 shrink-0">
                        Post {index + 1}:
                      </span>
                      <Input
                        aria-label={`Post ${index + 1} link`}
                        placeholder={placeholderFor(platform)}
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

                {status && !canSubmit && (
                  <p className="text-sm text-warning">
                    {status.hasSubmittedToday
                      ? "You have already submitted today. "
                      : `Submissions are only open ${status.windowLabel}. `}
                    Next window opens {formatNepalDateTime(status.nextOpensAt)}{" "}
                    (Nepal time).
                  </p>
                )}
                {status && canSubmit && (
                  <p className="text-sm text-default-500">
                    Only one submission per day. Submissions are open{" "}
                    {status.windowLabel}.
                  </p>
                )}

                <Button
                  color="primary"
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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Leaderboard
        </h2>

        {leaders && leaders.length === 0 && (
          <p className="text-default-500">
            No weekly leaders have been announced yet.
          </p>
        )}

        {Object.entries(weeks).map(([key, entries]) => {
          const [weekStart, weekEnd] = key.split("|");
          return (
            <Card key={key}>
              <CardBody className="space-y-3">
                <h3 className="font-semibold">
                  Week: {formatDateKey(weekStart)} - {formatDateKey(weekEnd)}
                </h3>
                {entries.map((leader) => (
                  <div
                    key={leader._id}
                    className="flex items-center gap-3 rounded-lg bg-default-100 p-3"
                  >
                    <span className="w-8 text-center font-bold text-primary">
                      #{leader.rank}
                    </span>
                    <Avatar
                      size="sm"
                      name={leader.userName}
                      src={
                        leader.profilePicture
                          ? getUniversityAssetUrl(leader.profilePicture)
                          : undefined
                      }
                    />
                    <span className="font-medium flex-1 truncate">
                      {leader.userName}
                    </span>
                    <Chip size="sm" variant="flat">
                      {leader.platform}
                    </Chip>
                    <div className="flex gap-2">
                      {leader.links.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm hover:underline"
                        >
                          Post {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
