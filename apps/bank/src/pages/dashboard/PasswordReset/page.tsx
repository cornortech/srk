import { useState } from "react";
import { 
  ArrowLeft, 
  Lock, 
  Mail, 
  Shield,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PasswordResetPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmPassword: ""
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData({ ...formData, otp: newOtp });
      
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmitEmail = () => {
    setStep(2);
  };

  const handleSubmitOtp = () => {
    setStep(3);
  };

  const handleSubmitNewPassword = () => {
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-black relative top-[10vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <a href="/bank/dashboard/account/settings" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Account Settings</span>
        </a>

        <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 overflow-hidden">
          <div 
            className="p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2a2520, #1a1410)"
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
              style={{
                background: "radial-gradient(circle, rgba(182, 137, 56, 0.2) 0%, transparent 70%)"
              }}
            ></div>
            
            <div className="relative z-10 text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ 
                  background: "linear-gradient(135deg, rgba(182, 137, 56, 0.2), rgba(182, 137, 56, 0.1))",
                  border: "2px solid rgba(182, 137, 56, 0.3)"
                }}
              >
                <Shield className="w-8 h-8" style={{ color: "#b68938" }} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-sm text-gray-400">
                {step === 1 && "Enter your email to receive verification code"}
                {step === 2 && "Enter the 6-digit code sent to your email"}
                {step === 3 && "Create a new secure password"}
                {step === 4 && "Your password has been reset successfully"}
              </p>
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0f0f0f] border border-[#b68938]/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#b68938]/60 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitEmail}
                  className="w-full rounded-xl px-6 py-4 font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #e1ba73, #b68938)",
                  }}
                >
                  Send Verification Code
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-400 mb-4 block text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {formData.otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 bg-[#0f0f0f] border border-[#b68938]/20 rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:border-[#b68938]/60 transition-colors"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: "#b68938" }}
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  onClick={handleSubmitOtp}
                  className="w-full rounded-xl px-6 py-4 font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #e1ba73, #b68938)",
                  }}
                >
                  Verify Code
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-[#0f0f0f] rounded-xl px-6 py-4 font-semibold text-gray-400 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all"
                >
                  Back
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">New Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full bg-[#0f0f0f] border border-[#b68938]/20 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-[#b68938]/60 transition-colors"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-[#0f0f0f] border border-[#b68938]/20 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-[#b68938]/60 transition-colors"
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#b68938]/20">
                  <p className="text-xs text-gray-400 mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-gray-400">• At least 8 characters</li>
                    <li className="text-xs text-gray-400">• One uppercase letter</li>
                    <li className="text-xs text-gray-400">• One lowercase letter</li>
                    <li className="text-xs text-gray-400">• One number</li>
                  </ul>
                </div>

                <button
                  onClick={handleSubmitNewPassword}
                  className="w-full rounded-xl px-6 py-4 font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #e1ba73, #b68938)",
                  }}
                >
                  Reset Password
                </button>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-[#0f0f0f] rounded-xl px-6 py-4 font-semibold text-gray-400 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all"
                >
                  Back
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Password Reset Successful!</h3>
                  <p className="text-gray-400 text-sm">
                    Your password has been reset successfully. You can now use your new password to log in.
                  </p>
                </div>

                <Link to="/bank/dashboard" className="block">
                  <button
                    className="w-full rounded-xl px-6 py-4 font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #e1ba73, #b68938)",
                    }}
                  >
                    Back to Dashboard
                  </button>
                </Link>

                <a href="/bank/login" className="block">
                  <button
                    className="w-full bg-[#0f0f0f] rounded-xl px-6 py-4 font-semibold text-gray-400 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all"
                  >
                    Go to Login
                  </button>
                </a>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="px-8 pb-8">
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className="flex-1 h-1 rounded-full transition-all"
                    style={{
                      background: step >= s 
                        ? "linear-gradient(90deg, #e1ba73, #b68938)" 
                        : "rgba(182, 137, 56, 0.2)"
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}