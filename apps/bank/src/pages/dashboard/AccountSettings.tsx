import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Users,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { bankApi } from '../../utils/api/bank/bank.api';
import useAuthStore from '../../store/useAuth';
import { TUserBankProfile } from '../../utils/types/bank.type';

export default function AccountSettings() {
  // const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { userDetails, srkBank } = useAuthStore();

  const { data, isLoading } = useQuery<{ data: TUserBankProfile | null }>({
    queryKey: ['userDetails', userDetails?._id],
    queryFn: async () => {
      // Fetch updated user details if needed
      return bankApi.getBankDetailsByUserId(userDetails?._id || '');
    },
    enabled: !!userDetails?._id,
  });

  const bankDetails = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!bankDetails) {
    return <div>No Bank Details Found</div>;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard">
            <button className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-400">
            Manage your personal information and security
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 overflow-hidden">
          {/* Profile Header Section */}
          <div
            className="p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2a2520, #1a1410)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24"
              style={{
                background:
                  'radial-gradient(circle, rgba(182, 137, 56, 0.2) 0%, transparent 70%)',
              }}
            ></div>

            <div className="relative z-10 flex items-center gap-6">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(182, 137, 56, 0.2), rgba(182, 137, 56, 0.1))',
                  border: '2px solid rgba(182, 137, 56, 0.3)',
                }}
              >
                <User className="w-12 h-12" style={{ color: '#b68938' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {userDetails?.firstName}
                </h2>
                <p className="text-gray-400 flex items-center gap-2">
                  <span className="text-sm">Account #</span>
                  <span className="font-mono" style={{ color: '#b68938' }}>
                    {srkBank?.accountNumber}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Personal Information
              </h3>
              <p className="text-sm text-gray-400">
                Your basic account details
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <User className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Full Name</p>
                    <p className="text-white font-medium">
                      {userDetails?.firstName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Father's Name */}
              <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Users className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Father's Name</p>
                    <p className="text-white font-medium">
                      {bankDetails.familyDetails?.fatherName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mother's Name */}
              <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Users className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Mother's Name</p>
                    <p className="text-white font-medium">
                      {bankDetails.familyDetails?.motherName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Mail className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Email Address</p>
                    <p className="text-white font-medium">
                      {userDetails?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-white font-medium">
                      {bankDetails?.permanentAddress?.country},{' '}
                      {bankDetails?.permanentAddress?.district},{' '}
                      {bankDetails?.permanentAddress?.municipality}
                    </p>
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: '#b68938' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Member Since</p>
                    <p className="text-white font-medium">
                      {moment(userDetails?.createdAt).format('MMMM D, YYYY')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div
            className="p-8 border-t"
            style={{ borderColor: 'rgba(182, 137, 56, 0.2)' }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">Security</h3>
              <p className="text-sm text-gray-400">
                Manage your password and security settings
              </p>
            </div>

            {/* Current Password Display */}
            {/* <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(182, 137, 56, 0.1)" }}
                >
                  <Lock className="w-5 h-5" style={{ color: "#b68938" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Password</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium font-mono">
                      {showPassword ? "MySecurePass123" : "*********"}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ?
                        <EyeOff className="w-4 h-4" /> :
                        <Eye className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Change Password Button */}
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="w-full bg-[#1a1a1a] rounded-2xl p-5 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60 mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Shield className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">Change Password</p>
                    <p className="text-xs text-gray-400">
                      Update your account password
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </button>

            {/* Reset Password Button */}
            <Link to="/bank/dashboard/account/settings/reset-password">
              <button className="w-full bg-[#1a1a1a] rounded-2xl p-5 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                    >
                      <Lock className="w-5 h-5" style={{ color: '#b68938' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Reset Password</p>
                      <p className="text-xs text-gray-400">
                        Forgot password? Reset it here
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            </Link>

            {/* Password Change Form */}
            {isChangingPassword && (
              <div className="mt-6 space-y-4">
                <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#b68938]/20">
                  <h4 className="text-white font-semibold mb-4">
                    Reset Your Password
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-black/50 border border-[#b68938]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b68938]/60 transition-colors"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-black/50 border border-[#b68938]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b68938]/60 transition-colors"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-black/50 border border-[#b68938]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b68938]/60 transition-colors"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        className="flex-1 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:opacity-90"
                        style={{
                          background:
                            'linear-gradient(135deg, #e1ba73, #b68938)',
                        }}
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(false)}
                        className="flex-1 bg-[#1a1a1a] rounded-xl px-6 py-3 font-semibold text-gray-400 border border-[#b68938]/20 hover:border-[#b68938]/40 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button at Bottom */}
        <div className="mt-8">
          <Link to="/bank/dashboard">
            <button className="w-full bg-[#1a1a1a] rounded-2xl p-5 hover:shadow-lg transition-all border border-[#b68938]/40 group hover:border-[#b68938]/60">
              <div className="flex items-center justify-center gap-3">
                <ArrowLeft className="w-5 h-5" style={{ color: '#b68938' }} />
                <span className="text-white font-semibold">
                  Back to Dashboard
                </span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
