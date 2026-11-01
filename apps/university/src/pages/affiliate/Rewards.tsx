"use client";

import { Button, Card, CardBody, Chip, Progress } from "@heroui/react";
import { Gift, Lock } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { rewardApi, TUserReward } from "../../lib/api/reward/reward.api";
import { getUniversityAssetUrl } from "../../lib/cdn";
import useAlert from "../../hooks/useAlert";

const percentOf = (reward: TUserReward) =>
  +Math.min((reward.currentEarning / reward.requiredEarning) * 100, 100).toFixed(
    0
  );

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

  if (!rewards) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-xl font-semibold mb-6">Rewards ({rewards.length})</h2>

      {rewards.length === 0 && (
        <div className="text-center py-12 text-default-500">
          <Gift className="w-12 h-12 mx-auto mb-3" />
          No rewards available right now
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward._id} className="hover:shadow-lg transition-all">
            <img
              src={getUniversityAssetUrl(reward.photoUrl)}
              alt={reward.title}
              loading="lazy"
              className={`w-full h-44 object-cover ${
                reward.isEligible ? "" : "grayscale opacity-60"
              }`}
            />
            <CardBody className="space-y-3">
              <h3 className="font-semibold text-lg">{reward.title}</h3>
              <p className="text-sm text-default-500">{reward.description}</p>

              {reward.isEligible ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>
                        Nrs.{" "}
                        {Math.min(
                          reward.currentEarning,
                          reward.requiredEarning
                        ).toLocaleString()}{" "}
                        / {reward.requiredEarning.toLocaleString()}
                      </span>
                      <span className="font-bold text-primary">
                        {percentOf(reward)}%
                      </span>
                    </div>
                    <Progress value={percentOf(reward)} className="h-2" />
                  </div>

                  {reward.isClaimed ? (
                    <Chip color="success" variant="flat" className="w-full">
                      Claimed
                    </Chip>
                  ) : (
                    <Button
                      color="primary"
                      isDisabled={!reward.isCompleted}
                      isLoading={isPending && variables === reward._id}
                      onPress={() => claim(reward._id)}
                    >
                      Claim
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-default-100 text-sm text-default-500">
                  <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                  This feature is not available for your account. This reward
                  is only available to users who registered after it was
                  created.
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
