import { Tab, Tabs } from "@nextui-org/react";
import { RankCard } from "../../components/dashboard/leaderBoard/RankCard";
import { TableBoard } from "../../components/dashboard/leaderBoard/Table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEarningLeaderboardApi } from "../../lib/apiClient";
import { TLeaderBoardData } from "../../lib/types";

export default function LeaderboardTable() {
  const [currentTimeFrame, setCurrentTimeFrame] = useState<
    "weekly" | "monthly" | "allTime"
  >("weekly");

  let { data: leaderboardData } = useQuery<TLeaderBoardData[]>({
    queryKey: ["earningLeaderboard", currentTimeFrame],
    queryFn: async () => {
      const res = await getEarningLeaderboardApi(currentTimeFrame);
      return res;
    },
  });

  leaderboardData = leaderboardData || [];

  return (
    <div className="h-screen w-full bg-bgPrimary p-8 overflow-auto">
      <div className="w-full space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Leaderboard
        </h1>

        <Tabs
          aria-label="Time period"
          color="primary"
          selectedKey={currentTimeFrame} // Sync active tab with state
          onSelectionChange={(key) =>
            setCurrentTimeFrame(key as "weekly" | "monthly" | "allTime")
          }
          variant="solid"
          classNames={{
            tabList: "bg-bgPrimary border-2 border-gray-700 p-0 rounded-lg",
            cursor: "bg-bgSecondary",
            tab: "text-white h-10 bg-bgPrimary",
          }}
        >
          <Tab key="weekly" title="Weekly">
            <RankCard users={leaderboardData.slice(0, 3)} />
            <TableBoard users={leaderboardData.slice(3)} />
          </Tab>
          <Tab key="monthly" title="Monthly">
            <RankCard users={leaderboardData.slice(0, 3)} />
            <TableBoard users={leaderboardData.slice(3)} />
          </Tab>
          <Tab key="allTime" title="All Time">
            <RankCard users={leaderboardData.slice(0, 3)} />
            <TableBoard users={leaderboardData.slice(3)} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
