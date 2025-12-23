import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { webinarContract } from "../../contract/webinar/contract";
import { WebinarModel } from "../../model/webinarModel";

const getAllWebinar: AppRouteImplementationOrOptions<
  typeof webinarContract.getAllWebinars
> = async ({ req }) => {
  try {
    const webinarData = await WebinarModel.find({}).sort({
      createdAt: -1,
    })


    return {
      status: 200,
      body: webinarData.map((webinar) => ({
        _id: webinar._id.toString(),
        title: webinar.title,
        startTime: webinar.startTime,
        endTime: webinar.endTime,
        meetUrl: webinar.meetUrl,
      })),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: "Internal Server Error",
      },
    };
  }
};

export const webinarQueryHandler = {
  getAllWebinar,
};
