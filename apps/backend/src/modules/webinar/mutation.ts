import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { WebinarModel } from '../../model/webinarModel';
import { webinarContract } from '@srk/shared/contracts';

const createWebinar: AppRouteImplementationOrOptions<
  typeof webinarContract.createWebinar
> = async ({ req, body }) => {
  try {
    await WebinarModel.create({
      title: body.title,
      hasFinished: body.hasFinished,
      meetUrl: body.meetUrl,
      youtubeUrl: body.youtubeUrl,
      thumbnail: body.thumbnail,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: 'Webinar created successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    };
  }
};

const deleteWebinar: AppRouteImplementationOrOptions<
  typeof webinarContract.deleteWebinar
> = async ({ req }) => {
  const { id } = req.params;

  try {
    const webinar = await WebinarModel.findByIdAndDelete(id);

    if (!webinar) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Webinar not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Webinar deleted successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    };
  }
};

const updateWebinar: AppRouteImplementationOrOptions<
  typeof webinarContract.updateWebinar
> = async ({ req, body }) => {
  const { id } = req.params;
  try {
    const updatedWebinar = await WebinarModel.findByIdAndUpdate(
      id,
      {
        title: body.title,
        hasFinished: body.hasFinished,
        meetUrl: body.meetUrl,
        youtubeUrl: body.youtubeUrl,
        thumbnail: body.thumbnail,
      },
      { new: true }
    );

    if (!updatedWebinar) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Webinar not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Webinar updated successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    };
  }
};

export const webinarMutationHandler = {
  deleteWebinar,
  createWebinar,
  updateWebinar,
};
