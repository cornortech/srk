import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const PrivacyPolicy = () => {
  const universityUrl = import.meta.env.VITE_SRK_UNIVERSITY_URL || 'https://thesrkuniversity.com';
  const universityDomain = universityUrl.replace('https://', '').replace('http://', '');
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
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
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-xl blur opacity-60" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center">
                <ShieldCheck className="text-black" size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Privacy Policy
              </h1>
              <p className="text-gray-400 mt-2">
                SRK Task (srktask.com) — Operated by SRK Industries
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <Section title="Overview">
            <p>
              SRK Industries ("we", "us", "our") operates srktask.com as part
              of its broader digital ecosystem. We are committed to protecting
              your personal data. This Privacy Policy explains what information
              we collect, how we use it, and how we protect it within the SRK
              Task platform.
            </p>
          </Section>

          <Section title="Information We Collect">
            <p>
              Since SRK Task is exclusively accessible to SRK University
              members, much of your foundational identity information —
              including your name, contact details, date of birth, citizenship
              information, and KYC documentation — has already been collected
              and verified through {universityDomain}.
            </p>
            <p>
              On SRK Task, we additionally collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Task activity data</li>
              <li>Earnings history</li>
              <li>Wallet transaction records</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Behavioral data related to your use of the platform</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <p>
              We use the information collected to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Verify your identity and task completions</li>
              <li>Process and credit earnings to your wallet</li>
              <li>Detect and prevent fraud and automated activity</li>
              <li>Communicate platform updates and task availability</li>
              <li>
                Maintain the integrity and security of the SRK Task ecosystem
              </li>
            </ul>
          </Section>

          <Section title="Sharing of Information">
            <p>
              We do not sell or rent your personal information to third parties.
            </p>
            <p>
              Information may be shared with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Service providers who support platform operations</li>
              <li>Authorities where required by applicable law</li>
              <li>
                Creators or brands whose tasks you complete, strictly for
                verification purposes
              </li>
            </ul>
          </Section>

          <Section title="Data Security">
            <p>
              We implement comprehensive security measures to safeguard your
              data, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>256-bit encryption</li>
              <li>Secure escrow systems</li>
              <li>Multi-layer authentication</li>
              <li>
                Blockchain-based verification for tamper-proof transaction
                records
              </li>
            </ul>
          </Section>

          <Section title="Your Rights">
            <p>
              You have the right to access, review, and request correction of
              your personal information through your account dashboard.
            </p>
            <p>
              To opt out of communications, use the unsubscribe option in emails
              or contact our support team.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              SRK Task uses cookies to optimize platform performance and
              personalize your experience. By using srktask.com, you consent to
              our cookie policy.
            </p>
          </Section>

          <Section title="Refund Policy">
            <p>
              All plan activations or purchases made on SRK Task are final and
              non-refundable.
            </p>
            <p>
              In exceptional cases, such as technical errors that prevent access
              to paid features, you may contact our support team. Refund
              decisions are made solely at the discretion of SRK Industries.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For any privacy-related concerns, contact us through the official
              support channels on srktask.com or {universityDomain}.
            </p>
          </Section>

          {/* Last Updated */}
          <div className="mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Last Updated: February 27, 2026
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

// Section Component
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-[#e1ba73] to-[#b68938] rounded-full" />
        {title}
      </h2>
      <div className="ml-7 text-gray-300 space-y-4 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};
