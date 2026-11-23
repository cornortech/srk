import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { tourContract } from '@srk/shared/contracts';
import { TourTargetModel } from '../../model/TourTargetModel';
import { TourTargetAchievementModel } from '../../model/TourTargetAchievementModel';
import { cleanupR2Uploads } from '../../services/imageUploadService';

const serverError = (error: unknown, message: string) => {
  console.error(message, error);
  return {
    status: 500 as const,
    body: { success: false, message: 'Internal server error' },
  };
};

// Keys the upload middleware stored for this request (to undo on failure)
const uploadedKeys = (req: unknown): string[] =>
  ((req as { uploadedR2Keys?: string[] }).uploadedR2Keys ?? []).slice();

// An image value that is one of our own stored files (not a URL or an emoji)
const isStoredKey = (v?: string | null) =>
  !!v && !/^https?:\/\//i.test(v) && /\.(png|jpe?g|webp|gif|avif)$/i.test(v);

/**
 * Users earn towards ONE tour at a time (the balance service reads the first
 * active target), so activating a target switches every other one off.
 * The new one is switched on first so there is never a moment with none active.
 */
const makeOnlyActive = async (id: mongoose.Types.ObjectId) => {
  await TourTargetModel.updateOne({ _id: id }, { isActive: true });
  await TourTargetModel.updateMany(
    { _id: { $ne: id }, isActive: true },
    { isActive: false }
  );
};

const createTourTarget: AppRouteImplementationOrOptions<
  typeof tourContract.createTourTarget
> = async ({ req, body }) => {
  try {
    const { isActive = true, features = [], ...fields } = body;
    const target = await TourTargetModel.create({
      ...fields,
      features,
      isActive: false,
    });
    if (isActive) await makeOnlyActive(target._id);

    return {
      status: 201,
      body: { success: true, message: 'Tour target created' },
    };
  } catch (error) {
    await cleanupR2Uploads(uploadedKeys(req));
    return serverError(error, 'Failed to create tour target');
  }
};

const updateTourTarget: AppRouteImplementationOrOptions<
  typeof tourContract.updateTourTarget
> = async ({ req, params, body }) => {
  try {
    const existing = mongoose.isValidObjectId(params.targetId)
      ? await TourTargetModel.findById(params.targetId)
      : null;
    if (!existing) {
      await cleanupR2Uploads(uploadedKeys(req));
      return {
        status: 404,
        body: { success: false, message: 'Tour target not found' },
      };
    }

    const oldImage = existing.image;
    // isActive is changed through its own route, never here
    const { isActive: _ignored, features = [], ...fields } = body;
    existing.set({ ...fields, features });
    await existing.save();

    // The old uploaded photo is no longer used once it has been replaced
    if (oldImage !== existing.image && isStoredKey(oldImage)) {
      await cleanupR2Uploads([oldImage]);
    }

    return {
      status: 200,
      body: { success: true, message: 'Tour target updated' },
    };
  } catch (error) {
    await cleanupR2Uploads(uploadedKeys(req));
    return serverError(error, 'Failed to update tour target');
  }
};

const setTourTargetActive: AppRouteImplementationOrOptions<
  typeof tourContract.setTourTargetActive
> = async ({ params, body }) => {
  try {
    const target = mongoose.isValidObjectId(params.targetId)
      ? await TourTargetModel.findById(params.targetId)
      : null;
    if (!target) {
      return {
        status: 404,
        body: { success: false, message: 'Tour target not found' },
      };
    }

    if (body.isActive) {
      await makeOnlyActive(target._id);
    } else {
      await TourTargetModel.updateOne({ _id: target._id }, { isActive: false });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: body.isActive
          ? 'Tour target is now the active target'
          : 'Tour target deactivated',
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to change tour target status');
  }
};

const deleteTourTarget: AppRouteImplementationOrOptions<
  typeof tourContract.deleteTourTarget
> = async ({ params }) => {
  try {
    const target = mongoose.isValidObjectId(params.targetId)
      ? await TourTargetModel.findById(params.targetId)
      : null;
    if (!target) {
      return {
        status: 404,
        body: { success: false, message: 'Tour target not found' },
      };
    }

    // Users' collected progress points at this target; deleting it would orphan
    // that history, so only an unused target can be deleted.
    if (await TourTargetAchievementModel.exists({ tourId: target._id })) {
      return {
        status: 400,
        body: {
          success: false,
          message:
            'Users already have progress on this target. Deactivate it instead of deleting.',
        },
      };
    }

    await target.deleteOne();
    if (isStoredKey(target.image)) await cleanupR2Uploads([target.image]);

    return {
      status: 200,
      body: { success: true, message: 'Tour target deleted' },
    };
  } catch (error) {
    return serverError(error, 'Failed to delete tour target');
  }
};

export const tourMutation = {
  createTourTarget,
  updateTourTarget,
  setTourTargetActive,
  deleteTourTarget,
};
