import { BarChart3, Bot, Fingerprint, Globe, ShieldCheck, Zap } from 'lucide-react';

const features = [
  { icon: Bot, title: 'Zero Bot Tolerance', desc: 'AI filters reject 99.9% of automated traffic. Only real humans, real engagement.' },
  { icon: Fingerprint, title: '100% Verified Identities', desc: 'Every earner passes mandatory KYC verification via the SRK University portal.' },
  { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit encryption and secure escrow protect every transaction end-to-end.' },
  { icon: Zap, title: 'Instant Settlements', desc: 'No waiting periods. Earnings are credited to your wallet immediately.' },
  { icon: Globe, title: 'Global Reach', desc: 'Access a diverse network of active users ready to engage with your content.' },
  { icon: BarChart3, title: 'Transparent Analytics', desc: 'Real-time tracking of every action with granular, honest reporting.' },
];

export const TrustGrid = () => (
  <section id="trust" className="py-24 px-6 bg-[#0a0705] border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto">

      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-5">
          Trust &amp; Security
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight leading-[1.1]">
          Built on transparency
        </h2>
        <p className="text-base text-white/45 mt-3 max-w-lg leading-relaxed">
          Every layer of SRK Task is engineered for trust, from identity verification to payout processing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(feature => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-[#111008] rounded-xl border border-white/[0.07] p-6 hover:border-[#b68938]/20 transition-colors duration-200 group"
            >
              <div className="p-2.5 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15 w-fit mb-5 group-hover:bg-[#b68938]/15 transition-colors">
                <Icon size={15} className="text-[#e1ba73]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{feature.desc}</p>
            </div>
          );
        })}
      </div>

    </div>
  </section>
);
