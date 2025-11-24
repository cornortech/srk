"use client";

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  subscription: string;
  unitPrice: number;
  vat: number;
}

interface InvoiceGeneratorProps {
  data: InvoiceData;
}

export default function InvoiceGenerator({ data }: InvoiceGeneratorProps) {
  const generateInvoice = (data: InvoiceData) => {
    const doc = new jsPDF();

    // Set default font
    doc.setFont("helvetica");

    // Company Header
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text("SRK PRIVATE  LIMITED", 105, 30, { align: "center" });

    // Add logo
    doc.addImage("/logo.png", "PNG", 20, 15, 28, 28);

    // Invoice Title and Details
    doc.setFontSize(18);
    doc.text("INVOICE", 120, 50);

    doc.setFontSize(10);
    doc.text(`Invoice: #${data.invoiceNumber}`, 120, 60);
    doc.text(`Invoice Date: ${data.invoiceDate}`, 120, 65);
    doc.text(`Invoice Amount: NPR.${data.amount.toFixed(2)}`, 120, 70);
    doc.text(`Transaction ID: ${data.transactionId}`, 120, 75);

    // Company Address
    doc.setFontSize(11);
    doc.text("SRK PRIVATE LIMITED", 20, 50);
    doc.text("kirtipur -06,", 20, 55);
    doc.text("kathmandu, Bagmati Nepal", 20, 60);

    // Billed To Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO", 20, 80);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(data.customerName, 20, 90);
    doc.text(data.customerEmail, 20, 95);
    doc.text(data.customerPhone, 20, 100);
    doc.text(data.customerAddress, 20, 105);

    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 120, 170, 10, "F");
    doc.text("SUBSCIRPTION", 30, 126);
    doc.text("UNIT PRICE", 90, 126);
    doc.text("VAT", 130, 126);
    doc.text("AMOUNT(NPR)", 160, 126);

    // Table Content
    doc.setFont("helvetica", "normal");
    doc.text(data.subscription, 30, 140);
    doc.text(data.unitPrice.toString(), 90, 140);
    doc.text(`${data.vat} (13%)`, 130, 140);
    doc.text(data.amount.toString(), 160, 140);

    // Footer
    doc.setFontSize(10);
    doc.text("www.SRK.com", 105, 280, { align: "center" });

    // Save PDF
    doc.save(`invoice-${data.invoiceNumber}.pdf`);
  };

  const handleDownloadInvoice = () => {
    generateInvoice(data);
  };

  const dummyPackages = [
    { id: "2", name: "Pro Package", amount: 49.99, date: "2023-06-15" },
  ];

  return (
    <div className="flex w-full justify-center ">
      {dummyPackages.map((pkg) => (
        <Card key={pkg.id} className="w-96 h-full">
          <CardHeader className="text-xl">{data.subscription}</CardHeader>
          <CardBody className="flex justify-between  gap-4">
            <div>
              <p className="text-2xl font-bold">Rs.{data.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                Purchased on {data.invoiceDate}
              </p>
            </div>
            <Button size="lg" onPress={handleDownloadInvoice}>
              <Download className="mr-2 h-4 w-4" /> Download Invoice
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
