"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { UserIcon, VideoIcon, Youtube } from "lucide-react";
import { getAllWebinarsApi } from "../../lib/apiClient";
import { TWebinar } from "../../lib/types/entities";
import { getUniversityAssetUrl } from "../../lib/cdn";

export default function WebinarPage() {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">(
    "upcoming"
  );
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

  const webinars = data.filter((webinar) =>
    selectedTab === "upcoming" ? !webinar.hasFinished : webinar.hasFinished
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Tabs
        aria-label="Webinar Tabs"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as "upcoming" | "past")}
        className="mb-6"
      >
        <Tab key="upcoming" title="Upcoming Webinars" />
        <Tab key="past" title="Past Webinars" />
      </Tabs>

      {webinars.length === 0 ? (
        <p className="text-gray-600">
          {selectedTab === "upcoming"
            ? "There are no upcoming webinars right now."
            : "There are no past webinars yet."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {webinars.map((webinar) => (
            <Card
              key={webinar._id}
              className="shadow-xl border border-default-200"
            >
              <Image
                src={getUniversityAssetUrl(webinar.thumbnail)}
                alt={webinar.title}
                className="w-full aspect-video object-cover"
                width={500}
                height={280}
                radius="none"
              />
              <CardBody className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{webinar.title}</h2>
                  <Chip
                    size="sm"
                    color={webinar.hasFinished ? "default" : "primary"}
                    variant="flat"
                  >
                    {webinar.hasFinished ? "Ended" : "Upcoming"}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <UserIcon className="h-4 w-4" />
                  <span>SRK University</span>
                </div>
              </CardBody>
              <CardFooter className="justify-end">
                {webinar.hasFinished ? (
                  <a
                    href={webinar.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button color="primary" endContent={<Youtube className="w-4 h-4" />}>
                      Watch Recording
                    </Button>
                  </a>
                ) : (
                  <a
                    href={webinar.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      color="primary"
                      endContent={<VideoIcon className="w-4 h-4" />}
                    >
                      Join Now
                    </Button>
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
