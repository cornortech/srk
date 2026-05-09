"use client";

import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCoursesOfPackageApi } from "../../../lib/apiClient";
import useAuthStore from "../../../store/useAuth";
import { TCourse } from "../../../lib/types/entities";
import { getUniversityAssetUrl } from "../../../lib/cdn";

export default function CoursesDashboard({
  dashboardType,
}: {
  dashboardType: "study" | "affiliate";
}) {
  const navigate = useNavigate();
  const { userDetails } = useAuthStore();
  const packageId = userDetails?.packageId?._id;

  const handlePlayCourse = (courseId: string) => {
    navigate(`/${dashboardType}/courses/${courseId}`);
    // location.href = `/study/courses/${courseId}`;
  };

  const { data: coursesData } = useQuery<TCourse[]>({
    queryKey: ["courses", packageId],
    queryFn: async () => {
      if (!packageId) return;
      const data = await getAllCoursesOfPackageApi(packageId);
      return data;
    },
    enabled: !!packageId,
  });

  if (!coursesData) {
    return <div></div>;
  }

  return (
    <div className="w-full    mx-auto  px-4 sm:px-6 lg:px-8 py-6 ">
      <h2 className="text-3xl text-textPrimary font-bold mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coursesData.map((course) => (
          <div
            key={course._id}
            className="hover:scale-105 transition-all duration-200"
          >
            <Card
              isPressable
              className="w-full bg-bgSecondary text-textPrimary h-80"
              onPress={() => handlePlayCourse(course._id)}
            >
              <CardBody
                className={`p-0 bg-no-repeat bg-cover bg-center`}
                style={{
                  backgroundImage: `url(${getUniversityAssetUrl(course.image)})`,
                }}
              ></CardBody>
              <CardFooter className="flex-col gap-2 items-start">
                <h4 className="font-bold text-xl  mb-1">{course.title}</h4>

                <div className="flex justify-between items-center w-full">
                  <span className="text-small text-default-400"></span>
                  <Button
                    color="primary"
                    onPress={() => handlePlayCourse(course._id)}
                    endContent={<Play size={16} />}
                  >
                    Play
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
