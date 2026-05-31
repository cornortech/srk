import { ArrowLeft, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const allReviews = [
  { quote: "Kickstarted my creativity! The Basic Package at THE SRK UNIVERSITY is fantastic! Photoshop helped me edit stunning photos for my business's social media. Illustrator made logo design easy and fun. Communication Skills boosted my client pitches. The platform's clear videos and user-friendly design made learning a breeze. Perfect for beginners!", name: "Rohit Chettri", package: "Basic Package", date: "June 2025", rating: 5 },
  { quote: "Great start to design! I love the Basic Package! Photoshop's editing tools let me create posters for events. Illustrator taught me vector art for digital illustrations. Communication Skills improved my meeting confidence. THE SRK UNIVERSITY is intuitive, with engaging lessons that work on any device. A must for new designers!", name: "Arjun Thapa", package: "Basic Package", date: "April 2025", rating: 5 },
  { quote: "Elevated my skills! The Standard Package is amazing! Photoshop and Illustrator helped me design professional flyers and logos. Communication Skills improved my client talks. Graphic Design taught me color and layout tricks. THE SRK UNIVERSITY offers engaging videos and flexible pacing. Ideal for aspiring designers!", name: "Anjali Shrestha", package: "Standard Package", date: "April 2025", rating: 5 },
  { quote: "Awesome design boost! Standard Package rocks! Photoshop creates bold blog images, and Illustrator crafts sleek logos. Communication Skills helped me close deals. Graphic Design showed me visual balance. THE SRK UNIVERSITY's smooth interface and clear lessons made learning fun. My work's never looked better!", name: "Rabin Gurung", package: "Standard Package", date: "March 2025", rating: 5 },
  { quote: "Creative game-changer! The Standard Package is a gem! Photoshop and Illustrator transformed my shop graphics. Communication Skills made client feedback easy. Graphic Design simplified typography and layout. THE SRK UNIVERSITY's high-quality videos and progress tracker kept me hooked. My designs shine now!", name: "Suman Tamang", package: "Standard Package", date: "March 2025", rating: 5 },
  { quote: "Career supercharge! Premium Package is a winner! Photoshop and Illustrator create pro-level graphics for my brand. Communication Skills sharpened my pitches. Digital Marketing boosted my site's traffic with SEO. Premiere Pro made slick videos. THE SRK UNIVERSITY's seamless platform and great lessons deliver. Love it!", name: "Dipesh Lama", package: "Premium Package", date: "June 2025", rating: 5 },
  { quote: "So many wins! I'm thrilled with the Premium Package! Photoshop and Illustrator revamped my portfolio. Communication Skills nailed client meetings. Digital Marketing grew my store's sales via ads. Premiere Pro crafted a cool YouTube intro. THE SRK UNIVERSITY's mobile-friendly lessons are top-notch. Highly recommend!", name: "Sumit Rai", package: "Premium Package", date: "April 2025", rating: 5 },
  { quote: "Ultimate creative kit! Pro Package is phenomenal! Photoshop and Illustrator launched my freelance designs. Communication Skills won clients over. Graphic Design polished my visuals. Digital Marketing doubled my reach. Premiere Pro, DaVinci Resolve, and After Effects made cinematic videos and animations. THE SRK UNIVERSITY's vibrant lessons rock!", name: "Nischal Bhattarai", package: "Pro Package", date: "April 2025", rating: 5 },
  { quote: "Top-tier value! The Pro Package is unreal! Photoshop and Illustrator built my startup's graphics. Communication Skills smoothed client deals. Graphic Design enhanced my style. Digital Marketing spiked ad success. Premiere Pro, DaVinci Resolve, and After Effects created festival-ready films. THE SRK UNIVERSITY's platform shines!", name: "Kiran Pokharel", package: "Pro Package", date: "April 2025", rating: 5 },
  { quote: "Life-changing skills! Pro Package is the best! Photoshop and Illustrator craft agency-quality logos. Communication Skills boosted my contracts. Graphic Design refined my visuals. Digital Marketing grew my blog's traffic. Premiere Pro, DaVinci Resolve, and After Effects made music videos and animations pop. Flawless lessons!", name: "Bikash Karki", package: "Pro Package", date: "March 2025", rating: 5 },
  { quote: "The learning experience at THE SRK UNIVERSITY is incredible! Seasoned industry mentors guide you through every step, sharing insider tips that made complex strategies feel simple. I'm now confidently building my skills. Truly top-tier guidance from people who genuinely know what they're talking about!", name: "Samip Chettri", package: "Partner Programme", date: "March 2025", rating: 5 },
  { quote: "THE SRK UNIVERSITY's programme is unmatched in quality! The course breaks down skill development with crystal-clear videos and real-world strategies. I've applied what I learned from week one. No other platform comes close to this level of practical, immediately applicable instruction.", name: "Sanup KC", package: "Partner Programme", date: "March 2025", rating: 5 },
  { quote: "Amazing learning experience! I'm amazed by THE SRK UNIVERSITY. It taught me practical techniques I applied instantly. The mobile-friendly platform made learning flexible and accessible from anywhere. This is a must for anyone wanting to develop serious, marketable skills.", name: "Dibya Chettri", package: "Partner Programme", date: "March 2025", rating: 5 },
  { quote: "The community at SRK University is genuinely supportive. I had questions at every stage and got clear, helpful answers every time. The combination of structured curriculum and real community support made the difference between giving up and actually finishing what I started.", name: "Bishal Subedi", package: "Partner Programme", date: "March 2025", rating: 5 },
];

const packageColors: Record<string, string> = {
  "Basic Package": "border-white/20 text-white/40",
  "Standard Package": "border-primary/25 text-primary/60",
  "Premium Package": "border-primary/35 text-primary/70",
  "Pro Package": "border-primary/50 text-primary",
  "Partner Programme": "border-white/20 text-white/40",
};

export default function AllReviewsPage() {
  const packageCounts = allReviews.reduce<Record<string, number>>((acc, r) => {
    acc[r.package] = (acc[r.package] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary to-bgPrimary" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Student Stories</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            What Our Students Are Saying
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Real reviews from real learners. Every testimonial below comes from a student who enrolled in SRK
            University and experienced the curriculum first-hand.
          </p>
        </div>
      </section>

      {/* Package breakdown */}
      <section className="py-10 px-4 sm:px-6 border-b border-white/[0.06] bg-bgSecondary">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(packageCounts).map(([pkg, count]) => (
              <div
                key={pkg}
                className={`relative px-4 py-2 rounded-full border text-sm font-medium overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${packageColors[pkg] || "border-white/15 text-white/35"}`}
              >
                {pkg} · {count} review{count !== 1 ? "s" : ""}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allReviews.map((review, i) => (
              <div
                key={i}
                className="group relative border border-white/[0.07] bg-bgSecondary rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.11)] transition-all duration-500 flex flex-col"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={String((i % 3) * 80)}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
                <div className="absolute top-0 left-0 w-1/2 h-20 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                <div className="relative p-6 flex flex-col gap-4 flex-1">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote icon */}
                  <Quote className="w-5 h-5 text-primary/30" />

                  {/* Quote text */}
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{review.quote}</p>

                  {/* Author */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{review.name}</p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${packageColors[review.package] || "border-white/15 text-white/30"}`}>
                        {review.package}
                      </span>
                    </div>
                    <p className="text-white/25 text-xs shrink-0">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/[0.06] bg-bgSecondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join a Growing Community of Learners</h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Every review above represents a real person who made the decision to invest in their skills and
            showed up consistently. The results speak for themselves. Yours can too.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-custom-gradient text-black font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(182,137,56,0.3)]"
          >
            View Learning Packages
          </Link>
        </div>
      </section>
    </div>
  );
}
