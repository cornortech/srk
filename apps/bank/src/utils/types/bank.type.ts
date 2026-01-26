
type TAddress = {
  country: string;
  province: string;
  district: string;
  municipality: string;
  wardNo: string;
  street: string;
};

type TIdentification = {
  idNumber: string;
  idType: string;
  issuedDate: string | Date;
  issuedFrom: string;
  placeOfBirth: string;
};

type TDocuments = {
  ppSizePhoto: string;
  nationalIdCard: string;
};
type TFamilyDetails = {
  fatherName: string;
  motherName: string;
  spouseName: string;
  childrenNames: string[];
};

export type TUserBankProfile = {
  userId: string;
  srkBankDetails: {
    accountNumber: string | null;
    status: string | null;
  };
  currentAddress: TAddress | null;
  permanentAddress: TAddress | null;
  identificationDetails: TIdentification | null;
  documents: TDocuments | null;
  familyDetails: TFamilyDetails | null;
};

export type TEarningDetails = {
  eventWallet: number;
  srkBonus: number;
  walletBalance: number;
  todayEarnings: number;
  last7DaysEarnings: number;
  last30DaysEarnings: number;
  allTimeEarnings: number;
  totalTds: number;
  totalWithdraw: number;
  srkBankAmount: number;
  totalBankPayout: number;
};

export type TBankStatement = {
  _id: string;
  username: string;
  profilePicture: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  type: "deposit" | "payout" | "payout_request" | "refunded";
  amount: number;
  date: string;
  description: string;
  currentAmount: number;
  createdAt: string;
  updatedAt: string;
};