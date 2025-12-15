import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { tourContract } from "@srk/shared/contracts";
import { balanceModel } from "../../model/balanceModel";
import { TourTargetModel } from "../../model/TourTargetModel";

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
        path: "userId",
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
    console.error("Error in GetTour:", error);
    return {
      status: 500,
      body: {
        success: false,
        message: "Internal server error",
      },
    };
  }
};

const getTourTargets: AppRouteImplementationOrOptions<
  typeof tourContract.getTourTargets
> = async ({ req, res }) => {
  try {
    const tourTargets = await TourTargetModel.find({});

    return {
      status: 200,
      body: tourTargets.map((target) => ({
        _id: target._id.toString(),
        accommodation: target.accommodation,
        currentAmount: target.currentAmount,
        description: target.description,
        difficulty: target.difficulty,
        duration: target.duration,
        features: target.features,
        image: target.image,
        rating: target.rating,
        targetAmount: target.targetAmount,
        destination: target.destination,
      })),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: "Internal server error",
      },
    };
  }
};

export const tourQuery = {
  getTourTargets,
  getUserTourTargets,
};
