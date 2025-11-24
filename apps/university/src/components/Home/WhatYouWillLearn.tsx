import {
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Courses } from "../../Data/CourseData";
import { useNavigate } from "react-router-dom";
import { AnimationButton } from "../ReusableComponents";

export const ProvideSection = () => {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <>
      <section id="courses" className="py-8 mb-4 ">
        <div className="w-full px-4">
          <div data-aos="fade-right" data-aos-duration="1200">
            <h3 className="text-primary">THE SRK UNIVERSITY</h3>
            <h2 className="text-4xl font-bold mb-12 text-center">
              WHAT YOU'LL LEARN
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Courses.map((course) => (
              <Popover key={course.id} placement="right">
                <PopoverTrigger>
                  <div
                    className=" w-full  cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
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
                      {/* <div
                      className="w-full h-80 bg-no-repeat  bg-cover"
                      style={{
                        backgroundImage: `url(${course.img})`,
                      }}
                    >
                      <div className="w-full h-full bg-black bg-opacity-5"></div>
                    </div> */}
                      <img src={course.img} alt="" />
                    </Card>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-white p-4 rounded shadow-lg text-black">
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <p className="text-sm mt-2">{course.description}</p>
                </PopoverContent>
              </Popover>
            ))}
          </div>

          <div className="w-full flex items-center justify-center mt-2">
            <div
              className="my-2 w-[80%] md:w-1/2 "
              // data-aos="fade-up"
              // data-aos-duration="800"
              // tabIndex={0}
            >
              <h2 className="text-2xl text-textPrimary font-bold text-center">
                Exciting New Skills Are On The Way!
              </h2>
              <p className="text-gray-300 mt-y mb-8 text-center">
                <span className="font-semibold text-xl">
                  {" "}
                  Thesrkuniversity.com{" "}
                </span>
                offers a continually growing array of opportunities. We're
                always adding groundbreaking skills to help you stay ahead in
                your field.
              </p>
              <AnimationButton
                onClick={() => {
                  // navigate("/package/Srk Pro");
                  navigate(`/auth/sign-up?packageId=${proPackageId}`);
                }}
              />
              <p className="mt-2 text-gray-300">Enroll Now</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
