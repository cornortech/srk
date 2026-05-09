import { Avatar, Accordion, AccordionItem, Image } from "@nextui-org/react";
import { Clock, Users, Award, CheckCircle } from "lucide-react";
import { Courses } from "../Data/CourseData";
import { useNavigate, useParams } from "react-router-dom";
import { AnimationButton } from "../components/ReusableComponents";
import { getUniversityAssetUrl } from "../lib/cdn";

export function CourseDetails() {
  const { courseId } = useParams();
  const course = Courses.find((c) => c.id === courseId);
  const navigate = useNavigate();
  
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;
  if (!course) {
    return <h1>Course not found</h1>;
  }
  return (
    <div className="min-h-screen bg-bgPrimary text-white p-8">
      <div className="max-w-custom mx-auto px-6 flex items-center flex-col gap-8">
        <div className="flex md:flex-row-reverse flex-col py-8  gap-10">
          <div className="">
            <Image src={getUniversityAssetUrl(course.img)} alt="img" width={800} />
          </div>
          <div className=" text-textPrimary mb-8 flex flex-col justify-center ">
            <div className="w-[80%]">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                {course?.title}
              </h1>
              <p className="text-lg mb-6">{course?.description}</p>
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  <span>{course?.duration}</span>
                </div>
                <div className="flex items-center mb-4 sm:mb-0">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  <span>{course?.students} students</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  <span>{course?.rating} rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bgSecondary text-textPrimary flex flex-col gap-4 rounded-xl py-6 px-4  mb-10 w-full  ">
          <div className="text-2xl font-bold text-center">
            <h2 className="text-2xl font-bold text-primary">
              Course Curriculum
            </h2>
          </div>
          <div>
            <Accordion variant="splitted">
              {(course.curriculum || []).map((week, index) => (
                <AccordionItem
                  key={index}
                  aria-label={`Week ${week.week}: ${week.title}`}
                  title={`Week ${week.week}: ${week.title}`}
                  className="text-textPrimary bg-bgPrimary my-1"
                  classNames={{
                    title: "text-textPrimary",
                  }}
                >
                  <ul className="list-disc pl-5">
                    {week.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>{topic}</li>
                    ))}
                  </ul>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="bg-bgSecondary text-textPrimary px-4 py-6 space-y-6 rounded-xl  mb-8 w-full">
          <div>
            <h2 className="text-2xl font-bold text-primary text-center">
              Your Instructor
            </h2>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <Avatar
                src={getUniversityAssetUrl(course?.instructor.avatar)}
                className="w-16 h-16 mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {course?.instructor.name}
                </h3>
                <p className="text-gray-400">Course Instructor</p>
              </div>
            </div>
            <p>{course?.instructor.bio}</p>
          </div>
        </div>

        <div className="bg-bgSecondary text-textPrimary py-6 rounded-xl px-4 mb-8 w-full">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary text-center">
              What You'll Learn
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.whatYoullLearn.map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <AnimationButton
          onClick={() => {
              navigate(`/auth/sign-up?packageId=${proPackageId}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
