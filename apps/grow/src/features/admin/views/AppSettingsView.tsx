import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { api } from '../../../lib/api';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { useToast } from '../../../lib/contexts/ToastContext';
import { Upload, X, Save } from 'lucide-react';

export const AppSettingsView: React.FC = () => {
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const [qrcodeFile, setQrcodeFile] = useState<File | null>(null);
  const [qrcodePreview, setQrcodePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const toast = useToast();
  const { uploadFile } = useSRKFileUpload('grow');

  const {
    data: settings,
    isLoading,
    refetch,
  } = api.appSettings.getAppSettings.useQuery(['appSettings']);
  const updateSettings = api.appSettings.updateAppSettings.useMutation({
    onSuccess: () => {
      toast.success('Settings updated successfully');
      refetch();
    },
    onError: (error) => {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    },
  });

  useEffect(() => {
    if (settings?.body?.data?.qrcodeUrl) {
      setQrcodeUrl(settings.body.data.qrcodeUrl);
      setQrcodePreview(settings.body.data.qrcodeUrl);
    }
  }, [settings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrcodeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrcodePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQrcode = () => {
    setQrcodeFile(null);
    setQrcodePreview('');
    setQrcodeUrl('');
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      let finalUrl = qrcodeUrl;

      if (qrcodeFile) {
        const { url } = await uploadFile(qrcodeFile, 'image');
        finalUrl = url;
      }

      await updateSettings.mutateAsync({
        body: {
          qrcodeUrl: finalUrl,
        },
      });
      setQrcodeUrl(finalUrl);
      setQrcodeFile(null);
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-white">Loading settings...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-2"
        >
          <GradientText>App Settings</GradientText>
        </motion.h1>
        <p className="text-gray-400">Manage global application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Payment QR Code
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Upload the QR code image that will be displayed to users during
              payment.
            </p>

            <div className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center min-h-[300px] relative">
              {qrcodePreview ? (
                <div className="relative group">
                  <img
                    src={qrcodePreview}
                    alt="QR Code Preview"
                    className="max-w-full max-h-[300px] rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <button
                      onClick={handleRemoveQrcode}
                      className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">No QR Code uploaded</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="qrcode-upload"
              />
              {!qrcodePreview && (
                <label
                  htmlFor="qrcode-upload"
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold rounded-full cursor-pointer hover:shadow-lg hover:shadow-[#b68938]/20 transition-all"
                >
                  Upload QR Code
                </label>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={
                  isUploading ||
                  (!qrcodeFile &&
                    qrcodePreview === settings?.body?.data?.qrcodeUrl)
                }
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};
