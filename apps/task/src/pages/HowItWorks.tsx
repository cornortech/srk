import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, DollarSign, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Join SRK University and Complete KYC',
      description: 'Before accessing SRK Task, complete enrollment at SRK University and pass mandatory KYC (Know Your Customer) verification using government-issued identity documents. This is what makes every member on SRK Task a verified, accountable individual.',
      details: 'KYC typically takes 24-48 hours. You\'ll need a government-issued photo ID, proof of address, and a clear selfie. Use the exact name from your government ID during enrollment.',
      icon: Users,
    },
    {
      number: '2',
      title: 'Link Your SRK University Account to SRK Task',
      description: 'Once your KYC is confirmed, linking your account to SRK Task is a one-time process taking under five minutes. Your verified identity, profile rating, and task history all live in one ecosystem.',
      details: 'Visit srktask.com, click "Link Account", and authenticate using your SRK University credentials. Your SRK User profile is created automatically using your university verification data.',
      icon: CheckCircle,
    },
    {
      number: '3',
      title: 'Explore Your Personalized Task Dashboard',
      description: 'Your SRK Task dashboard is personalized from day one. Tasks are matched to your social media platforms, engagement history, skill level, and preferences. Browse tasks filtered by category, difficulty, payment, and time estimate.',
      details: 'Common task categories include social media engagement, content review, testimonials, surveys, brand awareness, and community participation. New tasks are added throughout the day. Check your dashboard at least twice daily for best availability.',
      icon: Zap,
    },
    {
      number: '4',
      title: 'Complete Tasks Honestly and Thoroughly',
      description: 'Accept only tasks you can complete honestly. Read every task description carefully. Do not rush. Follow every instruction exactly. If you\'re asked to comment on a post, make it genuine and specific, not generic phrases.',
      details: 'Every task is reviewed by both AI-assisted verification and human review. Quality matters more than volume. Authentic effort gets approved. Shortcuts get flagged. Any use of bots or VPNs results in immediate account suspension.',
      icon: CheckCircle,
    },
    {
      number: '5',
      title: 'Submit Clear Proof of Completion',
      description: 'After completing a task, submit your proof as specified in the task instructions. Proof may include screenshots, links to your public activity, written summaries, or other documentation. Good proof is clear, readable, and matches requirements exactly.',
      details: 'Submit proof promptly after completion. Blurry screenshots, incomplete submissions, and delayed uploads are the most common causes of rejection. Take an extra 60 seconds to review your submission before uploading. Good habits prevent rejections.',
      icon: Shield,
    },
    {
      number: '6',
      title: 'Earn, Track, and Withdraw Your Earnings',
      description: 'After verification and approval, earnings are credited to your SRK Task wallet within 1-24 hours. Track everything from your dashboard: pending earnings, approved earnings, available balance, and full withdrawal history. No hidden deductions.',
      details: 'When your balance reaches the minimum withdrawal threshold, request a withdrawal to your bank account or digital wallet. Withdrawals are typically processed within 1-3 business days. SRK Task charges no platform fees on withdrawals.',
      icon: DollarSign,
    },
    {
      number: '7',
      title: 'Build Your Reputation and Unlock Premium Opportunities',
      description: 'Your profile rating is calculated from five factors: task completion rate, proof quality, approval rate, consistency, and community standing. Higher ratings unlock access to premium tasks with 2-3x higher payments and exclusive brand partnerships.',
      details: 'Premium tier is where long-term earnings are built. Members who consistently perform well across 30-50 tasks typically see available task value increase significantly. The platform rewards genuine commitment, not volume alone.',
      icon: TrendingUp,
    },
  ];

  const features = [
    {
      title: 'Real-Time Task Feed with Smart Matching',
      description: 'Your task feed is personalized to your profiles, engagement history, skill level, and availability. Algorithm-matched tasks surface at the top before lower-relevance opportunities.',
      icon: Shield,
    },
    {
      title: 'Complete Earnings Transparency',
      description: 'Your dashboard shows pending earnings, confirmed balances, full task history with payment status, and earnings breakdown by category. No hidden deductions, no surprises.',
      icon: Zap,
    },
    {
      title: 'AI-Assisted & Human-Reviewed Verification',
      description: 'Fast automated verification combines with human judgment for edge cases. If flagged by AI, request human review. Dual-layer approach ensures speed and fairness.',
      icon: DollarSign,
    },
    {
      title: 'Multi-Layer Security Infrastructure',
      description: '256-bit SSL encryption, multi-factor authentication, blockchain-verified transaction records, real-time anomaly detection, and automatic alerts. Your data protected like a financial platform.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0705] via-transparent to-black opacity-50" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              How <span className="text-[#e1ba73]">It Works</span>
            </h1>
            <p className="text-xl text-gray-400">
              Seven clear steps from SRK University enrollment to your first task withdrawal. Understanding the process thoroughly is the single most important factor in early success on the platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="flex gap-8">
                  {/* Number and Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full blur opacity-60" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center">
                        <Icon className="text-black" size={32} />
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-[#e1ba73] to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-3xl font-bold mb-2">
                      Step {step.number}: {step.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-4">{step.description}</p>
                    <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm"><span className="text-[#e1ba73] font-semibold">Note:</span> {step.details}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="border-y border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose <span className="text-[#e1ba73]">SRK Task</span>?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-8 hover:border-[#e1ba73]/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-lg blur opacity-60" />
                      <div className="relative w-12 h-12 rounded-lg bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center">
                        <Icon className="text-black" size={24} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Questions?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Check out our comprehensive FAQ or reach out to our support team for personalized assistance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/faq"
              className="inline-block bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all duration-300"
            >
              View FAQ
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-lg hover:border-[#e1ba73]/50 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};
