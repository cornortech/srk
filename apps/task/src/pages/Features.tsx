import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, TrendingUp, Users, Lock, Bell, Wallet, Award, Target, BarChart3, RefreshCw, HeartHandshake, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant Task Updates',
      description: 'Access to new verified tasks updated multiple times daily. Get notified immediately when tasks matching your interests become available. Never miss a lucrative opportunity with our intelligent task matching algorithm.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Earnings',
      description: 'Complete visibility into your earnings, task history, and payment status. Track every rupee earned with detailed breakdowns. Know exactly how your money is being calculated and when it will be available.',
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Industry-leading 256-bit encryption protects all your data. Blockchain-verified transaction records ensure transparency and security. Multi-layer authentication keeps your account safe from unauthorized access.',
    },
    {
      icon: CheckCircle,
      title: 'AI-Powered Verification',
      description: 'Proprietary artificial intelligence system detects fraud and bot activity in real-time. Combined with human review for accuracy. Your honest work is always protected from competition by cheaters.',
    },
    {
      icon: TrendingUp,
      title: 'Profile Rating System',
      description: 'Build your reputation through consistent, honest task completion. Higher ratings unlock premium tasks with better payments. Achievement badges showcase your expertise and reliability to task creators.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: '24/7 support team ready to help with any questions or issues. Active community of verified users sharing tips and strategies. Learn from top performers and grow your earnings faster.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Customizable alerts for new tasks, earnings, and platform updates. Push notifications ensure you never miss high-paying opportunities. Set your preferences to get only the tasks you\'re interested in.',
    },
    {
      icon: Award,
      title: 'Exclusive Rewards Program',
      description: 'Earn bonus points for consistent performance and completing milestone achievements. Redeem points for extra earnings or premium features. Get special recognition as a top performer.',
    },
    {
      icon: Lock,
      title: 'Account Protection',
      description: 'Two-factor authentication adds extra security layer. Secure session management prevents unauthorized access. Automatic logout for idle sessions keeps your account protected.',
    },
    {
      icon: Wallet,
      title: 'Multiple Withdrawal Options',
      description: 'Choose from bank transfers, digital wallets, and other payment methods. Flexible minimum withdrawal amounts. Quick processing times - most withdrawals within 2-5 business days.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed dashboard showing your completion rates and earnings trends. Visual charts help you optimize your strategy. Compare your progress with platform averages.',
    },
    {
      icon: RefreshCw,
      title: 'Continuous Platform Updates',
      description: 'Regular feature additions and improvements based on user feedback. Platform optimized for both desktop and mobile. Always-latest technology for best performance.',
    },
  ];

  const comparisonFeatures = [
    { feature: 'Verified Users Only', included: true },
    { feature: 'KYC Verification', included: true },
    { feature: 'AI Fraud Detection', included: true },
    { feature: 'Real Brands & Creators', included: true },
    { feature: '24/7 Support', included: true },
    { feature: 'Secure Escrow System', included: true },
    { feature: 'Instant Notifications', included: true },
    { feature: 'Premium Task Access', included: true },
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
              Powerful <span className="text-[#e1ba73]">Features</span>
            </h1>
            <p className="text-xl text-gray-400">
              Everything you need to succeed and earn more on the world's fastest-growing 
              social influence monetization platform designed exclusively for SRK University members.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-8 hover:border-[#e1ba73]/50 transition-all duration-300 group"
              >
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                  <div className="relative w-14 h-14 rounded-lg bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center">
                    <Icon className="text-black" size={28} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="border-y border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Why SRK Task Stands Out
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              We're not just another task platform. SRK Task combines cutting-edge technology, 
              verified users, and real opportunities to create an unmatched earning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">Verified Ecosystem</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="text-[#e1ba73] flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">KYC Verified Members Only</h4>
                    <p className="text-gray-400">Every user is vetted through SRK University, ensuring a safe and trustworthy community.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="text-[#e1ba73] flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Real Brands & Creators</h4>
                    <p className="text-gray-400">Tasks come from verified, legitimate brands and content creators, not third-party resellers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="text-[#e1ba73] flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Zero Bot Tolerance</h4>
                    <p className="text-gray-400">Our AI system automatically detects and eliminates bot users, protecting your earnings.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">Maximum Earning Potential</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <TrendingUp className="text-[#e1ba73] flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Premium Task Access</h4>
                    <p className="text-gray-400">Higher-rated users unlock exclusive tasks with better payments and more flexibility.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <TrendingUp className="text-[#e1ba73] flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Bonus Rewards Program</h4>
                    <p className="text-gray-400">Earn bonus points and receive special recognition for consistent high performance.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <TrendingUp className="text-[#e1ba73] flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Smart Recommendations</h4>
                    <p className="text-gray-400">AI algorithm recommends tasks perfectly matched to your interests and earning goals.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Included Features Checklist */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What's Included in SRK Task</h2>
          <p className="text-gray-400">All features are included for every verified member - no hidden tiers or premium subscriptions required.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-8">
          {comparisonFeatures.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (index % 2) * 0.1 }}
              className="flex items-center gap-3 py-2"
            >
              <CheckCircle className="text-[#e1ba73] flex-shrink-0" size={20} />
              <span className="font-medium">{item.feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Join thousands of verified SRK members already earning money through social influence. 
              Start with SRK University enrollment and unlock your earning potential today.
            </p>
            <Link
              to="/how-it-works"
              className="inline-block bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Import CheckCircle from lucide-react
import { CheckCircle } from 'lucide-react';

export default Features;
