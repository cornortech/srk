import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    name: 'Nabin Sharma',
    role: 'Graphic Designer',
    content: 'From SRK University, I learned Adobe Photoshop design, which completely transformed my career. The hands-on assignments helped me build real-world skills and land a great job.',
    rating: 5,
    tasks: 220,
    earned: '₹14,000',
  },
  {
    name: 'Kiran Giri',
    role: 'Illustrator',
    content: 'Learning Adobe Illustrator at SRK University was a game changer. The structured assignments and practical approach helped me master design skills actually used in the industry.',
    rating: 5,
    tasks: 190,
    earned: '₹11,500',
  },
  {
    name: 'Sudip Aacharya',
    role: 'Video Editor',
    content: 'SRK University helped me master DaVinci Resolve with a practical learning approach. Thanks to this, I landed a solid video editing job with consistent career growth.',
    rating: 5,
    tasks: 260,
    earned: '₹16,000',
  },
];

export const TrustedByCreators = () => (
  <section id="reviews" className="py-24 px-6 bg-[#0a0705] border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto">

      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-5">
          Testimonials
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">
          Trusted by creators
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map(review => (
          <div
            key={review.name}
            className="bg-[#111008] rounded-xl border border-white/[0.07] p-6 flex flex-col hover:border-[#b68938]/15 transition-colors duration-200"
          >
            <Quote size={18} className="text-[#b68938]/30 mb-4" />

            <p className="text-sm text-white/55 leading-relaxed flex-1 mb-5">
              "{review.content}"
            </p>

            <div className="flex gap-1 mb-4">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={11} className="text-[#e1ba73] fill-[#e1ba73]" />
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div>
                <p className="text-sm font-bold text-white">{review.name}</p>
                <p className="text-xs text-white/35">{review.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#e1ba73] tabular-nums">{review.earned}</p>
                <p className="text-xs text-white/25">{review.tasks} tasks</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);
