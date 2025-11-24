import { balanceModel } from "../model/balanceModel";

interface TUpdateCustomerBalance {
  userId: string;
  eventWallet?: number;
  balance?: number;
  srkBonus?: number;
  totalEarnings?: number;
}

class CustomerBalanceService {
  static async depositCustomerBalance({
    userId,
    balance = 0,
    eventWallet = 0,
    srkBonus = 0,
    totalEarnings = 0,
  }: TUpdateCustomerBalance): Promise<void> {
    const customerBalance = await balanceModel.findOne({ userId });

    console.log(`
      
      balance: ${balance},
      srkBonus: ${srkBonus},
      eventWallet: ${eventWallet},
      `);

    if (!customerBalance) {
      // Create new customer balance entry if not found
      await balanceModel.create({
        userId,
        balance,
        // eventWallet,
        tourEventWallet: eventWallet,
        srkBonus,
        totalEarnings,
        tourBalance: balance,
      });
    } else {
      // Update existing customer balance
      customerBalance.balance += balance;
      // customerBalance.eventWallet += eventWallet;
      customerBalance.tourEventWallet += eventWallet;
      customerBalance.srkBonus += srkBonus;
      customerBalance.totalEarnings += totalEarnings;
      customerBalance.tourBalance += balance;
      await customerBalance.save();
    }
  }
}

export default CustomerBalanceService;
