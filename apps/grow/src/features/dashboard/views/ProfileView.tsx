import { ToastType, UserProfile } from 'apps/grow/src/lib/types/dashboard';
import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import {
  CoinIcon,
  NotificationIcon,
  ShareCountIcon,
} from '../components/ui/DashboardIcons';
import { CopyIcon } from 'lucide-react';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import { copyTextToClipboard } from '../../../lib/utils/formatters';
import { api } from '../../../lib/api';
import moment from 'moment';

interface ProfileViewProps {
  showToast: (message: string, type?: ToastType) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  showToast,
}) => {
  const userID = '694e47bf627addce4f643cc5';

  // Initialize notification states: ON only if 1 or true

  const { data: getAffiliateUserProfile, isLoading } =
    api.growAffiliate.getGrowAffiliateUser.useQuery(
      ['affiliatedUserProfile', userID],
      {
        params: { id: userID },
      }
    );

  const [emailNotifications, setEmailNotifications] = useState(
    getAffiliateUserProfile?.body.userData.isEmailNotifications === true
  );
  const [pushNotifications, setPushNotifications] = useState(
    getAffiliateUserProfile?.body.userData.isPushNotifications === true
  );

  const handleNotificationToggle = (type: 'email' | 'push') => {
    if (type === 'email') {
      setEmailNotifications((prev) => !prev);
      showToast(
        !emailNotifications
          ? 'Email notifications enabled'
          : 'Email notifications disabled',
        'info'
      );
    } else {
      setPushNotifications((prev) => !prev);
      showToast(
        !pushNotifications
          ? 'Push notifications enabled'
          : 'Push notifications disabled',
        'info'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-300 p-6 text-center">Loading profile...</div>
    );
  }

  const userData = getAffiliateUserProfile?.body.userData;
  const affiliateData = getAffiliateUserProfile?.body.affiliateData;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <GlassCard variant="gold" className="overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E1BA73]/10 via-transparent to-[#B68938]/5"></div>

          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#E1BA73] via-[#B68938] to-[#E1BA73] rounded-full blur-xl opacity-30"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10">
                  <img
                    src={"https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
                    alt={userData?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border-4 border-gray-900">
                  <div className="text-lg font-bold text-white">✓</div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userData?.fullName}
                </h2>
                <p className="text-gray-400 mb-4">{userData?.email}</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/5 rounded-xl px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <CoinIcon className="w-4 h-4" />
                      <span className="text-sm">Affiliate</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {affiliateData?.totalAffiliates.toLocaleString() ?? 0}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <ShareCountIcon className="w-4 h-4" />
                      <span className="text-sm">Commission Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {affiliateData?.totalComissionRevenue.toLocaleString() ??
                        0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Account Details & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <GlassCard variant="neutral">
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  User ID
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-sm font-mono text-gray-300 bg-white/5 p-3 rounded-lg">
                    {userID}
                  </div>
                  <button
                    onClick={() => {
                      copyTextToClipboard(userID);
                      showToast('User ID copied!', 'success');
                    }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <CopyIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Email Address
                </label>
                <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                  {userData?.email}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Member Since
                </label>
                <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                  {moment(userData?.createdAt).format('lll')}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Notification Settings */}
        <GlassCard variant="neutral">
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg">
              Notification Settings
            </h3>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <NotificationIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-xs text-gray-500">
                    Receive updates via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('email')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  emailNotifications ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    emailNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <NotificationIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Push Notifications</p>
                  <p className="text-xs text-gray-500">
                    Receive browser notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('push')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  pushNotifications ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    pushNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() =>
                  showToast('Settings saved successfully!', 'success')
                }
                className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                  boxShadow: `0 4px 20px ${GOLD_PRIMARY}40`,
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
