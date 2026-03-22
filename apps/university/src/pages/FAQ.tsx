import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'What is SRK University?',
      answer: 'SRK University is a comprehensive online learning platform offering courses in various fields including business, technology, digital marketing, and entrepreneurship. We provide verified educational content and certification programs for learners worldwide.'
    },
    {
      id: 2,
      question: 'How do I enroll in a course?',
      answer: 'Simply visit our packages page, select a course bundle that matches your interests, and complete the enrollment process. You\'ll get immediate access to all course materials included in your package.'
    },
    {
      id: 3,
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including credit/debit cards, digital wallets, and bank transfers. All payments are securely processed through our verified payment gateway.'
    },
    {
      id: 4,
      question: 'Can I get a refund?',
      answer: 'Yes, we offer refunds within 15 days of purchase if you haven\'t completed more than 30% of the course content. Please refer to our refund policy for detailed terms and conditions.'
    },
    {
      id: 5,
      question: 'How long do I have access to the courses?',
      answer: 'Once enrolled, you have lifetime access to all course materials, except for live sessions which are conducted at scheduled times. You can access the content anytime, anywhere.'
    },
    {
      id: 6,
      question: 'Are the certificates recognized?',
      answer: 'Yes, SRK University certificates are recognized and valued by industry partners. Our certificates demonstrate verified completion of comprehensive course training and can be added to your professional profile.'
    },
    {
      id: 7,
      question: 'Can I become an affiliate?',
      answer: 'Absolutely! We have an attractive affiliate program where you can earn commissions by referring students. Visit our affiliate page to apply and join our growing network of partners.'
    },
    {
      id: 8,
      question: 'What technical requirements do I need?',
      answer: 'You just need a stable internet connection and a device (computer, tablet, or smartphone). Our platform works on all major browsers and devices. No special software installation required.'
    },
    {
      id: 9,
      question: 'Is there support available?',
      answer: 'Yes, we provide 24/7 customer support through email, chat, and phone. Our support team is available to help with any questions regarding courses, payments, or technical issues.'
    },
    {
      id: 10,
      question: 'How do I track my progress?',
      answer: 'Your dashboard shows detailed progress tracking for each course, including completion percentage, quiz scores, and assignment status. You can view your learning analytics at any time.'
    },
    {
      id: 11,
      question: 'Can I download course materials?',
      answer: 'Yes, most course materials including video lectures, PDFs, and resources can be downloaded for offline access. However, some premium content may have download restrictions.'
    },
    {
      id: 12,
      question: 'What if I have technical issues?',
      answer: 'Contact our technical support team immediately. We provide prompt assistance for any platform issues, video streaming problems, or other technical difficulties you may encounter.'
    },
    {
      id: 13,
      question: 'Do you offer group discounts?',
      answer: 'Yes! We provide competitive group pricing for teams and organizations. Contact our sales team at support@srkuniversity.com for custom group enrollment packages.'
    },
    {
      id: 14,
      question: 'Can I upgrade my course?',
      answer: 'Yes, you can upgrade to higher-tier packages. The difference in price will be credited, and you\'ll gain access to additional courses and premium content.'
    },
    {
      id: 15,
      question: 'How often are new courses added?',
      answer: 'We add new courses and update existing content regularly based on industry demands and learner feedback. Check our platform regularly for the latest offerings.'
    },
    {
      id: 16,
      question: 'Is live interaction available?',
      answer: 'Yes, we conduct live webinars, Q&A sessions, and interactive workshops on scheduled dates. Dates and times are announced in advance, and recordings are available for those who miss the live session.'
    },
    {
      id: 17,
      question: 'What is the instructor background?',
      answer: 'Our instructors are industry experts with years of practical experience. Each instructor is verified and has demonstrated expertise in their field of teaching.'
    },
    {
      id: 18,
      question: 'Can I share my account?',
      answer: 'No, each account is for individual use only. Sharing accounts violates our terms of service. We recommend each user creates their own account for tracking and certification purposes.'
    },
    {
      id: 19,
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel anytime from your account settings. If within the refund period, you\'ll receive a refund according to our policy. Otherwise, your access continues until the current period expires.'
    },
    {
      id: 20,
      question: 'What makes SRK University different?',
      answer: 'We combine verified education with real-world application. Our platform integrates affiliate earning opportunities, career advancement support, and a community of like-minded learners working toward success.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-4 text-orange-400">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-300 mb-12 text-lg">
          Find answers to common questions about SRK University
        </p>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-slate-700/50 border border-orange-400/20 rounded-lg overflow-hidden hover:border-orange-400/50 transition-colors"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/70 transition-colors text-left"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronDown
                  size={24}
                  className={`text-orange-400 transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="px-6 py-4 bg-slate-800/50 border-t border-orange-400/20">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-orange-400/10 to-orange-600/10 border border-orange-400/30 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
