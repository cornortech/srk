const getFrontendRedirectionUrl = (
  isAdmin: boolean,
  userStatus: string,
  packageId?: string
) => {
  const role = isAdmin ? 'admin' : 'user';

  let redirectionUrl = '/auth/login';

  if (role === 'user') {
    switch (userStatus) {
      case 'PORTAL_ACTIVATED':
        redirectionUrl = '/study';
        break;

      case 'KYC_VERIFICATION_REJECTED':
        redirectionUrl = '/auth/kyc-verification';
        break;

      case 'KYC_VERIFICATION_PENDING':
        redirectionUrl = '/auth/kyc-verification';
        break;

      case 'REGISTERED':
        redirectionUrl = '/auth/kyc-verification';
        break;

      case 'PAYMENT_VERIFICATION_REJECTED':
        redirectionUrl = `/auth/payment-verification?packageId=${packageId}`;
        break;

      case 'PAYMENT_VERIFICATION_PENDING':
        redirectionUrl = `/auth/payment-verification?packageId=${packageId}`;
        break;

      case 'PAYMENT_VERIFICATION_APPROVED':
        redirectionUrl = `/auth/kyc-verification`;
        break;
    }
  } else {
    // Admin redirection
    redirectionUrl = '/admin';
  }

  return redirectionUrl;
};

function generateSRKBankId() {
  let randomNumber = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, '0');

  return `SRK${randomNumber}`;
}

export const methods = { getFrontendRedirectionUrl, generateSRKBankId };
