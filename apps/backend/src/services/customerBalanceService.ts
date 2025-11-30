import { balanceModel } from '../model/balanceModel';

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

    if (!customerBalance) {
      // Create new customer balance entry if not found
      await balanceModel.create({
        userId,
        balance,
        // eventWallet, // when event status is on
        // tourEventWallet: eventWallet, // when target status is on

        tourEventWallet: 0,
        srkBonus,
        totalEarnings,
        // tourBalance: balance, // when target status is on
        tourBalance: 0, //
      });
    } else {
      customerBalance.balance += balance;

      // customerBalance.eventWallet += eventWallet; // when event status is on
      // customerBalance.tourEventWallet += eventWallet; // when target status is on

      customerBalance.srkBonus += srkBonus;
      customerBalance.totalEarnings += totalEarnings;
      // customerBalance.tourBalance += balance; // when target status is on

      await customerBalance.save();
    }
  }
}

export default CustomerBalanceService;
