import { balanceModel } from '../model/balanceModel';
import { TourTargetModel } from '../model/TourTargetModel';
import { TourTargetAchievementModel } from '../model/TourTargetAchievementModel';

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
    // Check if there's an active tour target
    const activeTourTarget = await TourTargetModel.findOne({ isActive: true });

    const customerBalance = await balanceModel.findOne({ userId });

    if (!customerBalance) {
      // Create new customer balance entry if not found
      await balanceModel.create({
        userId,
        balance: activeTourTarget ? 0 : balance, // Only deposit to balance if no active tour
        totalEarnings,
        srkBonus,
        tourBalance: 0,
        tourEventWallet: 0,
        totalWithdraw: 0,
        totalTds: 0,
      });
    } else {
      // Only deposit to balance if no active tour target
      if (!activeTourTarget) {
        customerBalance.balance += balance;
      }

      customerBalance.srkBonus += srkBonus;
      customerBalance.totalEarnings += totalEarnings;

      await customerBalance.save();
    }

    // If there's an active tour target, create/update tourTargetAchievement
    if (activeTourTarget && balance > 0) {
      let achievement = await TourTargetAchievementModel.findOne({
        userId,
        tourId: activeTourTarget._id,
      });

      if (!achievement) {
        // Create new achievement record
        achievement = await TourTargetAchievementModel.create({
          userId,
          tourId: activeTourTarget._id,
          collectedAmount: balance,
          status: 'in-progress',
        });
      } else {
        // Update existing achievement record
        achievement.collectedAmount += balance;
        
        // Check if target is reached
        if (achievement.collectedAmount >= activeTourTarget.targetAmount) {
          achievement.status = 'completed';
        }

        await achievement.save();
      }
    }
  }
}

export default CustomerBalanceService;
