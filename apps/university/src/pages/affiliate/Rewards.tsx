"use client";

import { Button, Card, CardBody, Chip, Progress, Skeleton } from "@heroui/react";
import { CheckCircle2, Gift, Lock, PartyPopper, Target } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { rewardApi, TUserReward } from "../../lib/api/reward/reward.api";
import { getUniversityAssetUrl } from "../../lib/cdn";
import useAlert from "../../hooks/useAlert";

const percentOf = (reward: TUserReward) =>
  Math.floor(
    Math.min((reward.currentEarning / reward.requiredEarning) * 100, 100)
  );

const cardClass =
  "bg-bgSecondary border border-white/5 rounded-2xl shadow-none overflow-hidden";

function StateChip({ reward }: { reward: TUserReward }) {
  if (!reward.isEligible) {
    return (
      <Chip
        size="sm"
        variant="flat"
        color="warning"
        startContent={<Lock className="w-3 h-3 ml-1" />}
      >
        Not available
      </Chip>
    );
  }
  if (reward.isClaimed) {
    return (
      <Chip
        size="sm"
        variant="flat"
        color="success"
        startContent={<CheckCircle2 className="w-3 h-3 ml-1" />}
      >
        Claimed
      </Chip>
    );
  }
  if (reward.isCompleted) {
    return (
      <Chip
        size="sm"
        variant="flat"
        color="success"
        startContent={<PartyPopper className="w-3 h-3 ml-1" />}
      >
        Ready to claim
      </Chip>
    );
  }
  return (
    <Chip size="sm" variant="flat" color="primary">
      In progress
    </Chip>
  );
}

export default function RewardsPage() {
  const { show } = useAlert();

  const { data: rewards, refetch } = useQuery({
    queryKey: ["myRewards"],
    queryFn: rewardApi.getMyRewards,
  });

  const { mutate: claim, isPending, variables } = useMutation({
    mutationFn: rewardApi.claimReward,
    onSuccess: (res) => {
      show(res.message || "Reward claimed", "success");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to claim reward", "error");
      refetch();
    },
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-custom-gradient flex items-center justify-center shrink-0">
          <Gift className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Rewards</h1>
          <p className="text-sm text-gray-400">
            Reach the earning goal to unlock and claim a reward.
          </p>
        </div>
      </div>

      {!rewards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      )}

      {rewards && rewards.length === 0 && (
        <Card className={cardClass}>
          <CardBody className="py-14 text-center">
            <Gift className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-textPrimary font-medium">
              No rewards available right now
            </p>
            <p className="text-sm text-gray-400">Check back soon.</p>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(rewards ?? []).map((reward) => {
          const percent = percentOf(reward);
          const remaining = Math.max(
            reward.requiredEarning - reward.currentEarning,
            0
          );

          return (
            <Card
              key={reward._id}
              className={`${cardClass} hover:border-primary/40 transition-colors`}
            >
              {/* Photo with goal badge */}
              <div className="relative">
                <img
                  src={getUniversityAssetUrl(reward.photoUrl)}
                  alt={reward.title}
                  loading="lazy"
                  className={`w-full aspect-video object-cover ${
                    reward.isEligible ? "" : "grayscale opacity-50"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bgSecondary via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs font-semibold text-[#e1ba73]">
                  <Target className="w-3.5 h-3.5" />
                  Earn Nrs. {reward.requiredEarning.toLocaleString()}
                </div>
                <div className="absolute top-3 right-3">
                  <StateChip reward={reward} />
                </div>
              </div>

              <CardBody className="p-5 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-textPrimary">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-3">
                    {reward.description}
                  </p>
                </div>

                {reward.isEligible ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">
                          Nrs.{" "}
                          {Math.min(
                            reward.currentEarning,
                            reward.requiredEarning
                          ).toLocaleString()}{" "}
                          / {reward.requiredEarning.toLocaleString()}
                        </span>
                        <span className="font-bold text-[#e1ba73]">
                          {percent}%
                        </span>
                      </div>
                      <Progress
                        aria-label={`${reward.title} progress`}
                        value={percent}
                        size="md"
                        classNames={{
                          track: "bg-white/10",
                          indicator: "bg-custom-gradient",
                        }}
                      />
                      {!reward.isCompleted && (
                        <p className="text-xs text-gray-400">
                          Nrs. {remaining.toLocaleString()} more to unlock
                        </p>
                      )}
                    </div>

                    {reward.isClaimed ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 text-success py-2.5 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        Claimed
                      </div>
                    ) : (
                      <Button
                        className="bg-custom-gradient text-black font-semibold disabled:opacity-40"
                        isDisabled={!reward.isCompleted}
                        isLoading={isPending && variables === reward._id}
                        onPress={() => claim(reward._id)}
                      >
                        {reward.isCompleted ? "Claim reward" : "Keep earning"}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-sm text-gray-400">
                    <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      This feature is not available for your account. This
                      reward is only available to users who registered after it
                      was created.
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
