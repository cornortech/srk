import { Avatar, Card } from "@nextui-org/react";
import { TLeaderBoardData } from "../../../lib/types";

interface IRankCardProps {
  users: TLeaderBoardData[];
}

export const RankCard = ({ users }: IRankCardProps) => {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
      {users.map((performer) => (
        <Card
          key={performer.userId}
          className="bg-bgSecondary p-4 relative flex flex-col md:block"
        >
          {/* Position badge */}
          <div className="absolute top-2 right-2 md:static md:mb-2 md:flex md:justify-end">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-lg
                ${
                  performer.position === 1
                    ? "bg-yellow-400"
                    : performer.position === 2
                    ? "bg-orange-300"
                    : "bg-gray-200"
                }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-900"
              >
                <path d="M12 1l3.22 6.52 7.2 1.05-5.21 5.08 1.23 7.19L12 17.77l-6.44 3.07 1.23-7.19-5.21-5.08 7.2-1.05L12 1z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:items-center md:space-y-4 md:text-center md:mt-4 md:flex-col">
            <div className="flex items-center gap-4 md:flex-col md:gap-0">
              <Avatar
                src={performer.profilePicture}
                className="w-16 h-16 md:w-20 md:h-20"
                alt={performer.username}
              />
              <h3 className="text-white font-medium italic md:mt-2">
                {performer.username}
              </h3>
            </div>

            <div className="flex justify-between text-sm text-gray-300 mt-4 md:w-full md:justify-between">
              <div>
                <p className="text-gray-400">Country</p>
                <p>{performer.country}</p>
              </div>
              <div>
                <p className="text-gray-400">Amount</p>
                <p>{performer.totalEarnings}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
