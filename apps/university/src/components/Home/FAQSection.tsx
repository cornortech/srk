import { useState } from "react";

export function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const faqs = [
    {
      question: "Who teaches the courses?",
      answer:
        "Our courses are delivered by experienced instructors with practical knowledge and industry experience.",
    },
    {
      question: "Do I need to purchase every course separately?",
      answer:
        "No. Your access depends on the membership plan you choose. Each plan includes a different selection of courses and learning resources.",
    },
    {
      question: "How long can I access my courses?",
      answer:
        "Course access is based on your selected membership plan. Please refer to your plan details for complete information.",
    },
    {
      question: "Is lifetime access available?",
      answer:
        "Lifetime access may be available with selected plans or special offers. Please contact our team for the latest information.",
    },
    {
      question: "How can I get support if I need help?",
      answer:
        "Our support team is available to assist you with technical questions, course access, and general learning support.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index)
        : [...prevIndexes, index]
    );
  };

  return (
    <div className="   pb-12 ">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className=" border-b-4 border-[#333]"
              data-aos="fade-up"
              data-aos-duration="1200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                  openIndexes.includes(index)
                    ? "bg-custom-gradient text-black"
                    : "text-white"
                }`}
              >
                <span className="text-lg ">{faq.question}</span>
                <span className="text-white">
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
                      className="transition-transform"
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
                      className="transition-transform"
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
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 text-white/90 text-left">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
