import { ProvideSection } from "../components/Home/WhatYouWillLearn";
import { EzoicAd } from "../components/EzoicAd";
import { FAQSection } from "../components/Home/FAQSection";
import { TestimonialCarousel } from "../components/Home/TestimonialSection";
import { EnrollSection } from "../components/Home/EnrollSection";
import { IntroSection } from "../components/Home/IntroSection";
import { PackageSection } from "../components/Home/package";
// import { InstructorCarousel } from "../components/Home/instructor";
import { MoneySection } from "../components/Home/moneySection";
import OpportunitySection from "../components/Home/OpportunitySection";
import { WhyChooseSection } from "../components/Home/WhyChooseSection";
import { AudienceSection } from "../components/Home/AudienceSection";
import { ComparisonSection } from "../components/Home/Comparison";
import { UpCommingCoureses } from "../components/Home/upCommingCoureses";
import AccessSection from "../components/Home/AccessSection";
import LogoScroller from "../components/Home/LogoScroll";
import MetricScroller from "../components/Home/MetricsData";
import BonusTimeline from "../components/Home/Bonuses";
import { CourseOverviewSection } from "../components/Home/CourseOverviewSection";

export const Home = () => {
  return (
    <div className="w-full h-full text-textPrimary text-center  bg-bgPrimary">
      <main className="flex-grow ">
        <IntroSection />
        {/* <StatsSection /> */}
        <MetricScroller />
        <LogoScroller />
        <AudienceSection />
        <ComparisonSection />
        <ProvideSection />
        <PackageSection />
        <MoneySection />
        <BonusTimeline />
        <WhyChooseSection />
        <CourseOverviewSection />
        <AccessSection />
        <OpportunitySection />
        <UpCommingCoureses />
        <TestimonialCarousel />
        <FAQSection />
        <EnrollSection />
        <div className="w-full flex justify-center my-8">
          <EzoicAd placementId={101} />
        </div>
      </main>
    </div>
  );
};
