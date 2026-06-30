import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { IntroSection } from "../components/Home/IntroSection";
import MetricScroller from "../components/Home/MetricsData";
import LogoScroller from "../components/Home/LogoScroll";
import { AudienceSection } from "../components/Home/AudienceSection";
import { EzoicAd } from "../components/EzoicAd";

// Lazy-load everything below the fold to reduce initial JS execution
const ComparisonSection = lazy(() => import("../components/Home/Comparison").then(m => ({ default: m.ComparisonSection })));
const ProvideSection = lazy(() => import("../components/Home/WhatYouWillLearn").then(m => ({ default: m.ProvideSection })));
const PackageSection = lazy(() => import("../components/Home/package").then(m => ({ default: m.PackageSection })));
const MoneySection = lazy(() => import("../components/Home/moneySection").then(m => ({ default: m.MoneySection })));
const BonusTimeline = lazy(() => import("../components/Home/Bonuses"));
const WhyChooseSection = lazy(() => import("../components/Home/WhyChooseSection").then(m => ({ default: m.WhyChooseSection })));
const CourseOverviewSection = lazy(() => import("../components/Home/CourseOverviewSection").then(m => ({ default: m.CourseOverviewSection })));
const AccessSection = lazy(() => import("../components/Home/AccessSection"));
const OpportunitySection = lazy(() => import("../components/Home/OpportunitySection"));
const UpCommingCoureses = lazy(() => import("../components/Home/upCommingCoureses").then(m => ({ default: m.UpCommingCoureses })));
const TestimonialCarousel = lazy(() => import("../components/Home/TestimonialSection").then(m => ({ default: m.TestimonialCarousel })));
const FAQSection = lazy(() => import("../components/Home/FAQSection").then(m => ({ default: m.FAQSection })));
const EnrollSection = lazy(() => import("../components/Home/EnrollSection").then(m => ({ default: m.EnrollSection })));

const SectionPlaceholder = ({ height = "400px" }: { height?: string }) => (
  <div style={{ minHeight: height }} />
);

function LazySection({ children, height }: { children: React.ReactNode; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<SectionPlaceholder height={height} />}>
          {children}
        </Suspense>
      ) : (
        <SectionPlaceholder height={height} />
      )}
    </div>
  );
}

export const Home = () => {
  return (
    <div className="w-full h-full text-textPrimary text-center bg-bgPrimary">
      <main className="flex-grow">
        {/* Above fold — render immediately */}
        <IntroSection />
        <MetricScroller />
        <LogoScroller />
        <AudienceSection />

        {/* Below fold — lazy loaded when scrolled near */}
        <LazySection height="300px"><ComparisonSection /></LazySection>
        <LazySection height="600px"><ProvideSection /></LazySection>
        <LazySection height="500px"><PackageSection /></LazySection>
        <LazySection height="400px"><MoneySection /></LazySection>
        <LazySection height="600px"><BonusTimeline /></LazySection>
        <LazySection height="400px"><WhyChooseSection /></LazySection>
        <LazySection height="400px"><CourseOverviewSection /></LazySection>
        <LazySection height="400px"><AccessSection /></LazySection>
        <LazySection height="600px"><OpportunitySection /></LazySection>
        <LazySection height="400px"><UpCommingCoureses /></LazySection>
        <LazySection height="500px"><TestimonialCarousel /></LazySection>
        <LazySection height="300px"><FAQSection /></LazySection>
        <LazySection height="300px"><EnrollSection /></LazySection>
        <div className="w-full flex justify-center my-8">
          <EzoicAd placementId={101} />
        </div>
      </main>
    </div>
  );
};
