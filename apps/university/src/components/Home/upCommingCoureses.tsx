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
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const UpCommingCoureses = () => {
  const navigate = useNavigate();
  const proPackageId = import.meta.env.VITE_PRO_PACKAGE_ID;

  return (
    <div className="space-y-4 px-4 pt-16">
      <div className="w-full flex items-center justify-center ">
        <div className="my-2 space-y-4 w-[80%] md:w-1/2 ">
          <h2 className="text-4xl text-textPrimary font-bold text-center">
            Exciting New Skills on the Horizon
          </h2>
          <p className="text-gray-300 mt-4 mb-8 text-center">
            <span className="font-bold"> TheSrkUniversity.com</span> offers a
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
      {/* Know More below grid */}
      <div className="flex flex-col items-center gap-2 mt-8 mb-4 py-5 border-t border-white/[0.06]">
        <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">What's coming next</p>
        <Link
          to="/learn/upcoming-skills"
          className="group inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
        >
          Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <span className="text-[11px] text-white/25">see the skills being added to the curriculum</span>
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
