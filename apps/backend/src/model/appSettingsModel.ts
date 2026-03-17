import mongoose from 'mongoose';

const appSettingsSchema = new mongoose.Schema(
  {
    taskFeatureEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
    // Add more settings as needed in the future
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    announcementMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
appSettingsSchema.index({}, { unique: true });

export const AppSettingsModel = mongoose.model('AppSettings', appSettingsSchema);

// Helper function to get or create settings
export const getOrCreateAppSettings = async () => {
  let settings = await AppSettingsModel.findOne();
  
  if (!settings) {
    settings = await AppSettingsModel.create({
      taskFeatureEnabled: true,
      maintenanceMode: false,
      announcementMessage: '',
    });
  }
  
  return settings;
};
