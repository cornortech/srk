import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const TermsAndConditions = () => {
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
                <Shield className="text-black" size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Terms and Conditions
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
          <Section number="1" title="Introduction">
            <p>
              Welcome to SRK Task. By accessing or using srktask.com, you agree
              to be fully bound by these Terms and Conditions. SRK Task is a
              product of SRK Industries and operates as an integrated extension
              of The SRK University ({universityDomain}).
            </p>
          </Section>

          <Section number="2" title="Eligibility and Enrollment Prerequisite">
            <p>
              Access to SRK Task is strictly limited to individuals who have
              completed enrollment at SRK University ({universityDomain}) and
              have successfully completed the mandatory KYC verification process
              through the SRK University portal.
            </p>
            <p>
              No individual may register on, access, or use SRK Task without
              first being a verified and active member of SRK University.
              Attempting to access SRK Task through unauthorized means is a
              direct violation of these Terms and will result in permanent
              account termination.
            </p>
          </Section>

          <Section number="3" title="Account Linking">
            <p>
              Upon meeting the SRK University enrollment requirement, users must
              link their SRK University account to their SRK Task profile. You
              are responsible for maintaining the security and confidentiality
              of your account credentials. Any activity conducted under your
              account is your sole responsibility.
            </p>
          </Section>

          <Section number="4" title="Task Completion and Earnings">
            <p>
              Tasks available on SRK Task are to be completed honestly and in
              full compliance with the instructions provided. Earnings are
              credited to your SRK Task wallet upon verified task completion.
            </p>
            <p>
              SRK Industries reserves the right to withhold, reverse, or cancel
              earnings if fraudulent, automated, or dishonest task completion is
              detected.
            </p>
          </Section>

          <Section number="5" title="Zero Bot and Fraud Policy">
            <p>
              SRK Task employs proprietary AI-based verification and human
              review systems. Any attempt to use bots, scripts, automated tools,
              VPNs to manipulate results, or any form of deceptive behavior will
              result in immediate and permanent account suspension, forfeiture
              of all earnings, and potential legal action.
            </p>
          </Section>

          <Section number="6" title="Intellectual Property">
            <p>
              All content, branding, platform architecture, and materials on
              srktask.com are the exclusive intellectual property of SRK
              Industries. Unauthorized reproduction, distribution, or commercial
              use of any content is strictly prohibited and may result in legal
              action.
            </p>
          </Section>

          <Section number="7" title="Payments and Withdrawals">
            <p>
              All payouts are processed through the official SRK Task wallet and
              payment systems only. SRK Industries is not responsible for any
              loss arising from payments made through unauthorized or
              third-party channels. Always transact through official platform
              systems.
            </p>
          </Section>

          <Section number="8" title="Refund Policy">
            <p>
              All transactions and plan activations on SRK Task are final and
              non-refundable, consistent with the policies of SRK Industries
              across its ecosystem.
            </p>
          </Section>

          <Section number="9" title="Limitation of Liability">
            <p>
              SRK Industries shall not be held liable for any direct, indirect,
              incidental, or consequential damages arising from your use of SRK
              Task, including but not limited to loss of earnings, data, or
              access.
            </p>
          </Section>

          <Section number="10" title="Modifications to Terms">
            <p>
              SRK Industries reserves the right to modify, update, or
              discontinue any aspect of SRK Task, including these Terms and
              Conditions, at any time without prior notice. Continued use of the
              platform constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section number="11" title="Termination">
            <p>
              We reserve the right to suspend or permanently terminate any
              account at our sole discretion, particularly in cases of fraud,
              misuse, or violation of these Terms or the SRK University Terms
              and Conditions.
            </p>
          </Section>

          <Section number="12" title="Prohibited Uses">
            <p>
              Users are prohibited from using SRK Task for any unlawful purpose,
              to manipulate platform integrity, to defame SRK Industries or its
              affiliates, or to engage in activities that violate the rights of
              others or the platforms on which tasks are conducted.
            </p>
          </Section>

          <Section number="13" title="Governing Law">
            <p>
              These Terms and Conditions are governed by the laws of Nepal. Any
              unresolved disputes shall be settled through binding arbitration
              within 30 days of formal notice.
            </p>
          </Section>

          <Section number="14" title="Privacy and Cookies">
            <p>
              Your use of SRK Task is also governed by our Privacy Policy. We
              use cookies to enhance platform performance and your experience.
              By using srktask.com, you consent to our use of cookies.
            </p>
          </Section>

          <Section number="15" title="Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless SRK Industries,
              its directors, employees, and affiliates from any claims,
              liabilities, or expenses arising from your use of SRK Task or your
              violation of these Terms.
            </p>
          </Section>

          <Section number="16" title="Contact">
            <p>
              For any questions regarding these Terms, please contact us at the
              official SRK Industries support channels available on srktask.com
              or {universityDomain}.
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
  number: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ number, title, children }: SectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center font-bold text-black">
          {number}
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">{title}</h2>
      </div>
      <div className="ml-14 text-gray-300 space-y-4 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};
