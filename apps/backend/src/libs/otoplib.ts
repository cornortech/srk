import { authenticator } from "otplib";

// Load from .env
const OTP_STEP = parseInt(process.env.OTP_STEP || "120", 10);
const OTP_DIGITS = parseInt(process.env.OTP_DIGITS || "6", 10);

// Configure otplib
authenticator.options = {
  step: OTP_STEP,
  digits: OTP_DIGITS,
};

export const OtpLib = {
  generateSecret(): string {
    return authenticator.generateSecret();
  },
  generateOTP(otpSecret: string): string {
    console.log("generating", otpSecret);
    return authenticator.generate(otpSecret);
  },

  verifyOTP(otp: string, secret: string): boolean {
    console.log("verifying", otp, secret);
    return authenticator.check(otp, secret);
  },
};
