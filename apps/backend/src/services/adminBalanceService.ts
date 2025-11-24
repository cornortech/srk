import { adminBalanceModel } from "../model/adminBalanceModel";
import { AdminSrkBankModel } from "../model/AdminSrkBankModel";

interface TUpdateAdminBalance {
  ceoSalary?: number;
  officeManagementCharge?: number;
  companyTurnover?: number;
  eventWallet?: number;
  tdsAmount?: number;
  companyWallet?: number;
}

class AdminBalanceService {
  static async depositAdminBalance({
    ceoSalary = 0,
    officeManagementCharge = 0,
    companyTurnover = 0,
    eventWallet = 0,
    tdsAmount = 0,
    companyWallet = 0,
  }: TUpdateAdminBalance): Promise<void> {
    const adminBalanceExist = await adminBalanceModel.findOne();

    // Create new admin balance entry if not found
    if (!adminBalanceExist) {
      await adminBalanceModel.create({
        ceoSalary,
        officeManagementCharge,
        companyTurnover,
        eventWallet,
        tdsAmount,
        companyWallet,
      });
      // Update existing admin balance
    } else {
      adminBalanceExist.ceoSalary += ceoSalary;
      adminBalanceExist.officeManagementCharge += officeManagementCharge;
      adminBalanceExist.companyTurnover += companyTurnover;
      adminBalanceExist.eventWallet += eventWallet;
      adminBalanceExist.tdsAmount += tdsAmount;
      adminBalanceExist.companyWallet += companyWallet;
      await adminBalanceExist.save();
    }
  }
  static async depositAmountToSrkBank(amount: number) {
    const adminSrkBankExist = await AdminSrkBankModel.findOne({});

    if (!adminSrkBankExist) {
      await AdminSrkBankModel.create({
        amount,
      });
    } else {
      adminSrkBankExist.amount += amount;
      await adminSrkBankExist.save();
    }
  }
}

export default AdminBalanceService;
