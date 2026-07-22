import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { IntroSection } from "../components/Home/IntroSection";
import MetricScroller from "../components/Home/MetricsData";
import { AudienceSection } from "../components/Home/AudienceSection";
import { useAOS } from "../lib/aos";

// LogoScroller pulls ~20 logo images from 9 different third-party domains
// (each needing its own DNS/TCP/TLS handshake). It sits just below the hero,
// so an IntersectionObserver won't meaningfully delay it — it's deferred
// until after window "load" instead, so it never competes with the hero
// image / critical JS for bandwidth during the LCP window.
const LogoScroller = lazy(() => import("../components/Home/LogoScroll"));

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

  // Below-fold sections are the only place Home renders data-aos elements,
  // so load AOS lazily here instead of unconditionally on every page load.
  useAOS();

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

// Unlike LazySection (which waits for scroll proximity), this waits for the
// page to finish loading, regardless of scroll position — for content that's
// visible near the fold but must not compete with the hero image for
// bandwidth while LCP is still being measured.
function DeferredSection({ children, height }: { children: React.ReactNode; height?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        setTimeout(() => setReady(true), 1000);
      }
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
      return () => window.removeEventListener("load", start);
    }
  }, []);

  return ready ? (
    <Suspense fallback={<SectionPlaceholder height={height} />}>{children}</Suspense>
  ) : (
    <SectionPlaceholder height={height} />
  );
}

export const Home = () => {
  return (
    <div className="w-full h-full text-textPrimary text-center bg-bgPrimary">
      <main className="flex-grow">
        {/* Above fold — render immediately */}
        <IntroSection />
        <MetricScroller />
        <DeferredSection height="120px"><LogoScroller /></DeferredSection>
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
      </main>
    </div>
  );
};
