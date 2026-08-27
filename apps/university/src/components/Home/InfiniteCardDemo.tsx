"use client";

import { InfiniteMovingCards } from "./Scroll";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[42rem] rounded-md flex flex-col antialiased bg-white dark:bg-bgTernary dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonialsFirstHalf}
        direction="right"
        speed="slow"
        pauseOnHover
        index={1}
      />
      <InfiniteMovingCards
        items={testimonialsSecondHalf}
        direction="left"
        speed="slow"
        pauseOnHover
        index={2}
      />
    </div>
  );
}

const testimonialsFirstHalf = [
  {
    quote:
      "The lessons are clear, practical, and easy to follow. I was able to improve my Photoshop and Illustrator skills by working on real projects instead of only watching videos.",
    name: "Graphic Design Student",
    title: "Graphic Design Student",
    theme: "A Well-Organized Learning Platform",
    date: "2025-06-20",
  },
  {
    quote:
      "The flexible learning schedule allowed me to study after work. The Digital Marketing course gave me practical knowledge that I could apply to my daily tasks.",
    name: "Marketing Executive",
    title: "Marketing Executive",
    theme: "Helpful for Career Development",
    date: "2025-04-21",
  },
  {
    quote:
      "I joined the video editing courses with no previous experience. The step-by-step lessons made learning simple, and I now edit videos with much more confidence.",
    name: "Content Creator",
    title: "Content Creator",
    theme: "Easy to Learn and Apply",
    date: "2025-04-21",
  },
  {
    quote:
      "The instructors explain every topic clearly, and the course materials are well structured. I especially enjoyed the practical exercises and live learning sessions.",
    name: "Freelance Designer",
    title: "Freelance Designer",
    theme: "Professional Course Content",
    date: "2025-03-21",
  },
  {
    quote:
      "The platform is easy to use, and the lessons are engaging. I appreciated the support from the instructors whenever I had questions.",
    name: "University Student",
    title: "University Student",
    theme: "Great Learning Experience",
    date: "2025-03-12",
  },
];

const testimonialsSecondHalf = [
  {
    quote:
      "The courses focus on real-world skills rather than theory alone. I found the learning experience valuable for both my career and personal development.",
    name: "Small Business Owner",
    title: "Small Business Owner",
    theme: "Practical and Informative",
    date: "2025-06-20",
  },
  {
    quote:
      "The membership gave me access to several useful courses in one place. The combination of live sessions and self-paced learning worked perfectly for my schedule.",
    name: "Entrepreneur",
    title: "Entrepreneur",
    theme: "Worth the Investment",
    date: "2025-04-21",
  },
  {
    quote:
      "The instructors shared practical examples that made every lesson easier to understand. I always received helpful guidance whenever I needed assistance.",
    name: "Web Development Learner",
    title: "Web Development Learner",
    theme: "Excellent Instructor Support",
    date: "2025-04-11",
  },
  {
    quote:
      "Being able to learn at my own pace made a big difference. The course structure was simple, organized, and suitable for busy professionals.",
    name: "Working Professional",
    title: "Working Professional",
    theme: "Flexible Online Learning",
    date: "2025-04-03",
  },
  {
    quote:
      "SRK University offers quality courses with practical lessons that are easy to understand. It has been a valuable resource for improving my professional skills.",
    name: "Digital Skills Learner",
    title: "Digital Skills Learner",
    theme: "Highly Recommended Learning Platform",
    date: "2025-03-20",
  },
];