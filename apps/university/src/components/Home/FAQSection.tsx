import { useState } from "react";

export function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const faqs = [
    {
      question: "Who will be the professors?",
      answer:
        "Trainers in the course are Successful individual’s Each In their Own Profession And are handpicked by SRK official Himself.",
    },
    {
      question: "Do I need money for all courses?",
      answer:
        " Yes, you do need money for all courses . But , the price may differ  according to the package you choose.",
    },
    {
      question: "How long do I have access to the course?",
      answer:
        "You have access to the course for 120 days , once you purchase it , irrespective of the package you choose. ",
    },
    {
      question:
        " What do i need to do in order to get course for lifetime ,with one time purchase ?",
      answer:
        " you need to get enrolled in the affiliate partnership program to get courses free for lifetime , once purchased.",
    },
    {
      question: "How do I get support if I have questions?",
      answer:
        "We have a dedicated support team and a community forum where you can ask questions and get help from instructors and fellow students.",
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
