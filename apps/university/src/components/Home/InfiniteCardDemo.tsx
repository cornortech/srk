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
      "Kickstarted my creativity! The Basic Package at THE SRK UNIVERSITY is fantastic! Photoshop helped me edit stunning photos for my business’s social media. Illustrator made logo design easy and fun. Communication Skills boosted my client pitches. The platform’s clear videos and user-friendly design made learning a breeze. Perfect for beginners!",
    name: "Rohit Chettri",
    title: "Basic Package",
    theme: "Kickstarted my creativity!",
    date: "2025-06-20",
  },
  {
    quote:
      "Great start to design! I love the Basic Package! Photoshop’s editing tools let me create posters for events. Illustrator taught me vector art for digital illustrations. Communication Skills improved my meeting confidence. THE SRK UNIVERSITY is intuitive, with engaging lessons that work on any device. A must for new designers!",
    name: "Arjun Thapa",
    title: "Basic Package",
    theme: "Great start to design!",
    date: "2025-04-21",
  },
  {
    quote:
      "Elevated my skills! The Standard Package is amazing! Photoshop and Illustrator helped me design professional flyers and logos. Communication Skills improved my client talks. Graphic Design taught me color and layout tricks. THE SRK UNIVERSITY offers engaging videos and flexible pacing. Ideal for aspiring designers!",
    name: "Anjali Shrestha",
    title: "Standard Package",
    theme: "Elevated my skills!",
    date: "2025-04-21",
  },
  {
    quote:
      "Awesome design boost! Standard Package rocks! Photoshop creates bold blog images, and Illustrator crafts sleek logos. Communication Skills helped me close deals. Graphic Design showed me visual balance. THE SRK UNIVERSITY’s smooth interface and clear lessons made learning fun. My work’s never looked better!",
    name: "Rabin Gurung",
    title: "Standard Package",
    theme: "Awesome design boost!",
    date: "2025-03-21",
  },
  {
    quote:
      "Creative game-changer! The Standard Package is a gem! Photoshop and Illustrator transformed my Etsy shop graphics. Communication Skills made client feedback easy. Graphic Design simplified typography and layout. THE SRK UNIVERSITY’s high-quality videos and progress tracker kept me hooked. My designs shine now!",
    name: "Suman Tamang",
    title: "Standard Package",
    theme: "Creative game-changer!",
    date: "2025-03-12",
  },
];

const testimonialsSecondHalf = [
  {
    quote:
      "Career supercharge! Premium Package is a winner! Photoshop and Illustrator create pro-level graphics for my brand. Communication Skills sharpened my pitches. Digital Marketing boosted my site’s traffic with SEO. Premiere Pro made slick startup videos. THE SRK UNIVERSITY’s seamless platform and great lessons deliver. Love it!",
    name: "Dipesh Lama",
    title: "Premium Package",
    theme: "Career supercharge!",
    date: "2025-06-20",
  },
  {
    quote:
      "So many wins! I’m thrilled with the Premium Package! Photoshop and Illustrator revamped my portfolio. Communication Skills nailed client meetings. Digital Marketing grew my store’s sales via ads. Premiere Pro crafted a cool YouTube intro. THE SRK UNIVERSITY’s mobile-friendly lessons are top-notch. Highly recommend!",
    name: "Sumit Rai",
    title: "Premium Package",
    theme: "So many wins!",
    date: "2025-04-21",
  },
  {
    quote:
      "Ultimate creative kit! Pro Package is phenomenal! Photoshop and Illustrator launched my freelance designs. Communication Skills won clients over. Graphic Design polished my visuals. Digital Marketing doubled my Instagram reach. Premiere Pro, DaVinci Resolve, and After Effects made cinematic videos and animations. THE SRK UNIVERSITY’s vibrant lessons rock!",
    name: "Nischal Bhattarai",
    title: "Pro Package",
    theme: "Ultimate creative kit!",
    date: "2025-04-11",
  },
  {
    quote:
      "Top-tier value! The Pro Package is unreal! Photoshop and Illustrator built my startup’s graphics. Communication Skills smoothed client deals. Graphic Design enhanced my style. Digital Marketing spiked ad success. Premiere Pro, DaVinci Resolve, and After Effects created festival-ready films and graphics. THE SRK UNIVERSITY’s platform shines!",
    name: "Kiran Pokharel",
    title: "Pro Package",
    theme: "Top-tier value!",
    date: "2025-04-03",

  },
  {
    quote:
      "Life-changing skills! Pro Package is the best! Photoshop and Illustrator craft agency-quality logos. Communication Skills boosted my contracts. Graphic Design refined my visuals. Digital Marketing grew my blog’s traffic. Premiere Pro, DaVinci Resolve, and After Effects made music videos and animations pop. THE SRK UNIVERSITY’s lessons are flawless!",
    name: "Bikash Karki",
    title: "Pro Package",
    theme: "Life-changing skills!",
    date: "2025-03-20",

  },
  {
    quote:
      "The learning experience at THE SRK UNIVERSITY is incredible! Seasoned industry mentors guide you through every step, sharing insider tips that made complex strategies feel simple. I am now confidently building my skills. Truly top-tier guidance from people who genuinely know what they are talking about!",
    name: "Bishal Subedi",
    title: "Partner Programme",
    theme: "Expert mentorship shines!",
    date: "2025-03-12",
  },
  {
    quote:
      "THE SRK UNIVERSITY’s programme is unmatched in quality! The course breaks down skill development with crystal-clear videos and real-world strategies. I have applied what I learned from week one. No other platform comes close to this level of practical, immediately applicable instruction.",
    name: "Dibya Chettri",
    title: "Partner Programme",
    date: "2025-03-12",
    theme: "Best course out there!",

  },
  {
    quote:
      "Amazing learning experience! The curriculum taught me practical techniques I applied instantly. The mobile-friendly platform made learning flexible and accessible from anywhere. This is a must for anyone wanting to develop serious, marketable creative skills.",
    name: "Sanup KC",
    title: "Partner Programme",
    theme: "Skills that last a lifetime!",
    date: "2025-03-11",

  },
  {
    quote:
      "The community at SRK University is genuinely supportive. I had questions at every stage and got clear, helpful answers every time. The combination of structured curriculum and real community support made the difference between giving up and actually finishing what I started.",
    name: "Samip Chettri",
    title: "Partner Programme",
    theme: "Community that lifts you up!",
    date: "2025-03-11",
  },
];