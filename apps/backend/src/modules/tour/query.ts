import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { balanceModel } from '../../model/balanceModel';
import { TourTargetModel } from '../../model/TourTargetModel';
import { TourTargetAchievementModel } from '../../model/TourTargetAchievementModel';
import { tourContract } from '@srk/shared/contracts';

const getUserTourTargets: AppRouteImplementationOrOptions<
  typeof tourContract.getUserTourTargets
> = async ({ req, res }) => {
  try {
    const tourData = await balanceModel
      .find({
        tourBalance: { $gt: 0 },
      })
      .populate<{
        userId: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          gender: string;
          profilePicture: string;
        };
      }>({
        path: 'userId',
      });

    return {
      status: 200,
      body: tourData.map((tour) => ({
        userId: tour.userId._id.toString(),
        firstName: tour.userId.firstName,
        lastName: tour.userId.lastName,
        email: tour.userId.email,
        phoneNumber: tour.userId.phoneNumber,
        tourBalance: tour.tourBalance || 0,
        profilePicture: tour.userId.profilePicture,
        tourEventWallet: tour.tourEventWallet || 0,
      })),
    };
  } catch (error) {
    console.error('Error in GetTour:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getTourTargets: AppRouteImplementationOrOptions<
  typeof tourContract.getTourTargets
> = async ({ req, res }) => {
  try {
    const userId = (req as any).user?.userId;
    const tourTargets = await TourTargetModel.find({});

    console.log('fetching tour targets, userId:', userId);

    // If userId is provided, fetch achievements for this user
    const achievementMap: Record<string, number> = {};
    if (userId) {
      try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const achievements = await TourTargetAchievementModel.find({
          userId: userObjectId,
        });
        achievements.forEach((achievement) => {
          achievementMap[achievement.tourId.toString()] =
            achievement.collectedAmount;
        });
      } catch (error) {
        console.error(
          'Error converting userId to ObjectId or fetching achievements:',
          error
        );
      }
    }

    return {
      status: 200,
      body: tourTargets.map((target) => {
        // Use createdAt from the document, or calculate from a default
        const createdDate = (target as any).createdAt ? new Date((target as any).createdAt) : new Date();
        const createdAtIso = createdDate.toISOString();
        
        return {
          _id: target._id.toString(),
          accommodation: target.accommodation,
          currentAmount: Math.round(target.currentAmount),
          description: target.description,
          difficulty: target.difficulty,
          duration: target.duration,
          features: target.features,
          image: target.image,
          rating: target.rating,
          targetAmount: Math.round(target.targetAmount),
          destination: target.destination,
          isActive: target.isActive,
          collectedAmount: Math.round(achievementMap[target._id.toString()] || 0),
          createdAt: createdAtIso,
        };
      }),
    };
  } catch (error) {
    console.error('Error in GetTourTargets:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getActiveTourAchievements: AppRouteImplementationOrOptions<
  typeof tourContract.getActiveTourAchievements
> = async ({ req, res }) => {
  try {
    // Find the active tour target
    const activeTourTarget = await TourTargetModel.findOne({ isActive: true });

    if (!activeTourTarget) {
      return {
        status: 200,
        body: [],
      };
    }

    // Get all achievements for this active tour and populate user details
    const achievements = await TourTargetAchievementModel.find({
      tourId: activeTourTarget._id,
    }).populate<{
      userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
      };
    }>({
      path: 'userId',
    });

    return {
      status: 200,
      body: achievements.map((achievement) => ({
        userId: achievement.userId._id.toString(),
        firstName: achievement.userId.firstName,
        lastName: achievement.userId.lastName,
        email: achievement.userId.email,
        phoneNumber: achievement.userId.phoneNumber,
        collectedAmount: Math.round(achievement.collectedAmount),
      })),
    };
  } catch (error) {
    console.error('Error in GetActiveTourAchievements:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const tourQuery = {
  getTourTargets,
  getUserTourTargets,
  getActiveTourAchievements,
};
