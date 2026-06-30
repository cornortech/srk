import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: "100,000+", label: "Students Trained", target: 100000, suffix: "+" },
  { value: "80%", label: "Success Rate", target: 80, suffix: "%" },
  { value: "1.4K+", label: "Active Members", target: 1400, suffix: "+" },
];

function formatNumber(n: number, target: number, suffix: string): string {
  if (n >= target) {
    if (target >= 1000) return (target / 1000).toFixed(0) + "K" + suffix;
    return target.toLocaleString() + suffix;
  }
  if (target >= 1000) return (Math.floor(n) / 1000).toFixed(1) + "K" + suffix;
  return Math.floor(n).toLocaleString() + suffix;
}

const MetricScroller = () => {
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(metrics.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 1800;
    const targets = metrics.map((m) => m.target);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(targets.map((t) => t * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started]);

  return (
    <div ref={sectionRef} className="flex justify-center items-center bg-black py-6 min-h-[8rem]">
      <div className="flex flex-col sm:flex-row sm:space-x-12 space-y-6 sm:space-y-0 items-center justify-center">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-item text-center px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white opacity-90">
              {started
                ? formatNumber(counts[index], metric.target, metric.suffix)
                : metric.value}
            </h2>
            <p className="text-xs sm:text-sm text-[#aaa] mt-1">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricScroller;
