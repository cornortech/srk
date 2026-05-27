"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { DollarSign, Send } from "lucide-react";

export default function WithdrawalForm() {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the withdrawal process
    console.log("Withdrawal requested for: $", amount);
    // Reset form
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <Input
        type="number"
        label="Amount to Transfer"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        startContent={
          <div className="pointer-events-none flex items-center">
            <DollarSign className="text-default-400" size={16} />
          </div>
        }
      />
      <Button type="submit" color="primary" startContent={<Send size={16} />}>
        Request Transfer
      </Button>
    </form>
  );
}
