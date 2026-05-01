import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const GettingStarted = () => {
  const steps = [
    {
      number: '1',
      title: 'Enroll at SRK University',
      description: 'Start at The SRK University (thesrkuniversity.com) and complete your enrollment process. This is the first requirement for accessing SRK Task.',
      details: [
        'Visit The SRK University website',
        'Click "Enroll Now" and follow the registration steps',
        'Provide your basic personal information accurately',
        'Create a strong password for your account',
        'Verify your email address to confirm enrollment',
      ],
      tips: 'Make sure to use accurate information - this will be cross-referenced during KYC verification.',
      icon: '📝',
    },
    {
      number: '2',
      title: 'Complete KYC Verification',
      description: 'Pass the mandatory Know Your Customer (KYC) verification process. This ensures platform security and compliance.',
      details: [
        'Navigate to the KYC section in your university dashboard',
        'Upload a valid government-issued ID (passport, driver\'s license, national ID)',
        'Submit a clear photo or video proof of identity',
        'Provide address verification (utility bill or official document)',
        'Answer security questions accurately',
        'Wait 24-48 hours for verification processing',
      ],
      tips: 'Ensure all documents are clear, unblurred, and show your face. Blurry images may delay verification.',
      icon: '✓',
    },
    {
      number: '3',
      title: 'Link Your SRK Task Account',
      description: 'Once verified, link your account to SRK Task using your SRK University credentials.',
      details: [
        'Go to srktask.com and click "Link Account"',
        'Enter your SRK University email address',
        'Enter your SRK University password',
        'Authorize the connection between platforms',
        'Review the linked account details',
        'Confirm the connection to complete linking',
      ],
      tips: 'Your accounts are now securely linked. Use your SRK University credentials to log in to SRK Task.',
      icon: '🔗',
    },
    {
      number: '4',
      title: 'Complete Your Profile',
      description: 'Set up your SRK Task profile to maximize earning opportunities and match with suitable tasks.',
      details: [
        'Upload a professional profile picture (clear headshot)',
        'Write a compelling bio highlighting your interests',
        'Select your area of expertise (content creation, social media, etc.)',
        'Choose your preferred social media platforms',
        'Set your timeline preferences (hours available)',
        'Enable notifications for task updates',
      ],
      tips: 'A complete profile attracts more task opportunities. Ensure your photo is recent and professional.',
      icon: '👤',
    },
    {
      number: '5',
      title: 'Explore Your Dashboard',
      description: 'Get familiar with the SRK Task dashboard and available features.',
      details: [
        'Review available tasks in your dashboard',
        'Check task details before selecting one',
        'Review your wallet and earnings section',
        'Explore analytics and performance metrics',
        'Customize your notification preferences',
        'Bookmark your favorite task types',
      ],
      tips: 'Tasks are updated regularly. Check your dashboard daily for new opportunities.',
      icon: '📊',
    },
    {
      number: '6',
      title: 'Select Your First Task',
      description: 'Choose a task that matches your interests and skills for your first attempt.',
      details: [
        'Browse available tasks in your feed',
        'Filter by difficulty level (start with "Easy")',
        'Read task requirements carefully',
        'Check payment amount and time requirement',
        'Click "Accept Task" to begin',
        'Review detailed instructions before starting',
      ],
      tips: 'Start with easier tasks to build your rating and confidence. Higher ratings unlock premium tasks.',
      icon: '🎯',
    },
    {
      number: '7',
      title: 'Complete the Task Honestly',
      description: 'Follow the task instructions carefully and complete your work with genuine effort.',
      details: [
        'Read all instructions thoroughly',
        'Complete every step as requested',
        'Take clear screenshots or gather required proof',
        'Time your task completion properly',
        'Verify you\'ve met all requirements',
        'Prepare your submission materials',
      ],
      tips: 'Honest work is essential. Any suspicious activity will be flagged and your account may be suspended.',
      icon: '⚡',
    },
    {
      number: '8',
      title: 'Submit Proof & Wait for Verification',
      description: 'Submit clear proof of completion and wait for verification by our AI system and support team.',
      details: [
        'Click "Submit Proof" in the task',
        'Upload all required screenshots or links',
        'Write a brief description of what you did',
        'Review your submission for accuracy',
        'Submit and wait for verification',
        'Check your wallet after approval (1-24 hours)',
      ],
      tips: 'Submit proof immediately after completion. Clear, detailed proof speeds up verification.',
      icon: '📸',
    },
    {
      number: '9',
      title: 'Withdraw Your Earnings',
      description: 'Once verified and you\'ve accumulated enough earnings, withdraw to your preferred payment method.',
      details: [
        'Open your wallet section',
        'Check your available balance',
        'Click "Request Withdrawal"',
        'Select your preferred payment method',
        'Enter withdrawal amount (minimum varies)',
        'Confirm and submit your withdrawal request',
      ],
      tips: 'Withdrawals typically process within 2-5 business days. International transfers may take longer.',
      icon: '💰',
    },
    {
      number: '10',
      title: 'Keep Building Your Reputation',
      description: 'Continue completing tasks to increase your rating and unlock premium opportunities.',
      details: [
        'Track your completion rate and rating',
        'Focus on high-quality task completion',
        'Request feedback from task creators if rejected',
        'Gradually take on more challenging tasks',
        'Monitor your earnings and performance',
        'Share tips in the community forum',
      ],
      tips: 'Top performers earn 3-4x more. Consistency and quality are key to maximizing your experience.',
      icon: '📈',
    },
  ];

  const dosDonts = [
    {
      type: 'do',
      items: [
        'Be honest and genuine with all tasks',
        'Follow instructions exactly as written',
        'Read task requirements before accepting',
        'Take clear, legible screenshots',
        'Contact support if confused about tasks',
        'Check your messages daily',
        'Build your profile gradually',
      ],
    },
    {
      type: 'dont',
      items: [
        'Use bots or automation tools',
        'Share your account with others',
        'Lie about completed tasks',
        'Use VPN to manipulate results',
        'Ignore task instructions',
        'Submit blurry or unclear proof',
        'Create multiple accounts',
      ],
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
              Getting <span className="text-[#e1ba73]">Started</span>
            </h1>
            <p className="text-xl text-gray-400">
              Your complete step-by-step guide to joining SRK Task and starting to earn. 
              Follow this guide to set up your account correctly and maximize your earnings.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 10 Steps Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-8 hover:border-[#e1ba73]/50 transition-all duration-300"
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full blur opacity-60" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center text-2xl font-bold text-black">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Step {step.number}: {step.title}</h3>
                  <p className="text-gray-300 text-lg mb-4">{step.description}</p>
                  
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 mb-4">
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-[#e1ba73] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/5 border border-[#e1ba73]/20 rounded-lg p-4 flex gap-3">
                    <Lightbulb size={20} className="text-[#e1ba73] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300"><span className="font-semibold text-[#e1ba73]">Pro Tip:</span> {step.tips}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts Section */}
      <div className="border-y border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Do's and <span className="text-[#e1ba73]">Don'ts</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Do's */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-green-400" size={28} />
                Do's
              </h3>
              <ul className="space-y-4">
                {dosDonts[0].items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Don'ts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="text-red-400" size={28} />
                Don'ts
              </h3>
              <ul className="space-y-4">
                {dosDonts[1].items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ Link Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Need More Help?</h2>
          <p className="text-gray-400 mb-8 text-lg max-w-2xl">
            Check out our comprehensive FAQ section or contact our support team for personalized assistance.
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
