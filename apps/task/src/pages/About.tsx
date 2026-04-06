import { motion } from 'framer-motion';
import { ArrowLeft, Target, Users, Shield, TrendingUp, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const About = () => {
  const universityUrl = import.meta.env.VITE_SRK_UNIVERSITY_URL || 'https://thesrkuniversity.com';
  
  const features = [
    {
      icon: Target,
      title: 'Verified Tasks',
      description: 'Complete authentic social media tasks from real brands and creators.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'AI-powered fraud detection with blockchain-verified transactions.',
    },
    {
      icon: TrendingUp,
      title: 'Real Earnings',
      description: 'Earn money for genuine engagement and social influence.',
    },
    {
      icon: Users,
      title: 'Exclusive Access',
      description: 'Limited to verified SRK University members only.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Members' },
    { value: '50,000+', label: 'Tasks Completed' },
    { value: '99.8%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' },
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
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-xl blur opacity-60" />
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center font-bold text-black text-3xl">
                  S
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              About <span className="text-[#e1ba73]">SRK Task</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              The premier social influence monetization platform, exclusively for SRK University members.
              Turn your engagement into earnings within a verified, secure ecosystem.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-white/5 bg-gradient-to-b from-black to-[#0a0705]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#e1ba73] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-[#e1ba73]" size={32} />
            <h2 className="text-4xl font-bold">Our Story</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                SRK Task is a product of <span className="text-white font-semibold">SRK Industries</span>, operating as an integrated extension of The SRK University ecosystem. We were built on the foundation that genuine social engagement deserves genuine reward.
              </p>
              <p>
                In a digital landscape saturated with bots and inauthentic interactions, SRK Task stands as a beacon of verified, human-driven engagement. Every member is a verified SRK University student who has completed mandatory KYC verification.
              </p>
              <p>
                This creates an ecosystem where brands and creators can trust the authenticity of every interaction, and where members can earn real income through legitimate task completion.
              </p>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Our mission is simple: <span className="text-white font-semibold">empower verified individuals to monetize their social influence</span> while providing brands with genuine, measurable engagement.
              </p>
              <p>
                SRK Task employs proprietary AI-based verification systems combined with human review to ensure zero tolerance for fraud, bots, or automated behavior. We've built blockchain-verified transaction records for complete transparency and tamper-proof accountability.
              </p>
              <p>
                Join thousands of verified members who are already earning through authentic engagement on SRK Task.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-12">
            <Zap className="text-[#e1ba73]" size={32} />
            <h2 className="text-4xl font-bold">Why Choose SRK Task</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                <div className="relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#e1ba73]/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center mb-4">
                    <feature.icon className="text-black" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-12">
            <Target className="text-[#e1ba73]" size={32} />
            <h2 className="text-4xl font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enroll at SRK University',
                description: `Complete enrollment and KYC verification at ${universityUrl.replace('https://', '')} to gain access.`,
              },
              {
                step: '02',
                title: 'Link Your Account',
                description: 'Connect your verified SRK University account to SRK Task and browse available tasks.',
              },
              {
                step: '03',
                title: 'Complete & Earn',
                description: 'Complete tasks honestly, get verified by our AI system, and earn directly to your wallet.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-[#e1ba73]/20 mb-4">{step.step}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Transparency - CRITICAL FOR AdSense */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-[#e1ba73]/30"
        >
          <h2 className="text-3xl font-bold mb-8">Business Transparency</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-[#e1ba73] mb-6">Our Business Identity</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="font-semibold">Platform Name:</span> SRK Task</p>
                <p><span className="font-semibold">Operating Company:</span> SRK Industries</p>
                <p><span className="font-semibold">Business Type:</span> Digital Engagement Platform</p>
                <p><span className="font-semibold">Headquarters:</span> Kathmandu, Bagmati Province, Nepal</p>
                <p><span className="font-semibold">Country:</span> Nepal</p>
                <p><span className="font-semibold">Contact Email:</span> support@srktask.com</p>
                <p><span className="font-semibold">Phone:</span> +977 976-9223013</p>
                <p><span className="font-semibold">Website:</span> srktask.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#e1ba73] mb-6">How Brands Fund Tasks</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Brands and content creators who want genuine social media engagement — real likes, authentic comments, honest reviews, and organic reach — pay SRK Task to connect them with verified human creators.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2">
                  <span className="text-[#e1ba73] font-bold">•</span>
                  <span>Brands submit tasks with defined budgets</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#e1ba73] font-bold">•</span>
                  <span>SRK Task verifies legitimacy and payment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#e1ba73] font-bold">•</span>
                  <span>Members complete tasks honestly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#e1ba73] font-bold">•</span>
                  <span>AI and human review verifies completion</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#e1ba73] font-bold">•</span>
                  <span>Members earn, brands get verified engagement</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Part of SRK Ecosystem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <h2 className="text-3xl font-bold mb-6">Part of the SRK Ecosystem</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              SRK Task is proudly operated by <span className="text-[#e1ba73] font-semibold">SRK Industries</span> and works seamlessly with The SRK University to provide a comprehensive digital ecosystem for education, verification, and monetization.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={universityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all"
              >
                Visit SRK University
              </a>
              <Link
                to="/"
                className="px-6 py-3 border border-white/20 text-white font-bold rounded-lg hover:border-[#e1ba73]/50 hover:text-[#e1ba73] transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold mb-12">Get in Touch</h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#e1ba73]/30 transition-colors">
              <p className="text-gray-400 mb-4 text-sm uppercase tracking-widest font-bold">Phone Support</p>
              <a href="tel:+977976922301" className="text-[#e1ba73] font-bold text-2xl hover:text-white transition-colors">
                +977 976-9223013
              </a>
              <p className="text-gray-500 text-sm mt-3">Available 24/7 for inquiries</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#e1ba73]/30 transition-colors">
              <p className="text-gray-400 mb-4 text-sm uppercase tracking-widest font-bold">Email Support</p>
              <a href="mailto:support@srktask.com" className="text-[#e1ba73] font-bold text-2xl hover:text-white transition-colors">
                support@srktask.com
              </a>
              <p className="text-gray-500 text-sm mt-3">Response within 24 hours</p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};
