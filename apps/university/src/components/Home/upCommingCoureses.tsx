import {
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { upCommingCourses } from "../../Data/UpCommingCourese";
import { AnimationButton } from "../ReusableComponents";
import { useNavigate } from "react-router-dom";

export const UpCommingCoureses = () => {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <div className="space-y-4 px-4">
      <div className="w-full flex items-center justify-center ">
        <div className="my-2 space-y-4 w-[80%] md:w-1/2 ">
          <h2 className="text-4xl text-textPrimary font-bold text-center">
            Exciting New Skills on the Horizon
          </h2>
          <p className="text-gray-300 mt-y mb-8 text-center">
            <span className="text-bold"> TheSrkUniversity.com</span> offers a
            continually growing array of opportunities. We're always adding
            groundbreaking skills to help you stay ahead in your field..
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {upCommingCourses.map((course) => (
          <Popover key={course.id} placement="right">
            <PopoverTrigger>
              <div
                className=" w-full  cursor-pointer"
                //   onPress={() => navigate(`/course/${course.id}`)}
                data-aos="fade-up"
                data-aos-duration="1200"
                role="button"
                tabIndex={0}
                aria-label={`View details for ${course.title}`}
              >
                <Card className="bg-bgSecondary text-textPrimary flex flex-col h-full hover:scale-100 transition-transform">
                  <CardBody className="p-0 flex flex-col flex-1">
                    <div className="p-4 flex flex-col justify-between gap-2 text-center">
                      <h3 className="text-lg font-bold text-textPrimary mb-2 truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm font-light">{course.slogan}</p>
                    </div>
                  </CardBody>

                  <img src={course.img} alt="" />
                </Card>
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-bgSecondary p-4 rounded shadow-lg text-gray-300">
              <h3 className="font-bold text-lg text-white">{course.title}</h3>
              <p className="text-sm mt-2">{course.description}</p>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <div className="space-y-2">
        <AnimationButton
          onClick={() => {
            navigate(`/auth/sign-up?packageId=${proPackageId}`);
          }}
        />
        <p className="text-gray-300">Enroll Now</p>
      </div>
    </div>
  );
};

// 1 / 10
