import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Plus, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../lib/api';
import { getTaskAssetUrl } from '../../../lib/cdn';
import { useSRKFileUpload } from '@srk/shared/hooks';

interface ApiError {
  response?: { data?: { message?: string } };
}

const limit = 10;

const thClass =
  'px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider';

const Pagination: React.FC<{
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  shown: number;
  total: number;
  totalPages: number;
}> = ({ page, setPage, shown, total, totalPages }) => (
  <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700 flex items-center justify-between">
    <p className="text-sm text-gray-400">
      Showing {shown} of {total} results
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
);

export const RewardsContent: React.FC = () => {
  const [tab, setTab] = useState<'rewards' | 'claims'>('claims');
  const [rewardsPage, setRewardsPage] = useState(1);
  const [claimsPage, setClaimsPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredCoins, setRequiredCoins] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { uploadFile } = useSRKFileUpload('task');

  const rewardsQuery = api.srkTask.getAllSrkTaskRewardsForAdmin.useQuery(
    ['getAllSrkTaskRewardsForAdmin', rewardsPage],
    { query: { page: rewardsPage.toString(), limit: limit.toString() } },
    { queryKey: ['getAllSrkTaskRewardsForAdmin', rewardsPage] }
  );

  const claimsQuery = api.srkTask.getSrkTaskRewardClaimsForAdmin.useQuery(
    ['getSrkTaskRewardClaimsForAdmin', claimsPage],
    { query: { page: claimsPage.toString(), limit: limit.toString() } },
    { queryKey: ['getSrkTaskRewardClaimsForAdmin', claimsPage] }
  );

  const createMutation = api.srkTask.createSrkTaskReward.useMutation({
    onSuccess: () => {
      rewardsQuery.refetch();
      closeCreate();
    },
    onError: (error: unknown) => {
      alert((error as ApiError)?.response?.data?.message || 'Failed to create reward');
    },
    onSettled: () => setIsSaving(false),
  });

  const toggleMutation = api.srkTask.toggleSrkTaskRewardActive.useMutation({
    onSuccess: () => rewardsQuery.refetch(),
    onError: (error: unknown) => {
      alert((error as ApiError)?.response?.data?.message || 'Failed to update reward');
    },
  });

  const closeCreate = () => {
    setShowCreate(false);
    setTitle('');
    setDescription('');
    setRequiredCoins('');
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    const coins = Number(requiredCoins);
    if (!title.trim() || !description.trim() || !photoFile) {
      alert('Title, description and photo are required');
      return;
    }
    if (!Number.isInteger(coins) || coins < 1) {
      alert('Earning must be a whole number of at least 1');
      return;
    }
    setIsSaving(true);
    try {
      const { key } = await uploadFile(photoFile, 'image');
      createMutation.mutate({
        body: {
          title: title.trim(),
          description: description.trim(),
          photoUrl: key,
          requiredCoins: coins,
        },
      });
    } catch (error) {
      console.error('Reward photo upload error:', error);
      alert('Failed to upload photo. Please try again.');
      setIsSaving(false);
    }
  };

  const rewards = rewardsQuery.data?.body;
  const claims = claimsQuery.data?.body;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B68938] to-[#E1BA73] flex items-center justify-center">
            <Gift className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Rewards</h2>
            <p className="text-sm text-gray-400">
              Create rewards and contact users who claimed them
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-3 rounded-lg font-medium bg-[#B68938] text-black hover:bg-[#E1BA73] transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Reward
        </button>
      </div>

      <div className="flex gap-2">
        {(['claims', 'rewards'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              tab === t
                ? 'bg-[#B68938] text-black'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t === 'claims' ? 'Claims' : 'All Rewards'}
          </button>
        ))}
      </div>

      {tab === 'rewards' &&
        (rewardsQuery.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B68938] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading rewards...</p>
          </div>
        ) : !rewards?.data.length ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No rewards created yet</p>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    <th className={thClass}>Reward</th>
                    <th className={thClass}>Earning Required</th>
                    <th className={thClass}>Claims</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Created</th>
                    <th className={thClass}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {rewards.data.map((reward) => (
                    <motion.tr
                      key={reward._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getTaskAssetUrl(reward.photoUrl)}
                            alt={reward.title}
                            loading="lazy"
                            className="w-12 h-12 rounded-lg object-cover bg-gray-800"
                          />
                          <div className="max-w-xs">
                            <div className="font-medium">{reward.title}</div>
                            <div className="text-sm text-gray-400 truncate">
                              {reward.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reward.requiredCoins.toLocaleString()}{' '}
                        <span className="text-gray-600">TTL</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{reward.claimCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reward.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {reward.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(reward.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            toggleMutation.mutate({
                              params: { rewardId: reward._id },
                              body: {},
                            })
                          }
                          disabled={toggleMutation.isPending}
                          className="text-[#B68938] hover:text-[#E1BA73] transition-colors disabled:opacity-50"
                        >
                          {reward.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={rewardsPage}
              setPage={setRewardsPage}
              shown={rewards.data.length}
              total={rewards.totalRecords}
              totalPages={rewards.totalPages}
            />
          </div>
        ))}

      {tab === 'claims' &&
        (claimsQuery.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B68938] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading claims...</p>
          </div>
        ) : !claims?.data.length ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No reward claims yet</p>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    <th className={thClass}>User</th>
                    <th className={thClass}>Contact</th>
                    <th className={thClass}>Reward</th>
                    <th className={thClass}>Earning</th>
                    <th className={thClass}>Claimed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {claims.data.map((claim) => (
                    <motion.tr
                      key={claim._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {claim.user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{claim.user.phoneNumber}</div>
                        <div className="text-sm text-gray-400">{claim.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{claim.rewardTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {claim.coinsAtClaim.toLocaleString()}{' '}
                        <span className="text-gray-600">/ {claim.requiredCoins.toLocaleString()} TTL</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(claim.claimedAt).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={claimsPage}
              setPage={setClaimsPage}
              shown={claims.data.length}
              total={claims.totalRecords}
              totalPages={claims.totalPages}
            />
          </div>
        ))}

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add Reward</h3>
              <button
                onClick={closeCreate}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#B68938]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Earning to complete (TTL)
                </label>
                <input
                  type="number"
                  min={1}
                  value={requiredCoins}
                  onChange={(e) => setRequiredCoins(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#B68938]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#B68938]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Photo</label>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-32 rounded-lg border border-dashed border-gray-700 flex items-center justify-center text-gray-600 mb-2">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-sm text-gray-400"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={closeCreate}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg font-medium bg-[#B68938] text-black hover:bg-[#E1BA73] transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Create Reward'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
