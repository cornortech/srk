const getFrontendRedirectionUrl = (
  isAdmin: boolean,
  userStatus: string,
  packageId?: string
) => {
  // Determine role
  const role = isAdmin ? "admin" : "user";

  // Default redirection URL
  let redirectionUrl = "/auth/login";

  if (role === "user") {
    // Handle user redirection based on status
    switch (userStatus) {
      case "PORTAL_ACTIVATED":
        redirectionUrl = "/study";
        break;

      case "KYC_VERIFICATION_REJECTED":
        redirectionUrl = "/auth/kyc-verification";
        break;

      case "KYC_VERIFICATION_PENDING":
        redirectionUrl = "/auth/kyc-verification";
        break;

      case "REGISTERED":
        redirectionUrl = "/auth/kyc-verification";
        break;

      case "PAYMENT_VERIFICATION_REJECTED":
        redirectionUrl = `/auth/payment-verification?packageId=${packageId}`;
        break;

      case "PAYMENT_VERIFICATION_PENDING":
        redirectionUrl = `/auth/payment-verification?packageId=${packageId}`;
        break;

      case "PAYMENT_VERIFICATION_APPROVED":
        redirectionUrl = `/auth/kyc-verification`;
        break;
    }
  } else {
    // Admin redirection
    redirectionUrl = "/admin";
  }

  return redirectionUrl;
};

function generateBankAccountNumber() {
  let accountNumber = "";
  for (let i = 0; i < 16; i++) {
    const digit = Math.floor(Math.random() * 10); // Random digit from 0–9
    accountNumber += digit;
  }
  return accountNumber;
}

function generateSRKBankId() {
  // Generate a random 13-digit number
  const randomNumber = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, "0");

  // Add the prefix "SRK"
  return `SRK${randomNumber}`;
}

export const methods = { getFrontendRedirectionUrl ,  generateBankAccountNumber,
  generateSRKBankId };
