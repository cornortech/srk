"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hourglass,
  ImageOff,
  Send,
  Sparkles,
  Link2,
  Plus,
  Wallet,
  Trash2,
  Trophy,
  Upload,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CONTENT_PLATFORMS,
  contentRewardApi,
  formatDateKey,
  formatNepalDateTime,
  formatWeekRange,
  ordinalRank,
  TContentLeader,
  TMyWeek,
  TContentPlatform,
} from "../../lib/api/contentReward/contentReward.api";
import { platformMeta } from "../../lib/api/contentReward/platforms";
import { getUniversityAssetUrl } from "../../lib/cdn";
import useAlert from "../../hooks/useAlert";

const MAX_LINKS = 3;

const cardClass = "bg-bgSecondary border border-white/5 rounded-2xl shadow-none";

const placeholderFor = (platform: TContentPlatform | null) =>
  `https://${platform ? platform.toLowerCase() : "example"}.com/your-content`;

// Badge colours for 1st / 2nd / 3rd (same as the earning leaderboard)
const badgeColor: Record<number, string> = {
  1: "bg-yellow-400",
  2: "bg-orange-300",
  3: "bg-gray-200",
};

// A leaderboard entry shaped like a social media post: who posted it, the
// poster itself as the main picture, then the reward and the links.
function LeaderCard({ leader }: { leader: TContentLeader }) {
  const meta = platformMeta[leader.platform];
  const Icon = meta.icon;
  const imageUrl = leader.postImage ? getUniversityAssetUrl(leader.postImage) : "";
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!imageUrl && !imageFailed;

  return (
    <Card
      className={`bg-bgSecondary p-0 ${
        leader.rank === 1 ? "border border-primary/40" : "border border-white/5"
      }`}
    >
      {/* Post header */}
      <div className="flex items-center gap-3 p-3">
        <Avatar
          size="sm"
          name={leader.userName}
          src={
            leader.profilePicture
              ? getUniversityAssetUrl(leader.profilePicture)
              : undefined
          }
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {leader.userName}
          </p>
          <p className="text-xs text-gray-400">
            {ordinalRank(leader.rank)} content creator
          </p>
        </div>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.bg}`}
          title={leader.platform}
        >
          <Icon className={`w-4 h-4 ${meta.text}`} />
        </span>
      </div>

      {/* Poster */}
      <div className="relative w-full aspect-[4/5] bg-black/30">
        {showImage ? (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl}
              alt={`${leader.userName}'s poster`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover"
            />
          </a>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/[0.06] to-white/[0.02] text-gray-500">
            <ImageOff className="w-10 h-10" />
            <span className="text-xs">Poster coming soon</span>
          </div>
        )}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold text-blue-900 shadow ${
            badgeColor[leader.rank] ?? "bg-gray-200"
          }`}
        >
          <Trophy className="w-4 h-4" />
          {ordinalRank(leader.rank)}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 space-y-3">
        {!!leader.rewardAmount && (
          <div className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2">
            <span className="text-xs text-gray-300">Reward</span>
            <span className="font-semibold text-[#e1ba73]">
              NRS {leader.rewardAmount.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {leader.links.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View post {leader.links.length > 1 ? i + 1 : ""}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}

// What a week means for this user, in words
function WeekResult({ week }: { week: TMyWeek }) {
  if (week.result) {
    return (
      <div className="flex items-start gap-2 rounded-xl bg-success/10 text-success p-3 text-sm">
        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          Congratulations! You have been selected as the{" "}
          <b>{ordinalRank(week.result.rank)}</b> content creator for this week.
          {week.result.rewardAmount > 0 &&
            ` NRS ${week.result.rewardAmount.toLocaleString()} was added to your earnings.`}
        </span>
      </div>
    );
  }
  if (!week.isCurrent && week.decisionMade) {
    return (
      <div className="flex items-start gap-2 rounded-xl bg-white/5 text-gray-300 p-3 text-sm">
        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          Sorry, you were not selected this time. Keep creating, your next
          chance is the coming week!
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-xl bg-warning/10 text-warning p-3 text-sm">
      <Hourglass className="w-4 h-4 mt-0.5 shrink-0" />
      <span>
        {week.isCurrent
          ? "This is the current week. The admin will review the submissions when the week ends."
          : "Your submissions are waiting for the admin's decision."}
      </span>
    </div>
  );
}

function WeekStatusChip({ week }: { week: TMyWeek }) {
  if (week.result) {
    return (
      <Chip size="sm" color="success" variant="flat">
        Selected - {ordinalRank(week.result.rank)}
      </Chip>
    );
  }
  if (week.isCurrent) {
    return (
      <Chip size="sm" color="primary" variant="flat">
        Current week
      </Chip>
    );
  }
  if (week.decisionMade) {
    return (
      <Chip size="sm" variant="flat">
        Not selected
      </Chip>
    );
  }
  return (
    <Chip size="sm" color="warning" variant="flat">
      Pending
    </Chip>
  );
}

export default function ContentRewardsPage() {
  const { show } = useAlert();
  const queryClient = useQueryClient();
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

  const { data: statement } = useQuery({
    queryKey: ["contentRewardStatement"],
    queryFn: contentRewardApi.getRewardStatement,
  });
  const totalRewarded = (statement ?? []).reduce((sum, r) => sum + r.amount, 0);
  const ordinal = ordinalRank;

  const { data: myWeeks, isLoading: isLoadingMyWeeks } = useQuery({
    queryKey: ["myContentSubmissions"],
    queryFn: contentRewardApi.getMySubmissions,
    enabled: !!status?.canUpload,
  });

  const { mutate: submit, isPending } = useMutation({
    mutationFn: contentRewardApi.submitContent,
    onSuccess: () => {
      show("Content submitted successfully", "success");
      setPlatform(null);
      setLinks([""]);
      refetchStatus();
      queryClient.invalidateQueries({ queryKey: ["myContentSubmissions"] });
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

  const tabs = [
    {
      id: "leaderboard",
      title: (
        <span className="flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Leaderboard
        </span>
      ),
      content: (
        <div className="space-y-4">
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
                <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                  {entries
                    .slice()
                    .sort((x, y) => x.rank - y.rank)
                    .map((leader) => (
                      <LeaderCard key={leader._id} leader={leader} />
                    ))}
                </div>
              </CardBody>
            </Card>
          );
        })}
        </div>
      ),
    },
    ...(status?.canUpload
      ? [
          {
            id: "submissions",
            title: (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" /> My Submissions
              </span>
            ),
            content: (
              <div className="space-y-4">
                {isLoadingMyWeeks && (
                  <div className="space-y-3">
                    <Skeleton className="h-16 rounded-2xl" />
                    <Skeleton className="h-16 rounded-2xl" />
                  </div>
                )}

                {myWeeks && myWeeks.length === 0 && (
                  <Card className={cardClass}>
                    <CardBody className="py-12 text-center">
                      <Send className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <p className="text-textPrimary font-medium">
                        No submissions yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Your weekly submissions will be listed here.
                      </p>
                    </CardBody>
                  </Card>
                )}

                {myWeeks && myWeeks.length > 0 && (
                  <Accordion
                    selectionMode="multiple"
                    variant="splitted"
                    defaultExpandedKeys={myWeeks
                      .filter((w) => w.isCurrent)
                      .map((w) => w.weekStart)}
                  >
                    {myWeeks.map((week) => (
                      <AccordionItem
                        key={week.weekStart}
                        aria-label={formatWeekRange(week.weekStart, week.weekEnd)}
                        title={
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-textPrimary">
                              {formatWeekRange(week.weekStart, week.weekEnd)}
                            </span>
                            <WeekStatusChip week={week} />
                          </span>
                        }
                        subtitle={`${week.submissions.length} submission${
                          week.submissions.length === 1 ? "" : "s"
                        }`}
                        startContent={<CalendarDays className="w-5 h-5 text-primary" />}
                        classNames={{ base: "bg-bgSecondary border border-white/5 shadow-none" }}
                      >
                        <div className="space-y-3 pb-2">
                          <WeekResult week={week} />
                          {week.submissions.map((sub) => {
                            const meta = platformMeta[sub.platform];
                            const Icon = meta.icon;
                            return (
                              <div
                                key={sub._id}
                                className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
                              >
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  {sub.platform}
                                </span>
                                <div className="flex-1 min-w-[140px]">
                                  <div className="flex flex-wrap gap-2">
                                    {sub.links.map((link, i) => (
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
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatNepalDateTime(sub.submittedAt)}
                                  </p>
                                </div>
                                {sub.leaderRank && (
                                  <Chip size="sm" color="success" variant="flat">
                                    {ordinalRank(sub.leaderRank)} place
                                  </Chip>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      id: "statement",
      title: (
        <span className="flex items-center gap-2">
          <Wallet className="w-4 h-4" /> My Statement
          {!!statement?.length && (
            <Chip size="sm" variant="flat" color="success">
              {statement.length}
            </Chip>
          )}
        </span>
      ),
      content: (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            Rewards added to your earnings when the admin confirmed you as a
            weekly leader.
          </p>
          <Chip color="success" variant="flat">
            Total earned: NRS {totalRewarded.toLocaleString()}
          </Chip>
        </div>

        {statement && statement.length === 0 && (
          <Card className={cardClass}>
            <CardBody className="py-12 text-center">
              <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-textPrimary font-medium">No rewards yet</p>
              <p className="text-sm text-gray-400">
                When you win a weekly reward it will be listed here.
              </p>
            </CardBody>
          </Card>
        )}

        {statement && statement.length > 0 && (
          <Card className={cardClass}>
            <CardBody className="p-3 space-y-2">
              {statement.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <div>
                    <p className="font-medium text-textPrimary">
                      Content Reward - {ordinal(item.rank)} place ({item.platform})
                    </p>
                    <p className="text-xs text-gray-400">
                      Week {formatDateKey(item.weekStart)} -{" "}
                      {formatDateKey(item.weekEnd)} · Credited{" "}
                      {formatNepalDateTime(item.creditedAt)}
                    </p>
                  </div>
                  <p className="font-semibold text-green-400">
                    +NRS {item.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
      ),
    },
    ...(status?.canUpload
      ? [
          {
            id: "upload",
            title: (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Content
              </span>
            ),
            content: (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
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

          {(
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
                        variant="flat"
                        type="url"
                        placeholder={placeholderFor(platform)}
                        classNames={{
                          base: "flex-1",
                          inputWrapper:
                            "h-12 rounded-xl bg-white/5 border border-white/10 shadow-none px-3 gap-3 " +
                            "data-[hover=true]:bg-white/10 data-[hover=true]:border-white/20 " +
                            "group-data-[focus=true]:bg-white/5 group-data-[focus=true]:border-primary",
                          // kill the browser's inner blue focus box so there is one clean border
                          input:
                            "text-sm text-textPrimary placeholder:text-gray-500 " +
                            "!outline-none !ring-0 !shadow-none !border-0 bg-transparent focus:!outline-none focus:!ring-0",
                        }}
                        startContent={
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-[#e1ba73]">
                              {index + 1}
                            </span>
                            <Link2 className="w-4 h-4 text-gray-500" />
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
      </div>
            ),
          },
        ]
      : []),
  ];

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

      <Tabs
        aria-label="Content rewards"
        variant="underlined"
        color="primary"
        classNames={{
          base: "w-full",
          tabList: "gap-4 w-full overflow-x-auto border-b border-white/10 p-0",
          tab: "h-11 px-2",
          cursor: "w-full bg-primary",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
        items={tabs}
      >
        {(item) => (
          <Tab key={item.id} title={item.title}>
            <div className="pt-4">{item.content}</div>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
