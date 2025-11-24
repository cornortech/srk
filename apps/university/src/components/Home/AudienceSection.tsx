import { Building2, BookOpen, Crown, Briefcase } from "lucide-react";
import { Card, CardBody } from "@nextui-org/react";

export function AudienceSection() {
  const audiences = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "BEGINNERS",
      description:
        "Jumpstart your journey with step-by-step guidance, practical resources, and supportive community",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "PROFESSIONALS",
      description:
        "Learn how to launch a profitable online business while keeping your full-time job.",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "ENTREPRENEURS",
      description:
        "Expand your toolkit with insights and tactics from experts who have been where you are.",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "BUSINESS OWNERS",
      description:
        "Modernize your approach and find new ways to scale and optimize your existing business.",
    },
  ];

  return (
    <section className="bg-bgPrimary flex flex-col items-center justify-center pt-6 pb-10 px-4 sm:px-6">
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          WHO IS THESRKUNIVERSITY FOR?
        </h2>

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
      </div>
    </section>
  );
}
