import { AdminSrkBankModel } from "../model/AdminSrkBankModel";

class AdminSrkBankService {
  static async depositAmount(amount: number) {
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
  static async getSrkBankDocument() {
    const adminSrkBankExist = await AdminSrkBankModel.findOne({});
    if (!adminSrkBankExist) {
      const srkBankExist = await AdminSrkBankModel.create({
        amount: 0,
        totalPendingPayout: 0,
      });
      return srkBankExist;
    } else {
      return adminSrkBankExist;
    }
  }
}

export default AdminSrkBankService;
