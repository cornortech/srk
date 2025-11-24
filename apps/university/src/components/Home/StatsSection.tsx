import { Card, CardBody } from "@nextui-org/react";

export default function StatsSection() {
  const stats = [
    {
      value: "10+",
      label: "Global Countries",
    },
    {
      value: "90K",
      label: "Learners Community",
    },
    {
      value: "5K+",
      label: "Live Training",
    },
    {
      value: "20+",
      label: "Popular Courses",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 lg:absolute lg:top-[93vh] lg:left-0 lg:right-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-none bg-bgSecondary shadow-sm hover:shadow-md transition-shadow"
          >
            <CardBody className="flex flex-col items-center justify-center p-6">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </span>
              <span className="text-textPrimary text-sm md:text-base font-medium text-center">
                {stat.label}
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
