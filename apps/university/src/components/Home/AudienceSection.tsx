import { Building2, BookOpen, Crown, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardBody } from "@nextui-org/react";
import { Link } from "react-router-dom";

export function AudienceSection() {
  const audiences = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "BEGINNERS",
      description:
        "Start with simple, step-by-step lessons. Learn the basics through practical activities and improve your skills at your own pace.",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "WORKING PROFESSIONALS",
      description:
        "Enhance your knowledge without interrupting your career. Develop skills applicable across the industry that are flexible, continually sought after, and promote further professional growth.",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "ENTREPRENEURS",
      description:
        "Understand how to manage your business. Improve your planning and make better business decisions.",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "BUSINESS OWNERS",
      description:
        "Grow your business by learning practical advice on marketing, planning, and managing daily work. Take the knowledge you gain and use it confidently in your business.",
    },
  ];

  return (
    <section className="bg-bgPrimary flex flex-col items-center justify-center pt-6 pb-10 px-4 sm:px-6">
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          WHO CAN LEARN AT THE SRK UNIVERSITY?
        </h2>
        <p className="text-default-500 text-sm sm:text-base text-center max-w-2xl mx-auto mb-8">
          Courses for new learners, experienced workers, business starters,
          and business leaders. Learn abilities that help with both personal
          growth and career success.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <Card
              key={index}
              isPressable
              className="bg-content1/5 backdrop-blur-sm border border-primary border-opacity-60 bg-bgSecondary"
              shadow="sm"
            >
              <CardBody className="flex flex-col items-center text-center px-6 py-8 gap-5 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-primary text-lg sm:text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="text-default-500 text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1.5 mt-8">
          <Link
            to="/learn/who-is-it-for"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary/75 text-sm font-medium rounded transition-all duration-300 hover:border-primary hover:bg-primary hover:text-bgPrimary hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(182,137,56,0.35)]"
          >
            Know More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11px] text-white/25">find out if it's the right fit for you</span>
        </div>
      </div>
    </section>
  );
}
