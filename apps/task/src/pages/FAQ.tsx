import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How do I create an account on SRK Task?',
      answer: 'SRK Task is exclusively available to members of SRK University. To get started, you must first enroll in SRK University, complete the KYC verification process, and become an active member. Once you\'re a verified SRK University member, you can link your account to SRK Task using your university credentials. The integration is seamless and takes just a few minutes.',
    },
    {
      category: 'Getting Started',
      question: 'What do I need to access SRK Task?',
      answer: 'To access SRK Task, you need: (1) An active SRK University account, (2) Completed KYC verification through SRK University, (3) A valid email address, (4) A device with internet connection. Once you meet these requirements, you can immediately start accessing available tasks on the platform.',
    },
    {
      category: 'Getting Started',
      question: 'Is there an age requirement to use SRK Task?',
      answer: 'Yes, you must be at least 18 years old to use SRK Task. This age requirement is consistent across the SRK Industries ecosystem and is enforced during the KYC verification process at SRK University.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'What types of tasks are available on SRK Task?',
      answer: 'SRK Task offers a diverse range of social influence tasks including: social media engagement (likes, shares, comments), content creation tasks, follower growth activities, and verified engagement tasks from real creators and brands. All tasks are designed to be completed honestly and in full compliance with platform instructions. The platform carefully curates tasks to ensure quality and legitimacy.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'How much can I earn from completing tasks?',
      answer: 'Earnings vary based on task complexity, your profile quality, and market demand. Simple engagement tasks typically pay between $0.50 to $5 per task, while specialized tasks can pay significantly more. Top-performing users with high engagement rates and verified profiles can earn between $50 to $500 per week. Your actual earnings depend on how many tasks you complete and your consistency.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'How quickly will I see earnings credited to my wallet?',
      answer: 'Earnings are typically credited to your SRK Task wallet within 1-24 hours of task verification. The verification process involves our AI-powered system and human review to ensure task completion integrity. Once verified, funds appear in your wallet immediately and can be withdrawn or used for other platform features.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'What happens if my task is flagged as incomplete or fraudulent?',
      answer: 'If a task is flagged, our support team will contact you with detailed information about the issue. Tasks may be rejected if they don\'t meet completion requirements, show signs of bot activity, or appear to be dishonest attempts. We provide clear feedback to help you understand what went wrong so you can complete future tasks correctly. Repeated fraudulent behavior will result in account suspension.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'How do I withdraw my earnings?',
      answer: 'You can withdraw earnings through your SRK Task wallet. Available withdrawal methods include bank transfer, digital wallets, and other payment options depending on your location. Minimum withdrawal amounts typically start at $10. All withdrawals are processed through official SRK Task systems. Withdrawals are usually processed within 2-5 business days.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'Are there any fees associated with withdrawals?',
      answer: 'SRK Task may charge minimal processing fees on withdrawals depending on the withdrawal method chosen. Bank transfers typically have lower fees compared to instant digital payment options. The exact fee will be displayed before you confirm the withdrawal. Some special promotions offer fee-free withdrawals - check the platform for current offers.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'What should I do if a payment didn\'t arrive?',
      answer: 'If a withdrawal doesn\'t arrive within the expected timeframe, contact our support team immediately. Provide your transaction ID and details. Our team will investigate the issue with your financial institution if necessary. In most cases, delayed payments are due to banking processes, which can take 7-10 business days for international transfers.',
    },
    {
      category: 'Account & Security',
      question: 'How is my personal information protected?',
      answer: 'SRK Task uses industry-leading security measures including 256-bit encryption, secure wallet systems, and multi-layer authentication. All personal data collected during KYC verification is handled securely and in compliance with data protection regulations. We never share your information with third parties without consent, and maintain strict access controls.',
    },
    {
      category: 'Account & Security',
      question: 'What should I do if I suspect unauthorized account activity?',
      answer: 'If you notice any suspicious activity, change your password immediately and contact support. Never share your login credentials with anyone. We recommend enabling two-factor authentication for additional security. Our fraud detection system monitors accounts constantly, but you should report anything unusual right away.',
    },
    {
      category: 'Account & Security',
      question: 'Can I link multiple accounts to SRK Task?',
      answer: 'No, linking multiple accounts or using multiple accounts to circumvent platform rules is strictly prohibited and violates our Terms and Conditions. Each user is limited to one SRK Task account per SRK University enrollment. Attempting to create multiple accounts will result in permanent suspension.',
    },
    {
      category: 'Account & Security',
      question: 'What are your policies regarding bots and automated activity?',
      answer: 'SRK Task has a strict zero-tolerance policy for bots and automated tools. Using bots, scripts, VPNs to manipulate results, or any deceptive behavior will result in immediate account suspension, forfeiture of all earnings, and potential legal action. Our proprietary AI detection system identifies suspicious activity patterns automatically.',
    },
    {
      category: 'Platform & Features',
      question: 'What do the different task statuses mean?',
      answer: 'Available: Task is ready to complete. In Progress: You\'re currently working on it. Pending Review: Awaiting verification. Completed & Verified: Task verified and earnings credited. Rejected: Task didn\'t meet requirements. Understanding these statuses helps you track your progress and manage your workload effectively.',
    },
    {
      category: 'Platform & Features',
      question: 'Can I cancel a task after starting it?',
      answer: 'Yes, you can abandon a task before submitting proof of completion without penalty. However, once you submit verification proof, the task enters the review process and cannot be canceled. If the task is rejected, you won\'t receive payment but can attempt it again if it becomes available.',
    },
    {
      category: 'Platform & Features',
      question: 'How do I choose which tasks to complete?',
      answer: 'Tasks are displayed in your dashboard with details about payment, difficulty level, and time requirement. You can filter by category, payment amount, and estimated completion time. Popular tasks fill up quickly, so act fast if you see attractive opportunities. High-performing users get priority access to premium tasks.',
    },
    {
      category: 'Troubleshooting',
      question: 'Why can\'t I see any tasks available?',
      answer: 'If no tasks appear: (1) Check your internet connection, (2) Refresh the page, (3) Verify your account is fully verified, (4) Ensure you meet all task requirements, (5) Contact support if the issue persists. During high-demand periods, tasks may fill up quickly, so check back regularly for new opportunities.',
    },
    {
      category: 'Troubleshooting',
      question: 'The platform is running slow. What should I do?',
      answer: 'Try these troubleshooting steps: (1) Clear your browser cache, (2) Close unnecessary tabs, (3) Try a different browser, (4) Check your internet speed, (5) Disable browser extensions, (6) Try again after some time if there\'s high traffic. Contact support if problems persist.',
    },
    {
      category: 'Troubleshooting',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset link within minutes. Click the link to create a new password. If you don\'t receive the email, check your spam folder or contact support. Never share password reset links with anyone.',
    },
  ];

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
              Frequently Asked <span className="text-[#e1ba73]">Questions</span>
            </h1>
            <p className="text-xl text-gray-400">
              Find answers to common questions about SRK Task, earning, payments, security, and more. 
              If you can't find what you're looking for, feel free to contact our support team.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 pb-32">
        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-8 text-[#e1ba73]"
            >
              {category}
            </motion.h2>

            <div className="space-y-4">
              {faqItems
                .filter(item => item.category === category)
                .map((item, index) => {
                  const globalIndex = faqItems.indexOf(item);
                  const isExpanded = expandedIndex === globalIndex;

                  return (
                    <motion.div
                      key={globalIndex}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg overflow-hidden hover:border-[#e1ba73]/50 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleExpanded(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="font-bold text-left text-lg">{item.question}</span>
                        <ChevronDown
                          size={24}
                          className={`text-[#e1ba73] transition-transform duration-300 flex-shrink-0 ml-4 ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 py-4 border-t border-white/5 bg-white/[0.01]"
                        >
                          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Still have questions?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Our support team is here to help. Reach out through any of our contact channels and 
              we'll get back to you within 24 hours.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all duration-300"
            >
              Contact Us Now
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
