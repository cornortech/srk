import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { PrimaryButton } from "../../components/ReusableComponents";
import { useQuery } from "@tanstack/react-query";
import { getAllCoursesApi } from "../../lib/apiClient";
import { TCourse } from "../../lib/types/entities";

function CourseList() {
  const { data: courses } = useQuery<TCourse[] | undefined>({
    queryKey: ["getAllPackages"],
    queryFn: getAllCoursesApi,
  });
  const navigate = useNavigate();

  const handleNavigateToCourseDetails = (courseId: string): void => {
    navigate(`/admin/courses/${courseId}`);
  };

  return (
    <div className="w-full">
      <div className="flex space-y-8 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textPrimary">Courses</h2>
        <Link to="/admin/courses/create">
          <PrimaryButton label="Edit Course" radius="sm" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses?.map((course) => (
          <div key={course._id} className=" transition-all duration-200">
            <Card
              isPressable
              className="w-full bg-bgSecondary text-textPrimary  h-72"
              onPress={() => handleNavigateToCourseDetails(course._id)}
            >
              <CardBody
                className={`p-0 bg-no-repeat bg-cover bg-center`}
                style={{
                  backgroundImage: `url(${course.image})`,
                }}
              ></CardBody>
              <CardFooter className="flex-col gap-2 items-start">
                <h4 className="font-bold text-medium mb-1 text-start">
                  {course.title}
                </h4>
                <div className="w-full flex justify-between">
                  {/* <button
                    onPress={() => handleDeleteVideo()}
                    className="bg-red-700 hover:bg-red-800 text-white py-1 px-3 text-sm  rounded flex items-center justify-center gap-1"
                  >
                    <Trash size={16} /> Delete
                  </button> */}
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
