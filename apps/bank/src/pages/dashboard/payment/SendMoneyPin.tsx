import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import { ArrowLeft, Lock } from "lucide-react";
import useAuthStore from "../../../store/useAuth";
import useSendMoneyStore from "../../../store/useSendMoneyStore";
import { bankApi } from "../../../utils/api/bank/bank.api";

export default function SendMoneyPinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { intentId, receiverAccountName, amount, receiverAccountNumber } = useSendMoneyStore();
  const navigate = useNavigate();
  const { userDetails } = useAuthStore();

  const handlePinInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPin(numericValue);
  };



  useEffect(() => {
    // auto-focus when page loads
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Intent ID:", intentId);

    if (!intentId) return setError("Invalid transaction. Please try again.");
    if (!userDetails) return setError("Please log in");
    if (pin.length !== 4) return setError("Please enter your 4-digit PIN");

    try {
      await bankApi.validateTransactionPin(pin, intentId);
      await bankApi.sendMoney({
        userId: userDetails._id,
        intentId: intentId,
      });
      navigate("/bank/dashboard/send-money/success");
    } catch (error) {
      console.log("Error validating PIN or sending money:", error);
      setError("Invalid PIN");
    }
  };

  if (!receiverAccountNumber || !amount || !receiverAccountName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131212] text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#b68938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black p-4 sm:p-6 mt-36">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <Link to="/bank/dashboard/send-money/preview">
            <Button isIconOnly variant="light" className="text-white hover:opacity-80">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-white">Enter PIN</h1>
        </div>

        <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl">
          <CardHeader className="flex flex-col items-center text-center gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: "linear-gradient(125deg, #e1ba73, #b68938)" }}
            >
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
            </div>
            <p className="text-white font-bold text-base sm:text-lg">Secure Transaction</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Enter your PIN to complete the transfer
            </p>
          </CardHeader>

          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, #b68938, transparent)",
              opacity: 0.3,
            }}
          ></div>

          <CardBody className="px-4 sm:px-6 py-6 sm:py-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {error && (
                <div className="bg-red-950/30 border border-red-800/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm backdrop-blur-sm flex items-start gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* PIN circles */}
              <div
                className="flex justify-center gap-2 sm:gap-3"
                onClick={() => inputRef.current?.focus()}
              >
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl flex items-center justify-center font-bold transition-all duration-300 cursor-pointer"
                    style={{
                      borderColor: pin[index] ? "#b68938" : "rgba(182,137,56,0.3)",
                      backgroundColor: "#2a2520",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.25rem",
                        color: pin[index] ? "#b68938" : "transparent",
                      }}
                    >
                      {pin[index] ? "•" : ""}
                    </span>
                  </div>
                ))}
                {/* hidden but focusable input */}
                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => handlePinInput(e.target.value)}
                  maxLength={4}
                  className="absolute opacity-0 w-0 h-0"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ background: "linear-gradient(125deg, #e1ba73, #b68938)" }}
              >
                Complete Transfer
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
