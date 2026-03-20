import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, DollarSign, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Join SRK University',
      description: 'Complete enrollment at The SRK University and pass the mandatory KYC (Know Your Customer) verification process. This ensures all users are verified and accountable.',
      details: 'Your identity verification includes document uploads, address verification, and background checks. This typically takes 24-48 hours.',
      icon: Users,
    },
    {
      number: '2',
      title: 'Link Your Account',
      description: 'Once verified through SRK University, link your account to SRK Task using your university credentials. The integration is seamless and takes just a few minutes.',
      details: 'Account linking is secure and encrypted. You\'ll receive a confirmation email once your accounts are successfully linked.',
      icon: CheckCircle,
    },
    {
      number: '3',
      title: 'Browse Available Tasks',
      description: 'Access your personalized task dashboard showing all available social influence tasks curated specifically for SRK members. Tasks are updated regularly with new opportunities.',
      details: 'Filter tasks by category, payment amount, difficulty level, and estimated completion time. Popular tasks fill up fast, so check back frequently.',
      icon: Zap,
    },
    {
      number: '4',
      title: 'Complete Tasks Honestly',
      description: 'Select a task and complete it according to the detailed instructions provided. Genuine engagement and authentic interaction are essential for task approval.',
      details: 'Tasks range from social media engagement (likes, shares, comments) to content creation and follower growth activities. All work must be original and honest.',
      icon: CheckCircle,
    },
    {
      number: '5',
      title: 'Submit Proof of Completion',
      description: 'Submit proof that you\'ve completed the task. This might include screenshots, links, or other verification as requested. Our system uses AI-powered verification combined with human review.',
      details: 'Clear, honest proof submissions are processed quickly. Suspicious submissions will be flagged for manual review, which may take longer.',
      icon: Shield,
    },
    {
      number: '6',
      title: 'Earn & Withdraw',
      description: 'Once verified, earnings are credited to your SRK Task wallet. Accumulate earnings and withdraw them whenever you reach the minimum threshold through your preferred payment method.',
      details: 'Earnings typically appear in your wallet within 1-24 hours. Withdrawals are processed within 2-5 business days depending on your chosen payment method.',
      icon: DollarSign,
    },
    {
      number: '7',
      title: 'Level Up & Unlock Premium',
      description: 'As you complete more tasks successfully, your profile rating increases, unlocking access to premium tasks with higher payments and exclusive opportunities.',
      details: 'Top performers get priority access to lucrative tasks. Build your reputation through consistent, honest work to maximize earning potential.',
      icon: TrendingUp,
    },
  ];

  const features = [
    {
      title: 'AI-Powered Verification',
      description: 'Our proprietary AI system detects fraud and bot activity in real-time, ensuring platform integrity and protecting legitimate users.',
      icon: Shield,
    },
    {
      title: 'Instant Task Updates',
      description: 'New tasks are added regularly throughout the day. Stay updated and never miss earning opportunities with instant notifications.',
      icon: Zap,
    },
    {
      title: 'Secure Payments',
      description: 'All transactions use 256-bit encryption and blockchain verification for maximum security. Your earnings are always protected.',
      icon: DollarSign,
    },
    {
      title: 'Transparent Earnings',
      description: 'Complete visibility into your task history, earnings, and payment status. Know exactly how much you\'ve earned every step of the way.',
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
              Seven simple steps to start earning from your social influence. Transform your engagement 
              into real income with SRK Task's transparent and secure platform.
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
