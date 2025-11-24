import { Button, Card, CardBody, Divider, Image } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { StarIcon, CheckIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { TCourse, TPackage } from "../lib/types/entities";
import {
  getAllCoursesOfPackageApi,
  getPackageDetailsApi,
} from "../lib/apiClient";

export default function PackageSinglePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: packageDetails } = useQuery<TPackage | null>({
    queryKey: ["package", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await getPackageDetailsApi(id);
      return data;
    },
    enabled: !!id,
  });

  const { data: courses } = useQuery<TCourse[]>({
    queryKey: ["coursePackage", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await getAllCoursesOfPackageApi(id);
      return data;
    },
    enabled: !!id,
  });

  const handleRedirect = () => {
    navigate(`/auth/sign-up?packageId=${id}`);
  };
  console.log("course data", courses);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Introduction Section */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {packageDetails?.title}
        </h1>
        <p className="text-default-500 mb-6">{packageDetails?.description}</p>
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <h2 className="text-5xl font-bold">Rs.{packageDetails?.price}</h2>
          <Button
            color="primary"
            size="lg"
            onPress={handleRedirect}
            radius="full"
            className="font-semibold"
          >
            Get Access Now <span className="ml-2">→</span>
          </Button>
        </div>

        <Card className="shadow-md">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center gap-1 mb-1">
                  <StarIcon className="h-5 w-5 fill-orange-500 text-orange-500" />
                  <span className="font-bold">4.5/5</span>
                </div>
                <p className="text-sm text-default-500">
                  500+ already registered
                </p>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <h3 className="font-bold mb-1">1 Months</h3>
                <p className="text-sm text-default-500">
                  Under 1 hour study in a week
                </p>
              </div>

              <div className="border-r border-gray-200 pr-4">
                <h3 className="font-bold mb-1">Nepali, Hindi</h3>
                <p className="text-sm text-default-500">Subtitle: - </p>
              </div>

              <div>
                <h3 className="font-bold mb-1">Beginner Level</h3>
                <p className="text-sm text-default-500">
                  No prior experience required
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Courses Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          About {packageDetails?.title} Certificate
        </h2>
        <h3 className="text-xl font-bold text-white mb-8">
          You Get {packageDetails?.features[0]?.text}
        </h3>

        {/* Course 1 */}
        {courses?.map((course, index) => (
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="w-32 font-bold text-2xl text-primary">
                Course {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                <p className="text-default-500 mb-6">{course.description}</p>

                <Card className="max-w-md">
                  <CardBody className="p-0">
                    <Image
                      alt="Communication Skills Course"
                      src={course.image}
                      className="w-full object-cover h-[250px]"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
            <Divider className="my-8" />
          </div>
        ))}

        {/* Course 2 */}
      </section>

      {/* Start Learning Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-6">
          Start learning Today
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ul className="space-y-3">
            {packageDetails?.features
              ?.filter((feature) => feature.included)
              .map((f) => {
                return (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{f.text}</span>
                    </li>
                  </>
                );
              })}
          </ul>
        </div>

        <Button
          color="primary"
          size="lg"
          radius="full"
          className="font-semibold"
          onPress={handleRedirect}
        >
          Get Access Now <span className="ml-2">→</span>
        </Button>
      </section>
    </main>
  );
}
