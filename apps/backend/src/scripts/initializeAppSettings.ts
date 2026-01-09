#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');

// Define schema inline to avoid ES module issues
const appSettingsSchema = new mongoose.Schema(
  {
    taskFeatureEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
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

const AppSettingsModel = mongoose.model('AppSettings', appSettingsSchema);

/**
 * Initialize app settings with default values
 * This ensures the settings document exists in the database
 * 
 * Usage: node apps/backend/src/scripts/initializeAppSettings.js
 */
const initializeAppSettings = async () => {
  try {
    let settings = await AppSettingsModel.findOne();
    
    if (!settings) {
      settings = await AppSettingsModel.create({
        taskFeatureEnabled: true,
        maintenanceMode: false,
        announcementMessage: '',
      });
      console.log('✅ App settings created successfully');
    } else {
      console.log('✅ App settings already exist');
    }
    
    console.log('   Settings:', {
      taskFeatureEnabled: settings.taskFeatureEnabled,
      maintenanceMode: settings.maintenanceMode,
    });
    
    return settings;
  } catch (error) {
    console.error('❌ Error initializing app settings:', error);
    throw error;
  }
};

// Main execution
const MONGODB_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/srk';

console.log('📦 Connecting to MongoDB...');
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await initializeAppSettings();
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
