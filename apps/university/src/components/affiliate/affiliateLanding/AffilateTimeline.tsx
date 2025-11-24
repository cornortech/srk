import { Card } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { AffiliteBeneifits } from "../../../Data/AffiliateBenefits";

export default function AffiliateTimeline() {
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observers = timelineRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("scale-150", "bg-primary");
              entry.target.classList.remove("bg-gray-400");

              // Update line fill height
              if (lineRef.current) {
                lineRef.current.style.height = `${
                  ((index + 1) / timelineRefs.current.length) * 100
                }%`;
              }
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "-200px",
        }
      );

      if (ref) {
        observer.observe(ref);
      }

      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen text-gray-200 py-16">
      <div className="mx-auto px-4 text-center space-y-4">
        <p className="text-sm text-gray-400">5 Step Easy Process</p>
        <h1 className="text-4xl font-bold text-center mb-16">
          Affiliate <span className="text-primary">Timeline</span>
        </h1>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="absolute md:left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200">
            <div
              ref={lineRef}
              className="absolute md:left-1/2 transform -translate-x-1/2 w-px bg-primary transition-all duration-700 ease-in-out"
              style={{ height: "0%" }}
            />
          </div>

          {/* Timeline steps */}
          <div className="space-y-24">
            {AffiliteBeneifits.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center sm:justify-center"
              >
                <div className="flex items-center w-full">
                  {/* Align step content to left or right */}
                  {index % 2 === 0 && (
                    <Card className="w-[90%] md:w-[45%] p-6 bg-bgSecondary text-gray-300 shadow-lg ml-6 md:mr-auto">
                      <h3 className="text-primary font-bold text-xl mb-3">
                        {item.title}
                      </h3>
                      <p>{item.description}</p>
                    </Card>
                  )}
                  <div
                    ref={(el) => (timelineRefs.current[index] = el)}
                    className="absolute md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full border-4 border-black transition-all duration-700"
                  />
                  {index % 2 !== 0 && (
                    <Card className="w-[90%] md:w-[45%] p-6 bg-bgSecondary text-gray-300 shadow-lg ml-6 md:ml-auto">
                      <h3 className="text-primary font-bold text-xl mb-3">
                        {item.title}
                      </h3>
                      <p>{item.description}</p>
                    </Card>
                  )}
                </div>
                <div
                  className={`hidden md:block absolute text-lg text-gray-300 font-medium ${
                    index % 2 === 0 ? "left ml-28" : "right mr-28"
                  }`}
                >
                  {item.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
