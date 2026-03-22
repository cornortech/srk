import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../../lib/api';
import { GOLD_PRIMARY } from '../constants/theme';
import { toast } from 'sonner';

export const AppSettingsContent: React.FC = () => {
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fetch current app settings
  const { data: settingsData, isLoading, refetch } = api.appSettings.getAppSettings.useQuery(
    ['getAppSettings'],
    {},
    {
      queryKey: ['getAppSettings'],
    }
  );

  // Update app settings mutation
  const { mutate: updateSettings, isPending: isSaving } = api.appSettings.updateAppSettings.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setSaveMessage({
          type: 'success',
          text: 'Settings updated successfully!',
        });
        toast.success('Settings updated successfully!');
        refetch();
      } else {
        setSaveMessage({
          type: 'error',
          text: data.body?.message || 'Failed to update settings',
        });
      }
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'An error occurred while updating settings',
      });
      setTimeout(() => setSaveMessage(null), 3000);
    },
  });

  const appSettings = settingsData?.body?.data;

  // Local state for form
  const [taskFeatureEnabled, setTaskFeatureEnabled] = useState(
    appSettings?.taskFeatureEnabled ?? true
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    appSettings?.maintenanceMode ?? false
  );
  const [announcementMessage, setAnnouncementMessage] = useState(
    appSettings?.announcementMessage ?? ''
  );

  // Update local state when data loads
  React.useEffect(() => {
    if (appSettings) {
      setTaskFeatureEnabled(appSettings.taskFeatureEnabled);
      setMaintenanceMode(appSettings.maintenanceMode);
      setAnnouncementMessage(appSettings.announcementMessage);
    }
  }, [appSettings]);

  const handleSave = () => {
    setSaveMessage(null);

    updateSettings({
      body: {
        taskFeatureEnabled,
        maintenanceMode,
        announcementMessage,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1BA73]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
          <Settings size={24} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">App Settings</h2>
          <p className="text-gray-400">
            Manage global application settings and features
          </p>
        </div>
      </motion.div>

      {/* Success/Error Message */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 ${saveMessage.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30'
            : 'bg-red-500/10 border border-red-500/30'
            }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle size={20} className="text-emerald-400" />
          ) : (
            <AlertCircle size={20} className="text-red-400" />
          )}
          <span
            className={
              saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
            }
          >
            {saveMessage.text}
          </span>
        </motion.div>
      )}

      {/* Settings Cards */}
      <div className="grid gap-6">
        {/* Task Feature Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Clock size={24} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Task Feature Control
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Enable or disable the task feature globally. When disabled, users
                  won't be able to access or complete tasks regardless of the time
                  restriction (7pm-11pm).
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Current Status:</span>
                  <span
                    className={`font-semibold ${taskFeatureEnabled ? 'text-emerald-400' : 'text-red-400'
                      }`}
                  >
                    {taskFeatureEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setTaskFeatureEnabled(!taskFeatureEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${taskFeatureEnabled ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${taskFeatureEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Maintenance Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <AlertCircle size={24} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Maintenance Mode
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Put the application in maintenance mode. This will show a
                  maintenance message to users (for future use).
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Current Status:</span>
                  <span
                    className={`font-semibold ${maintenanceMode ? 'text-orange-400' : 'text-emerald-400'
                      }`}
                  >
                    {maintenanceMode ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${maintenanceMode ? 'bg-orange-500' : 'bg-gray-600'
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Announcement Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Announcement Message</h3>
            <p className="text-gray-400 text-sm">
              Display a global announcement message to all users (for future use).
            </p>
            <textarea
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="Enter announcement message..."
              rows={4}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-xl font-bold text-black flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${GOLD_PRIMARY} 0%, #D4AF37 100%)`,
          }}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
