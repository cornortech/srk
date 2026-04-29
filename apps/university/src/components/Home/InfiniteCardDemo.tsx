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
      "Passive experience unlocked! The Affiliate Program at THE SRK UNIVERSITY is a game-changer! I learned how to promote products online and earn commissions effortlessly. The clear tutorials on link strategies and audience targeting were super easy to follow. The platform’s intuitive design kept me motivated. It’s perfect for anyone wanting extra experience!",
    name: "Bishal Subedi",
    title: "Affiliate Program",
    theme: "Passive experience unlocked!",
    date: "2025-03-12",
  },
  {
    quote:
      "Money-making made simple! I’m amazed by THE SRK UNIVERSITY’s Affiliate Program! It taught me to build affiliate links and grow my earnings through blogs. The lessons are engaging, with practical tips I applied instantly. The mobile-friendly platform made learning flexible. This is a must for aspiring online entrepreneurs!",
    name: "Dibya Chettri",
    title: "Affiliate Program",
    date: "2025-03-12",
    theme: "Passive experience unlocked!",

  },
  {
    quote:
      "Best course out there! THE SRK UNIVERSITY’s Affiliate Program is unmatched in quality! The course breaks down affiliate marketing with crystal-clear videos and real-world strategies that outshine any competitor. I’m earning steady commissions thanks to its superior content. No other program comes close to this level of excellence!",
    name: "Sanup KC",
    title: "Affiliate Program",
    theme: "Best course out there!",
    date: "2025-03-11",

  },
  {
    quote:
      "Expert mentorship shines! The Affiliate Program’s learning experience at THE SRK UNIVERSITY is incredible! Seasoned industry mentors guide you through every step, sharing insider tips on affiliate success. Their expertise made complex strategies feel simple, and I’m now confidently building my experience. Truly top-tier guidance!",
    name: "Samip Chettri",
    title: "Affiliate Program",
    theme: "Expert mentorship shines!",
    date: "2025-03-11",
  },
];