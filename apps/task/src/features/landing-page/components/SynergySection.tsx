import { ArrowRight, DollarSign, Rocket, Target, Trophy, Users, Wallet } from 'lucide-react';

const cards = [
  {
    icon: Rocket,
    tag: 'SRK Grow',
    tagline: 'Premium growth engine',
    desc: 'Creators purchase authentic engagement to accelerate their social presence. Every order is fulfilled by real, verified users.',
    points: ['500+ daily orders', '99.8% success rate', 'Manual quality checks'],
  },
  {
    icon: DollarSign,
    tag: 'SRK Task',
    tagline: 'Progress platform',
    desc: 'Complete simple verified tasks and earn coins instantly. Every task creates real measurable value for creators.',
    points: ['Instant processing', '500+ tasks daily', 'Real-time tracking'],
  },
];

const stats = [
  { value: '500+', label: 'Active tasks', icon: Target },
  { value: '10L+', label: 'Monthly payouts', icon: Wallet },
  { value: '50K+', label: 'Verified users', icon: Users },
  { value: '99.9%', label: 'Success rate', icon: Trophy },
];

export const SynergySection = () => (
  <section id="synergy" className="py-24 px-6 bg-[#0a0705] border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto">

      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-5">
          Ecosystem
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight leading-[1.1]">
          Synergy of growth
        </h2>
        <p className="text-base text-white/45 mt-3 max-w-xl leading-relaxed">
          A perfect ecosystem loop: creators buy growth on <span className="text-white/75 font-semibold">SRK Grow</span>, which
          instantly creates paid tasks on <span className="text-white/75 font-semibold">SRK Task</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.tag}
              className="bg-[#111008] rounded-xl border border-white/[0.07] p-7 hover:border-[#b68938]/20 transition-colors duration-200 group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="p-2.5 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15">
                  <Icon size={16} className="text-[#e1ba73]" />
                </div>
                <span className="text-xs text-[#b68938]/60 font-medium px-2.5 py-1 rounded-full border border-[#b68938]/15 bg-[#b68938]/05">
                  {card.tagline}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{card.tag}</h3>
              <p className="text-sm text-white/45 leading-relaxed mb-5">{card.desc}</p>
              <ul className="flex flex-col gap-2">
                {card.points.map(pt => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm text-white/55">
                    <ArrowRight size={12} className="text-[#b68938]/60 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#111008] rounded-xl border border-white/[0.07] p-5 flex items-center gap-3.5">
              <div className="p-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15 flex-shrink-0">
                <Icon size={14} className="text-[#e1ba73]" />
              </div>
              <div>
                <p className="text-xl font-black text-white tabular-nums leading-none">{stat.value}</p>
                <p className="text-xs text-white/35 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  </section>
);
