"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";

const faqData = [
  {
    question: "Can I join the programme without enrolling in a course?",
    answer:
      "Yes, you can join as a partner without enrolling in any course. Our programme is open to everyone who wants to help promote quality education.",
  },
  {
    question: "How does the recognition process work?",
    answer:
      "Once a learner you referred joins through your link, your contribution is recorded on your partner dashboard and reviewed by our team.",
  },
  {
    question: "How often are contributions reviewed?",
    answer:
      "Contributions are reviewed on a regular cycle, typically within the first week of each month for the previous month's activity.",
  },
  {
    question: "Is there a minimum activity threshold?",
    answer:
      "Yes, there is a minimum activity threshold to qualify for recognition. Details are available in your partner dashboard once you join.",
  },
  {
    question: "Do you offer custom referral links?",
    answer:
      "Yes, we provide personalised referral links to our partners that they can share with their audience.",
  },
  {
    question: "Who gets credited for a referral?",
    answer:
      "The partner whose referral link was used when a learner joined gets credited for that contribution.",
  },
];

export default function EarningProjection() {
  return (
    <div className="min-h-screen text-gray-200 py-16">
      <div className="container mx-auto px-4">

        {/* How It Works Section */}
        <div className="mb-20 text-center">
          <h1 className="text-4xl font-bold text-center mb-4">
            How Your <span className="text-primary">Contribution</span> Works
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Every learner you introduce to SRK University strengthens our
            educational community. Here's how your impact grows over time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: "1 Learner Referred", note: "Your journey begins — every great community starts with one." },
              { label: "10 Learners Referred", note: "You're making a real difference — a growing circle of skilled individuals." },
              { label: "100 Learners Referred", note: "You've helped build something significant — a thriving learning network." },
            ].map((item, i) => (
              <div key={i} className="bg-bgSecondary rounded-xl p-6 border border-white/[0.06] flex flex-col gap-3">
                <p className="text-primary font-bold text-lg">{item.label}</p>
                <p className="text-gray-400 text-sm">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid md:grid-cols-3 gap-2 items-start max-w-custom mx-auto">
          <h2 className="text-5xl font-bold leading-tight">
            Have More
            <br />
            Questions?
          </h2>

          <div className="space-y-4 col-span-2">
            <Accordion
              variant="bordered"
              className="p-0"
              itemClasses={{
                base: "border-white/20 px-0",
                title: "text-white font-medium",
                trigger: "px-3 py-4 data-[hover=true]:bg-white/5",
                content: "text-gray-400 px-3",
              }}
            >
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  aria-label={faq.question}
                  title={faq.question}
                >
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
