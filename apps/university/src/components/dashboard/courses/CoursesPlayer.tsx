"use client";

import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { PlayCircle } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import {
  getCourseDetailsByIdApi,
  getCourseVideoByCourseId,
} from "../../../lib/apiClient";
import { TCourse, TCourseVideo } from "../../../lib/types/entities";
import { useEffect, useState } from "react";

export default function CoursePlayer() {
  const { courseId } = useParams();
  const location = useLocation();
  const [currentVideo, setCurrentVideo] = useState<TCourseVideo | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasWatched] = useState(false);
  const { data: courseDetails } = useQuery<TCourse | null>({
    queryKey: ["courseDetails", courseId],
    queryFn: async () => {
      if (!courseId) return;
      const data = await getCourseDetailsByIdApi(courseId);
      return data;
    },
  });

  const { data: chaptersData } = useQuery<TCourseVideo[]>({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      if (!courseId) return;
      const data = await getCourseVideoByCourseId(courseId);
      return data;
    },
  });

  const Breadcrumb = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "course-select",
      href: "/study/courses",
    },
    {
      label: `${courseDetails?.title}`,
      href: `/study/courses/${courseId}`,
    },
  ];

  useEffect(() => {
    if (chaptersData && chaptersData.length > 0) {
      setCurrentVideo(chaptersData[0]);
    }
  }, [chaptersData]);

  if (!courseDetails) return null;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Breadcrumbs>
        {Breadcrumb.map((breadcrumb) => (
          <BreadcrumbItem
            key={breadcrumb.href}
            classNames={{
              item: clsx(
                breadcrumb.href === location.pathname
                  ? "text-white"
                  : "text-primary font-semibold"
              ),
              separator: "text-white",
            }}
          >
            {" "}
            <Link to={breadcrumb.href}>
              <span>{breadcrumb.label}</span>
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>

      {/* <Progress
        value={progress}
        className="max-w-md float-end"
        color="primary"
      /> */}
      <div className="flex gap-x-2 justify-end text-textPrimary mb-2">
        <span className="text-sm">Total Video: {chaptersData?.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Player */}
        <div
          className="relative pt-[50.25%] w-full rounded-lg overflow-hidden md:col-span-2"
          onContextMenu={(e) => e.preventDefault()} // disables right-click
        >
          <video
            src={currentVideo?.videoUrl || ""}
            className="absolute top-0 left-0 w-full h-full"
            controlsList="nodownload"
            controls
          />
        </div>

        {/* Chapter List */}
        <Card className="h-fit bg-bgSecondary">
          <CardHeader className="text-white">
            <h2 className="text-lg font-semibold">{courseDetails?.title}</h2>
          </CardHeader>
          <CardBody className="bg-bgSecondary text-textPrimary">
            <div className="flex flex-col gap-2">
              {chaptersData &&
                chaptersData.map((chapter) => {
                  const isCurrentVideo = currentVideo?._id === chapter._id;
                  return (
                    <Button
                      onPress={() => setCurrentVideo(chapter)}
                      key={chapter._id}
                      variant={isCurrentVideo ? "faded" : "light"}
                      color={isCurrentVideo ? "warning" : "default"}
                      className="justify-start gap-2 p-2 h-auto text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <PlayCircle className="w-5 h-5 shrink-0" />
                          <span className="truncate block">{chapter.name}</span>
                        </div>
                        <Chip
                          size="sm"
                          color={
                            isCurrentVideo
                              ? "warning"
                              : hasWatched
                              ? "warning"
                              : "success"
                          }
                          variant="flat"
                        >
                          {isCurrentVideo
                            ? "watching"
                            : hasWatched
                            ? "Watched"
                            : "New"}
                        </Chip>
                      </div>
                    </Button>
                  );
                })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
