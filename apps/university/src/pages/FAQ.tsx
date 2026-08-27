import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { PrimaryButton } from '../components/ReusableComponents';

interface FAQItem {
  question: string;
  answer: string;
}

// Kept in sync with the landing page's FAQSection (components/Home/FAQSection.tsx)
const faqs: FAQItem[] = [
  {
    question: 'Who teaches the courses?',
    answer:
      'Our courses are delivered by experienced instructors with practical knowledge and industry experience.',
  },
  {
    question: 'Do I need to purchase every course separately?',
    answer:
      'No. Your access depends on the membership plan you choose. Each plan includes a different selection of courses and learning resources.',
  },
  {
    question: 'How long can I access my courses?',
    answer:
      'Course access is based on your selected membership plan. Please refer to your plan details for complete information.',
  },
  {
    question: 'Is lifetime access available?',
    answer:
      'Lifetime access may be available with selected plans or special offers. Please contact our team for the latest information.',
  },
  {
    question: 'How can I get support if I need help?',
    answer:
      'Our support team is available to assist you with technical questions, course access, and general learning support.',
  },
];

export const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index)
        : [...prevIndexes, index]
    );
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary p-4 sm:p-8">
      <div className="max-w-4xl mx-auto sm:py-10">
        <h1 className="text-4xl pt-8 pb-4 font-bold text-center text-textPrimary">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-textPrimary/70 mb-12 text-lg">
          Find answers to common questions about SRK University
        </p>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b-4 border-[#333]">
              <button
                onClick={() => toggleAccordion(index)}
                className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                  openIndexes.includes(index)
                    ? 'bg-custom-gradient text-black'
                    : 'text-textPrimary'
                }`}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                <span>
                  {openIndexes.includes(index) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  )}
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndexes.includes(index)
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 text-textPrimary/80 text-left">{faq.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card className="bg-bgSecondary text-textPrimary mt-16 p-4">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">Still have questions?</h2>
            <p className="text-textPrimary/70 mb-6">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <Link to="/contact" className="mx-auto">
              <PrimaryButton label="Contact Support" />
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
