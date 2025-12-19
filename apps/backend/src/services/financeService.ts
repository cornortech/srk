import { PackageCommissionModel } from '../model/packageCommissionModel';
import { PackageModel } from '../model/packageModel';
import { calculateAmountFromPercentage } from '../modules/auth/mutation';

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
    officeManagementCharge: number;
    companyTurnover: number;
    balance: number;
    tms: number;
    vat: number;
  }> {
    const seniorPackage = await PackageModel.findById(seniorPackageId);
    const referringUserPackage = await PackageModel.findById(
      referringUserPackageId
    );
    const enrolledPackage = await PackageModel.findById(enrolledPackageId);
    const newUserPackage = await PackageModel.findById(newUserPackageId);

    if (!referringUserPackage || !newUserPackage) {
      throw new Error('Package not found');
    }

    if (!enrolledPackage) {
      throw new Error('Enrolled package not found');
    }

    const commissionPackages = await PackageCommissionModel.find({});
    let affiliateCommissionPercentage = 0;
    let srkBonusPercentage = 0;
    let officeManagementChargePercentage = 0;
    let tmsPercentage = 0;
    let vatPercentage = 0;
    let srkBonusPremiumPrice = 0;

    const courseEnrollPrice = newUserPackage.discountedPrice;
    //if the enrolled user's package is greater or euqal to mine than use calculate amount according to mine package
    if (newUserPackage.price < referringUserPackage.price) {
      const commissionPackage = commissionPackages.find(
        (cp) => cp.packageId.toString() === newUserPackageId
      );

      affiliateCommissionPercentage =
        commissionPackage?.affiliateCommission || 0;

      // if the user's package is lesser than mine than use calculate amount according to user's package .
    } else {
      const commissionPackage = commissionPackages.find(
        (cp) => cp.packageId.toString() === referringUserPackage._id.toString()
      );

      affiliateCommissionPercentage =
        commissionPackage?.affiliateCommission || 0;
    }

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
    }

    // const newUserPackageCommission = commissionPackages.find(
    //   (cp) => cp.packageId.toString() === newUserPackage._id?.toString()
    // );

    const enrolledPackageCommission = commissionPackages.find(
      (cp) => cp.packageId.toString() === enrolledPackage._id?.toString()
    );

    officeManagementChargePercentage =
      enrolledPackageCommission?.officeManagementCharge || 0;

    tmsPercentage = enrolledPackageCommission?.tms || 0;
    vatPercentage = enrolledPackageCommission?.vat || 0;

    const balance = calculateAmountFromPercentage(
      courseEnrollPrice,
      affiliateCommissionPercentage
    );

    const officeManagementCharge = calculateAmountFromPercentage(
      enrolledPackage?.discountedPrice || 0,
      officeManagementChargePercentage
    );

    const tms = calculateAmountFromPercentage(
      enrolledPackage?.discountedPrice || 0,
      tmsPercentage
    );

    const vat = calculateAmountFromPercentage(
      enrolledPackage?.discountedPrice || 0,
      vatPercentage
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
      srkBonus -
      officeManagementCharge -
      tms -
      vat
    ).toFixed(2);

    // console.log(
    //   `
    //   courseEnrollPrice: ${enrolledPackage?.discountedPrice || 0}
    //   balance: ${balance}
    //   officeManagementCharge: ${officeManagementCharge}
    //   srkBonus: ${srkBonus}
    //   companyTurnover: ${companyTurnover}
    //   earning(balance): ${balance}
    //   `
    // );

    return {
      earning: balance,
      balance,
      companyTurnover,
      officeManagementCharge,
      srkBonus,
      tms,
      vat,
    };
  }
}
