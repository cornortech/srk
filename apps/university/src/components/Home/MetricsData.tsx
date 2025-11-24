import { useEffect, useState } from "react";

const MetricScroller = () => {
  const metrics = [
    { value: "100,000+", label: "Students Trained" },
    { value: "80%", label: "Some Metric" },
    { value: "1.4K+", label: "Some Metric" },
  ];

  const [counts, setCounts] = useState<number[]>(metrics.map(() => 0));

  const parseMetricValue = (
    value: string
  ): { number: number; suffix: string } => {
    const match = value.match(/([\d,.]+)([^\d]*)/);
    if (match) {
      const number = parseFloat(match[1].replace(/,/g, ""));
      const suffix = match[2] || "";
      return { number, suffix };
    }
    return { number: 0, suffix: "" };
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const incrementTime = duration / steps;

    const targets = metrics.map((metric) => parseMetricValue(metric.value));

    const timers = targets.map((target, index) => {
      const increment = target.number / steps;
      let currentCount = 0;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= target.number) {
          currentCount = target.number;
          clearInterval(timer);
        }

        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          newCounts[index] = currentCount;
          return newCounts;
        });
      }, incrementTime);

      return timer;
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, []);

  return (
    <div className="flex justify-center items-center bg-black py-6 min-h-[8rem]">
      <div className="flex flex-col sm:flex-row sm:space-x-12 space-y-6 sm:space-y-0 items-center justify-center">
        {metrics.map((metric, index) => {
          const { number, suffix } = parseMetricValue(metric.value);
          const displayValue =
            counts[index] >= number
              ? metric.value
              : Math.floor(counts[index]).toLocaleString() + suffix;

          return (
            <div key={index} className="metric-item text-center px-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white opacity-90">
                {displayValue}
              </h1>
              <h1 className="text-xs sm:text-sm text-[#aaa] mt-1">
                {metric.label}
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricScroller;
