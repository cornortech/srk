import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How is SRK Grow different from other growth services?",
      answer:
        "SRK Grow is the only platform backed by a verified university ecosystem. Every engagement comes from KYC-verified students, ensuring 100% authentic interactions that comply with platform guidelines.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Delivery times vary by package: Starter (7 days), Growth (3 days), and Pro (24 hours). You'll see real-time progress in your dashboard as tasks are completed by verified users.",
    },
    {
      question: "Are the followers and engagements permanent?",
      answer:
        "Yes! Since all engagements come from real, active accounts, they remain permanent. We maintain a 99%+ retention rate, far exceeding industry standards.",
    },
    {
      question: "Can I target specific demographics?",
      answer:
        "Pro packages include custom targeting options. You can specify age ranges, locations, interests, and more to ensure your growth aligns with your target audience.",
    },
    {
      question: "Is this safe for my account?",
      answer:
        "Absolutely. Our method uses only organic engagement from real users completing voluntary tasks. This is indistinguishable from natural growth and fully compliant with all platform terms of service.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets. All transactions are secured with bank-grade encryption through our payment partners.",
    },
  ];

  return (
    <section id="faq" className="py-32 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              Questions
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="backdrop-blur-sm rounded-2xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-all group relative"
              >
                <motion.div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#b68938] to-[#e1ba73] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white font-bold text-lg pr-8 group-hover:text-[#b68938] transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="text-[#b68938] shrink-0" size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 pt-2">
                      <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <button className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[#b68938] border border-[#b68938]/30 font-bold text-sm uppercase tracking-widest transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};
