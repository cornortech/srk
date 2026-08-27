import {
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Courses } from "../../Data/CourseData";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimationButton } from "../AnimationButton";
import { ArrowRight } from "lucide-react";

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
                      <img src={course.img} alt={course.title} width={600} height={400} loading="lazy" className="w-full h-auto" style={{aspectRatio:'3/2'}} />
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

          <div className="flex flex-col items-center gap-2 mt-10 mb-4 py-6 border-t border-white/[0.06]">
            <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Explore in depth</p>
            <Link
              to="/learn/course-tracks"
              className="group inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
            >
              Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="text-[11px] text-white/25">explore what each course offers and where it takes you</span>
          </div>

          <div className="w-full flex items-center justify-center mt-2">
            <div
              className="my-2 w-[80%] md:w-1/2 "
              // data-aos="fade-up"
              // data-aos-duration="800"
              // tabIndex={0}
            >
              <h2 className="text-2xl text-textPrimary font-bold text-center">
                Continue Building New Skills
              </h2>
              <p className="text-gray-300 mt-y mb-8 text-center">
                Education is a continuous process, and we are too. We are
                continually adding new courses to our library that meet the
                needs of industry and new career opportunities.
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
