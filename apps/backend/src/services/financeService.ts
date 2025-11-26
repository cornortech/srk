import { PackageCommissionModel } from "../model/packageCommissionModel";
import { PackageModel } from "../model/packageModel";
import { calculateAmountFromPercentage } from "../modules/auth/mutation";

export class FinanceService {
  static async getFiananceAmountCommission({
    seniorPackageId,
    referringUserPackageId,
    newUserPackageId,
    enrolledPackageId,
  }: {
    seniorPackageId?: string;
    referringUserPackageId: string;
    newUserPackageId: string;
    enrolledPackageId: string;
  }): Promise<{
    earning: number;
    srkBonus: number;
    eventWallet: number;
    ceoSalary: number;
    officeManagementCharge: number;
    companyTurnover: number;
    balance: number;
  }> {
    const seniorPackage = await PackageModel.findById(seniorPackageId);
    const referringUserPackage = await PackageModel.findById(
      referringUserPackageId
    );
    const enrolledPackage = await PackageModel.findById(enrolledPackageId);
    const newUserPackage = await PackageModel.findById(newUserPackageId);

    if (!referringUserPackage || !newUserPackage) {
      throw new Error("Package not found");
    }

    if (!enrolledPackage) {
      throw new Error("Enrolled package not found");
    }

    const commissionPackages = await PackageCommissionModel.find({});
    let affiliateCommissionPercentage = 0;
    let srkBonusPercentage = 0;
    let ceoSalaryPercentage = 0;
    let officeManagementChargePercentage = 0;
    let eventWalletPercentage = 0;
    let srkBonusPremiumPrice = 0;

    const courseEnrollPrice = newUserPackage.discountedPrice;
    //if the enrolled user's package is greater or euqal to mine than use calculate amount according to mine package
    if (newUserPackage.price < referringUserPackage.price) {
      const commissionPackage = commissionPackages.find(
        (cp) => cp.packageId.toString() === newUserPackageId
      );

      affiliateCommissionPercentage =
        commissionPackage?.affiliateCommission || 0;
      eventWalletPercentage = commissionPackage?.eventWallet || 0;

      // if the user's package is lesser than mine than use calculate amount according to user's package .
    } else {
      const commissionPackage = commissionPackages.find(
        (cp) => cp.packageId.toString() === referringUserPackage._id.toString()
      );

      affiliateCommissionPercentage =
        commissionPackage?.affiliateCommission || 0;
      eventWalletPercentage = commissionPackage?.eventWallet || 0;
    };


    if (seniorPackage) {
      const packages = [newUserPackage, referringUserPackage, seniorPackage];
      const minPricePackage = packages.reduce((prev, curr) =>
        curr.price < prev.price ? curr : prev
      );

      const commissionPackage = commissionPackages.find(
        (cp) => cp.packageId.toString() === minPricePackage._id.toString()
      );

      // console.log(
      //   "srk bonus - selected commission package based on lowest price",
      //   minPricePackage?.title,
      //   commissionPackage
      // );

      srkBonusPremiumPrice = minPricePackage.discountedPrice;
      srkBonusPercentage = commissionPackage?.srkBonus || 0;
    };

    // const newUserPackageCommission = commissionPackages.find(
    //   (cp) => cp.packageId.toString() === newUserPackage._id?.toString()
    // );

    const enrolledPackageCommission = commissionPackages.find(
      (cp) => cp.packageId.toString() === enrolledPackage._id?.toString()
    );

    ceoSalaryPercentage = enrolledPackageCommission?.ceoSalary || 0;

    officeManagementChargePercentage =
      enrolledPackageCommission?.officeManagementCharge || 0;

    const balance = calculateAmountFromPercentage(
      courseEnrollPrice,
      affiliateCommissionPercentage
    );

    const ceoSalary = calculateAmountFromPercentage(
      enrolledPackage?.discountedPrice || 0,
      ceoSalaryPercentage
    );

    const officeManagementCharge = calculateAmountFromPercentage(
      enrolledPackage?.discountedPrice || 0,
      officeManagementChargePercentage
    );

    const eventWallet = calculateAmountFromPercentage(
      courseEnrollPrice,
      eventWalletPercentage
    );

    let srkBonus = 0;
    if (seniorPackage) {
      // console.log(
      //   "calculating srk bonus",
      //   srkBonusPremiumPrice,
      //   srkBonusPercentage
      // );
      srkBonus = calculateAmountFromPercentage(
        srkBonusPremiumPrice,
        srkBonusPercentage
      );
    }

    const companyTurnover = +(
      enrolledPackage.discountedPrice -
      balance -
      eventWallet -
      ceoSalary -
      srkBonus -
      officeManagementCharge
    ).toFixed(2);

    // console.log(
    //   `
    //   courseEnrollPrice: ${enrolledPackage?.discountedPrice || 0}
    //   balance: ${balance}
    //   eventWallet: ${eventWallet}
    //   ceoSalary: ${ceoSalary}
    //   officeManagementCharge: ${officeManagementCharge}
    //   srkBonus: ${srkBonus}
    //   companyTurnover: ${companyTurnover}
    //   earning(balance + eventWallet): ${balance + eventWallet}
    //   `
    // );

    return {
      earning: balance + eventWallet,
      balance,
      ceoSalary,
      companyTurnover,
      eventWallet,
      officeManagementCharge,
      srkBonus,
    };
  }
}
