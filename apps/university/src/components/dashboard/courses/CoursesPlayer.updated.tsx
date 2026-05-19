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
import { getUniversityAssetUrl } from "../../../lib/cdn";
import HLSVideoPlayer from "./HLSVideoPlayer";

interface ExtendedCourseVideo extends TCourseVideo {
  hlsPlaylistUrl?: string;
}

/**
 * CoursePlayer - Updated to support both traditional video and HLS streaming
 * 
 * Migration Path:
 * 1. Old videos: Use HTML5 video element with Firebase URL
 * 2. New videos: Use HLS player with playlist URL
 * 3. Auto-detect format based on videoUrl extension
 * 
 * Benefits:
 * - Fast start time (2-3 seconds with HLS)
 * - Adaptive quality based on bandwidth
 * - Backward compatible with existing videos
 */
export default function CoursePlayer() {
  const { courseId } = useParams();
  const location = useLocation();
  const [currentVideo, setCurrentVideo] = useState<ExtendedCourseVideo | null>(
    null
  );
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [hasWatched] = useState(false);

  const { data: courseDetails } = useQuery<TCourse | null>({
    queryKey: ["courseDetails", courseId],
    queryFn: async () => {
      if (!courseId) return;
      const data = await getCourseDetailsByIdApi(courseId);
      return data;
    },
  });

  const { data: chaptersData } = useQuery<ExtendedCourseVideo[]>({
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
      setPlayerError(null);
    }
  }, [chaptersData]);

  /**
   * Determine if video should use HLS playback
   * Check for:
   * 1. Explicit hlsPlaylistUrl
   * 2. .m3u8 extension in videoUrl
   */
  const isHLSVideo = (video: ExtendedCourseVideo): boolean => {
    return !!(
      video.hlsPlaylistUrl ||
      video.videoUrl?.toLowerCase().endsWith(".m3u8")
    );
  };

  /**
   * Get the correct video source URL
   * Priority: hlsPlaylistUrl > videoUrl with CDN
   */
  const getVideoSource = (video: ExtendedCourseVideo): string => {
    if (video.hlsPlaylistUrl) {
      return video.hlsPlaylistUrl;
    }
    return getUniversityAssetUrl(video.videoUrl) || "";
  };

  const handleVideoError = (error: Error) => {
    setPlayerError(error.message);
    console.error("Video playback error:", error);
  };

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
            <Link to={breadcrumb.href}>
              <span>{breadcrumb.label}</span>
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>

      <div className="flex gap-x-2 justify-end text-textPrimary mb-2">
        <span className="text-sm">Total Video: {chaptersData?.length}</span>
      </div>

      {/* Error Banner */}
      {playerError && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-100">
          <p className="font-semibold">Playback Error</p>
          <p className="text-sm">{playerError}</p>
          <p className="text-xs mt-2 text-red-200">
            Try refreshing the page or selecting a different video.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Player */}
        <div
          className="relative pt-[56.25%] w-full rounded-lg overflow-hidden md:col-span-2 bg-black"
          onContextMenu={(e) => e.preventDefault()}
        >
          {currentVideo ? (
            isHLSVideo(currentVideo) ? (
              // HLS Streaming Player
              <div className="absolute top-0 left-0 w-full h-full">
                <HLSVideoPlayer
                  playlistUrl={getVideoSource(currentVideo)}
                  poster={getUniversityAssetUrl(courseDetails?.img)}
                  onError={handleVideoError}
                />
              </div>
            ) : (
              // Traditional HTML5 Video Player
              <video
                src={getVideoSource(currentVideo)}
                className="absolute top-0 left-0 w-full h-full"
                controlsList="nodownload"
                controls
                preload="metadata"
                onError={() => {
                  handleVideoError(
                    new Error("Failed to load video. Check your connection.")
                  );
                }}
              />
            )
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
              <span>No video available</span>
            </div>
          )}
        </div>

        {/* Chapter List */}
        <Card className="h-fit bg-bgSecondary">
          <CardHeader className="text-white">
            <h2 className="text-lg font-semibold">{courseDetails?.title}</h2>
          </CardHeader>
          <CardBody className="bg-bgSecondary text-textPrimary max-h-96 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {chaptersData && chaptersData.length > 0 ? (
                chaptersData.map((chapter) => {
                  const isCurrentVideo = currentVideo?._id === chapter._id;
                  const isHLS = isHLSVideo(chapter);

                  return (
                    <Button
                      onPress={() => {
                        setCurrentVideo(chapter);
                        setPlayerError(null);
                      }}
                      key={chapter._id}
                      variant={isCurrentVideo ? "faded" : "light"}
                      color={isCurrentVideo ? "warning" : "default"}
                      className="justify-start gap-2 p-2 h-auto text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <PlayCircle className="w-5 h-5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="truncate block text-sm">
                              {chapter.name}
                            </span>
                            {isHLS && (
                              <span className="text-xs text-blue-300">
                                HLS Streaming
                              </span>
                            )}
                          </div>
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
                })
              ) : (
                <p className="text-sm text-gray-400">No videos available</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Performance Info (Development Only) */}
      {import.meta.env.DEV && currentVideo && (
        <div className="mt-4 p-3 bg-gray-900 rounded text-xs text-gray-400">
          <p>
            <span className="font-semibold">Playing:</span> {currentVideo.name}
          </p>
          <p>
            <span className="font-semibold">Format:</span>{" "}
            {isHLSVideo(currentVideo)
              ? "HLS (Adaptive Streaming)"
              : "Progressive Download"}
          </p>
          {currentVideo.hlsPlaylistUrl && (
            <p>
              <span className="font-semibold">Playlist:</span>{" "}
              {currentVideo.hlsPlaylistUrl.substring(0, 50)}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
