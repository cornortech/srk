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
    // Getting Started (5)
    {
      category: 'Getting Started',
      question: 'How do I create an account on SRK Task?',
      answer: 'SRK Task does not have standalone registration. Access is exclusively for SRK University members. Complete enrollment and mandatory KYC verification at srkuniversity.com, then visit srktask.com and use the "Link Account" option with your university credentials. The entire linking process takes under five minutes once KYC is approved.',
    },
    {
      category: 'Getting Started',
      question: 'What do I need to access SRK Task?',
      answer: 'You need four things: (1) An active, confirmed SRK University enrollment. (2) Completed KYC verification through the SRK University portal. (3) A linked SRK Task account created using your university credentials. (4) A completed SRK Task profile including your social platforms and task preferences. Once all four are complete, you can begin browsing and accepting tasks.',
    },
    {
      category: 'Getting Started',
      question: 'Is there an age requirement?',
      answer: 'Yes. You must be at least 18 years old to participate on SRK Task. This is enforced through the KYC process at SRK University. Any account found to belong to a person under 18 will be suspended immediately and all associated earnings will be forfeited.',
    },
    {
      category: 'Getting Started',
      question: 'How long does the KYC process take?',
      answer: 'KYC verification at SRK University typically takes 24 to 48 hours from the time of complete, accurate document submission. Incomplete submissions, documents with quality issues, or name mismatches extend this timeline. If your KYC has been pending for more than 72 hours with no update, contact SRK University support directly.',
    },
    {
      category: 'Getting Started',
      question: 'Can I access SRK Task without an SRK University account?',
      answer: 'No. SRK Task access requires active, KYC-verified SRK University membership. There are no exceptions and no workarounds. Any attempt to access SRK Task through unauthorized means violates our Terms and Conditions and will result in permanent suspension.',
    },
    // Tasks and Earnings (5)
    {
      category: 'Tasks & Earnings',
      question: 'What types of tasks are available on SRK Task?',
      answer: 'Tasks on SRK Task fall into several categories: Social media engagement (following brand accounts, liking or commenting on verified content, sharing posts to your own audience), content review and feedback, written testimonials and product opinions, audience surveys and market research, brand awareness campaigns, and community participation activities. Task types expand as new brand partnerships are established.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'How much can I realistically earn on SRK Task?',
      answer: 'Earnings on SRK Task are not guaranteed and vary significantly based on your profile rating, the tasks you choose, how consistently you work, and the quality of your submissions. New members starting with easier tasks typically earn lower amounts per task. As your profile rating increases and you unlock premium tasks, the per-task earnings increase accordingly. SRK Task is a supplemental experience platform — it rewards consistent, quality effort over time. Please read our Earnings Disclaimer for a full and honest explanation.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'How quickly are earnings credited after task approval?',
      answer: 'After a task is verified and approved, earnings are typically credited to your SRK Task wallet within 1 to 24 hours. The verification process itself takes between 1 and 48 hours depending on task complexity and submission quality. You can track the status of every submission from your dashboard in real time.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'What happens if my task submission is rejected?',
      answer: 'You will receive a notification explaining the reason for rejection. Common reasons include: incomplete proof, proof that does not match the task requirements, blurry or unreadable screenshots, submissions that show signs of automation, or missed task deadlines. For incomplete submissions, you may be given a window to resubmit with corrected proof. Repeated rejections negatively affect your profile rating, so review your submission carefully before every upload.',
    },
    {
      category: 'Tasks & Earnings',
      question: 'Can I work on multiple tasks simultaneously?',
      answer: 'Yes, within reasonable limits. You can accept and work on several tasks at the same time. However, spreading yourself too thin increases the risk of submitting incomplete or low-quality proof — which leads to rejections and rating damage. For new members, we strongly recommend completing one or two tasks fully before accepting more. Once your approval rate is consistently above 90%, you can scale your volume.',
    },
    // Payments and Withdrawals (5)
    {
      category: 'Payments & Withdrawals',
      question: 'How do I withdraw my earnings?',
      answer: 'Open your wallet section, confirm your available balance meets the minimum withdrawal threshold, click "Request Withdrawal", select your preferred payment method, enter the exact amount you want to withdraw, review all details carefully, and confirm the request. Withdrawal requests are typically processed within 1 to 3 business days. You will receive a confirmation notification when the withdrawal is processed.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'What payment methods are available for withdrawals?',
      answer: 'SRK Task currently supports bank transfer and digital wallet options available to members in Nepal. The exact methods available to you may vary depending on your location and account verification status. Available methods are displayed in your wallet section. We work to add new payment methods based on member feedback and regional availability.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'Are there withdrawal fees?',
      answer: 'SRK Task does not charge platform fees on withdrawals. However, your bank or digital wallet provider may apply their own transaction fees, which are outside our control. We recommend checking with your payment provider for any applicable charges before requesting a withdrawal.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'What should I do if a payment does not arrive?',
      answer: 'First, allow the full processing window of 1 to 3 business days. International transfers may take additional time. If payment has not arrived after this window, first confirm that your payment details in your account settings are correct and up to date. Then contact our support team via email or live chat with your withdrawal request ID. We will investigate and resolve the issue with your payment provider.',
    },
    {
      category: 'Payments & Withdrawals',
      question: 'Is there a minimum withdrawal amount?',
      answer: 'Yes. The current minimum withdrawal threshold is displayed in your wallet section. This threshold may be updated periodically. We recommend checking your wallet section for the most current minimum amount before planning a withdrawal.',
    },
    // Account and Security (5)
    {
      category: 'Account & Security',
      question: 'How is my personal information protected?',
      answer: 'All data on SRK Task is protected using 256-bit SSL encryption for transmission and secure, access-controlled server storage at rest. Personal and KYC information is handled in compliance with applicable data protection standards. We do not sell your personal information to third parties for marketing purposes. Our full data practices are documented in the Privacy Policy available at srktask.com/privacy.',
    },
    {
      category: 'Account & Security',
      question: 'What should I do if I suspect unauthorized access to my account?',
      answer: 'Act immediately. Change your password from your account settings right away. Enable or re-verify two-factor authentication. Contact SRK Task support through live chat with "Security Alert" in the subject line for priority response. Do not share your credentials with anyone, including anyone claiming to be SRK Task staff. We will never ask for your password under any circumstances.',
    },
    {
      category: 'Account & Security',
      question: 'Can I have multiple SRK Task accounts?',
      answer: 'No. Each SRK Task account must correspond to exactly one SRK University enrollment and one verified identity. Operating multiple accounts — even using different devices — violates our Terms and Conditions and will result in permanent suspension of all associated accounts and forfeiture of all earnings. Our AI system is specifically designed to detect multi-account activity.',
    },
    {
      category: 'Account & Security',
      question: 'What is your policy on bots and automated activity?',
      answer: 'SRK Task has a strict zero-tolerance policy on any form of automation. Our AI monitoring system analyzes all platform activity in real time. Any use of bots, automation scripts, VPNs to mask activity, click farms, or any other automated or deceptive behavior results in immediate and permanent account suspension, forfeiture of all pending and available earnings, and potential reporting to relevant authorities depending on the scale of the violation.',
    },
    {
      category: 'Account & Security',
      question: 'How do I reset my password?',
      answer: 'Since SRK Task uses your SRK University credentials, password resets are handled through the SRK University portal at srkuniversity.com. Use the "Forgot Password" option on the university login page. Once your password is reset at the university level, your updated credentials will work on SRK Task automatically — no separate SRK Task password reset is needed.',
    },
    // Platform and Features (5)
    {
      category: 'Platform & Features',
      question: 'What do the different task statuses mean?',
      answer: 'Available — Task is open and can be accepted. In Progress — You have accepted the task and are working on it. Submitted — Your proof has been submitted and is awaiting verification. Under Review — A human reviewer is examining your submission. Approved — Verified and earnings have been credited to your wallet. Rejected — Submission did not meet requirements (reason provided in notification). Flagged — Under investigation for a potential issue.',
    },
    {
      category: 'Platform & Features',
      question: 'Can I cancel a task after accepting it?',
      answer: 'Yes, you can cancel most tasks before submitting proof. However, excessive cancellations negatively impact your task completion rate — one of the five factors in your profile rating calculation. If you encounter a genuine issue with a task (unclear instructions, broken link, etc.), contact support before cancelling. Cancelling tasks repeatedly, without contacting support, may result in temporary restrictions on high-value task access.',
    },
    {
      category: 'Platform & Features',
      question: 'How does the profile rating system work?',
      answer: 'Your profile rating is calculated from five weighted factors: task completion rate (the percentage of tasks you accept that you actually submit proof for), proof quality score (how accurately your proof matches requirements), approval rate (the percentage of your submissions that are verified as complete), consistency of activity (regular vs. erratic platform usage), and community standing (absence of violations or negative flags). All five factors contribute to your overall rating and your access tier.',
    },
    {
      category: 'Platform & Features',
      question: 'How often are new tasks added?',
      answer: 'New tasks are added to the platform multiple times throughout each day as brand and creator partnerships generate new engagement requirements. Task availability varies by category, time of day, and platform activity levels. Members who check their dashboard daily — particularly in the morning and early evening — consistently access more tasks than those who check infrequently.',
    },
    {
      category: 'Platform & Features',
      question: 'Is there a mobile app for SRK Task?',
      answer: 'SRK Task is currently accessible via web browser on desktop and mobile devices. A dedicated mobile application is in development. Updates on the mobile app launch will be communicated via the platform announcement board and member email notifications. In the meantime, srktask.com is fully responsive and functions well on mobile browsers.',
    },
    // Earnings Expectations and Disclaimers (5)
    {
      category: 'Earnings & Disclaimers',
      question: 'Are earnings on SRK Task guaranteed?',
      answer: 'No. Earnings on SRK Task are not guaranteed in any amount or frequency. experience depends on multiple variables outside SRK Task\'s control: task availability at any given time, your profile rating and access tier, the quality of your submissions, your account standing, and the consistency of your activity. SRK Task provides a platform and infrastructure for verified engagement work — it does not guarantee any specific outcome. For full details, see our Earnings Disclaimer page.',
    },
    {
      category: 'Earnings & Disclaimers',
      question: 'How do brands fund the tasks on this platform?',
      answer: 'Brands and content creators who need verified human engagement for their social media content allocate specific marketing budgets to task campaigns on SRK Task. These are the same budgets that businesses use for influencer marketing, community management, and social media advertising. They choose SRK Task because our KYC-verified member base provides auditable, traceable, human engagement — something anonymous platforms cannot offer. The task payments to members come directly from these brand-funded campaign budgets.',
    },
    {
      category: 'Earnings & Disclaimers',
      question: 'What is the average earning per task?',
      answer: 'Task payments vary widely depending on category, complexity, time required, and the brand\'s campaign budget. Simple social media engagement tasks typically pay at the lower end. Premium brand campaigns, detailed content reviews, and longer-form activities pay at the higher end. There is no single "average" that applies across all task types. Your earnings per task will increase as your profile rating rises and you unlock access to higher-tier tasks.',
    },
    {
      category: 'Earnings & Disclaimers',
      question: 'Can SRK Task be used as a primary experience source?',
      answer: 'SRK Task is designed and positioned as a supplemental experience platform. It provides a legitimate, structured way for verified individuals to monetize their social media presence alongside their primary experience. While top-performing, highly-active members may earn significant amounts, SRK Task should not be treated as a replacement for stable employment or a primary livelihood. Please make financial decisions based on realistic assessment of your own activity levels and the platform\'s variable nature.',
    },
    {
      category: 'Earnings & Disclaimers',
      question: 'What should I do if I have a complaint about a task or payment?',
      answer: 'Contact our support team with full details of your complaint: your account details, the task ID, a description of the issue, and any supporting screenshots or documentation. We commit to responding to all complaints within 24 hours. For payment disputes, include your withdrawal request ID. For task rejection disputes, include your submission ID and the specific reason you believe the rejection was in error. All complaints are reviewed by a human team member.',
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
