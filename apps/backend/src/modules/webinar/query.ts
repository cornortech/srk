import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { WebinarModel } from '../../model/webinarModel';
import { webinarContract } from '@srk/shared/contracts';

const getAllWebinar: AppRouteImplementationOrOptions<
  typeof webinarContract.getAllWebinars
> = async ({ req }) => {
  try {
    const webinarData = await WebinarModel.find({}).sort({
      createdAt: -1,
    });

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
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    };
  }
};

export const webinarQueryHandler = {
  getAllWebinar,
};
