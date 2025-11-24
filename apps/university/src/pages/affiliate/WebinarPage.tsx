"use client";

import { Button, Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, UserIcon, VideoIcon } from "lucide-react";
import moment from "moment";
import { getAllWebinarsApi } from "../../lib/apiClient";
import { TWebinar } from "../../lib/types/entities";

const getStatus = (
  startTime: string,
  endTime: string
): {
  label: string;
  color: "primary" | "success" | "danger";
} => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return { label: "Upcoming", color: "primary" };
  if (now > end) return { label: "Ended", color: "danger" };
  return { label: "Live", color: "success" };
};

export default function WebinarPage() {
  const { data } = useQuery<TWebinar[]>({
    queryKey: ["webinars"],
    queryFn: async () => {
      const webinars = await getAllWebinarsApi();
      return webinars;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  if (!data || data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">No Webinars Available</h1>
        <p className="text-gray-600">
          There are currently no webinars scheduled.
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((webinar) => {
          const { label, color } = getStatus(
            webinar.startTime.toLocaleString(),
            webinar.endTime.toLocaleString()
          );
          const canJoin = label !== "Ended";

          return (
            <Card
              key={webinar._id}
              className="shadow-xl border border-default-200"
            >
              <CardBody className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{webinar.title}</h2>
                  <Chip size="sm" color={color} variant="flat">
                    {label}
                  </Chip>
                </div>
                {/* <p className="text-sm text-gray-600">{webinar.description}</p> */}
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <UserIcon className="h-4 w-4" />
                  <span>SRK University</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {moment(webinar.startTime).format("MMMM Do YYYY")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {moment(webinar.startTime).format("hh:mm A")}-
                    {moment(webinar.endTime).format("hh:mm A")}
                  </span>
                </div>
              </CardBody>
              <CardFooter className="justify-end">
                {canJoin ? (
                  <a href={webinar.meetUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      color="primary"
                      endContent={<VideoIcon className="w-4 h-4" />}
                    >
                      Join Now
                    </Button>
                  </a>
                ) : (
                  <Button isDisabled>Event Ended</Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
