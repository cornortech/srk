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

const projectionData = [
  { price: 2999, commission: "25%", affiliates: 1, earning: 749 },
  { price: 2999, commission: "25%", affiliates: 10, earning: 7497 },
  { price: 2999, commission: "25%", affiliates: 100, earning: 74975 },
];

const faqData = [
  {
    question: "Can I start as an affiliate without enrolling in a course?",
    answer:
      "Yes, you can start as an affiliate without enrolling in any course. Our program is open to everyone who wants to promote our courses.",
  },
  {
    question: "What is the payment process?",
    answer:
      "We process payments through secure bank transfers. Once your earnings reach the minimum threshold, you can request a payout.",
  },
  {
    question: "When are payments made?",
    answer:
      "Payments are processed on a monthly basis, typically within the first week of each month for the previous month's earnings.",
  },
  {
    question: "What is the minimum payout amount?",
    answer:
      "The minimum payout amount is ₹500. Once your earnings reach this threshold, you can request a withdrawal.",
  },
  {
    question: "Do you offer custom coupons?",
    answer:
      "Yes, we provide custom coupon codes to our affiliates that they can share with their audience for special discounts.",
  },
  {
    question: "Who gets the commission?",
    answer:
      "The commission is paid to the affiliate whose referral link or coupon code was used during the purchase.",
  },
];

export default function EarningProjection() {
  return (
    <div className="min-h-screen text-gray-200 py-16">
      <div className="container mx-auto px-4">
        {/* Earning Projection Section */}
        <div className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-12">
            Earning <span className="text-primary">Projection</span>
          </h1>

          <Table
            aria-label="Earning projection table"
            classNames={{
              wrapper: "bg-transparent",
              th: " text-white font-bold text-md",
              td: "text-default-900",
              tr: "data-[odd=true]:bg-bgSecondary data-[odd=true]:text-white data-[even=true]:bg-white",
            }}
          >
            <TableHeader>
              <TableColumn>Course Price</TableColumn>
              <TableColumn>Commission</TableColumn>
              <TableColumn>No. of Affiliate</TableColumn>
              <TableColumn>Earning</TableColumn>
            </TableHeader>
            <TableBody>
              {projectionData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>₹{row.price}</TableCell>
                  <TableCell>{row.commission}</TableCell>
                  <TableCell>{row.affiliates}</TableCell>
                  <TableCell>₹{row.earning}</TableCell>
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
