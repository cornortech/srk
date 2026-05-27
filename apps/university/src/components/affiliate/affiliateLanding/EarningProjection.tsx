"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

const overviewData = [
  { price: 2999, benefit: "25%", partners: 1, credits: 749 },
  { price: 2999, benefit: "25%", partners: 10, credits: 7497 },
  { price: 2999, benefit: "25%", partners: 100, credits: 74975 },
];

const faqData = [
  {
    question: "Do I need to enrol in a course before becoming a partner?",
    answer:
      "Yes, purchasing a course is required before joining the partner programme. This ensures that partners have genuine first-hand experience of the educational content they are recommending to others.",
  },
  {
    question: "How are referral credits processed?",
    answer:
      "Referral credits are processed through secure bank transfer once they have been verified. Credits become eligible for transfer once they pass the review period.",
  },
  {
    question: "When are credits transferred?",
    answer:
      "Credit transfers are reviewed on a regular basis, typically within 14 days following the review period for each referral.",
  },
  {
    question: "What is the minimum credit transfer amount?",
    answer:
      "The minimum credit transfer amount is NPR 500. Once your accumulated credits reach this level, you may request a transfer.",
  },
  {
    question: "Do you offer custom referral codes?",
    answer:
      "Yes, each partner receives a unique referral code that they can share with their network. This code is used to track enrolments made through your recommendation.",
  },
  {
    question: "Who receives referral credits?",
    answer:
      "Referral credits are allocated to the partner whose referral link or code was used when the student enrolled in their course.",
  },
];

export default function EarningProjection() {
  return (
    <div className="min-h-screen text-gray-200 py-16">
      <div className="container mx-auto px-4">
        {/* Partnership Overview Section */}
        <div className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-12">
            Partnership <span className="text-primary">Overview</span>
          </h1>

          <Table
            aria-label="Partnership overview table"
            classNames={{
              wrapper: "bg-transparent",
              th: " text-white font-bold text-md",
              td: "text-default-900",
              tr: "data-[odd=true]:bg-bgSecondary data-[odd=true]:text-white data-[even=true]:bg-white",
            }}
          >
            <TableHeader>
              <TableColumn>Course Enrolment Value</TableColumn>
              <TableColumn>Referral Benefit</TableColumn>
              <TableColumn>No. of Partners</TableColumn>
              <TableColumn>Accumulated Credits</TableColumn>
            </TableHeader>
            <TableBody>
              {overviewData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>₹{row.price}</TableCell>
                  <TableCell>{row.benefit}</TableCell>
                  <TableCell>{row.partners}</TableCell>
                  <TableCell>₹{row.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
