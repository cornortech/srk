import { useState } from 'react';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { api } from '../../../lib/api';
import { useSRKAlert } from '@srk/shared/hooks';

type ViewMode = 'list' | 'create' | 'edit';

export const PackageManagementView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const { show } = useSRKAlert();
  
  const { data: packagesData, isLoading, refetch } = api.package.getAllSrkGrowPackages.useQuery(['packages']);
  const createPackageMutation = api.package.createGrowSocialMediaPackage.useMutation();
  const deletePackageMutation = api.package.deleteGrowSocialMediaPackage.useMutation();

  type SocialPlatform = 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'Facebook';
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    socialMediaPlatforms: [] as SocialPlatform[],
    features: [''],
    amountBeforeDiscount: 0,
    amount: 0,
    isPopular: false,
  });

  const handleCreatePackage = async () => {
    try {
      const result = await createPackageMutation.mutateAsync({
        body: formData,
      });

      if (result.status === 201) {
        show('Package created successfully!', 'success');
        refetch();
        setViewMode('list');
        resetForm();
      }
    } catch {
      show('Failed to create package', 'error');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const result = await deletePackageMutation.mutateAsync({
        params: { id },
        body: {},
      });

      if (result.status === 200) {
        show('Package deleted successfully!', 'success');
        refetch();
      }
    } catch {
      show('Failed to delete package', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      socialMediaPlatforms: [] as SocialPlatform[],
      features: [''],
      amountBeforeDiscount: 0,
      amount: 0,
      isPopular: false,
    });
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setFormData(prev => ({
      ...prev,
      socialMediaPlatforms: prev.socialMediaPlatforms.includes(platform)
        ? prev.socialMediaPlatforms.filter(p => p !== platform)
        : [...prev.socialMediaPlatforms, platform],
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading packages...</div>
      </div>
    );
  }

  const packages = packagesData?.body || [];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header - Always visible */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">
            <GradientText>Package Management</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">Create, edit, and manage grow packages</p>
        </div>
        {viewMode === 'list' && (
          <button
            onClick={() => {
              resetForm();
              setViewMode('create');
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#b68938] to-[#d4af37] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + Create Package
          </button>
        )}
      </div>

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No packages yet. Create your first package!</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <GlassCard key={pkg._id} hover>
                  <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                    {pkg.isPopular && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.socialMediaPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 bg-white/5 text-white text-xs rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 line-through">
                      ₹{pkg.amountBeforeDiscount}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      ₹{pkg.amount}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {pkg.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{pkg.features.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleDeletePackage(pkg._id)}
                      className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </GlassCard>
              ))
            )}
        </div>
      )}

      {viewMode === 'create' && (
        <div>
            <GlassCard>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Create New Package</h2>
                  <button
                    onClick={() => setViewMode('list')}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕ Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Package Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Package Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#b68938]"
                      placeholder="e.g., Premium Package"
                    />
                  </div>

                  {/* Amount Before Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount Before Discount
                    </label>
                    <input
                      type="number"
                      value={formData.amountBeforeDiscount}
                      onChange={(e) => setFormData({ ...formData, amountBeforeDiscount: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#b68938]"
                      placeholder="10000"
                    />
                  </div>

                  {/* Discounted Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discounted Amount
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#b68938]"
                      placeholder="8000"
                    />
                  </div>

                  {/* Is Popular */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-5 h-5 rounded border-white/10 bg-black/30 text-[#b68938] focus:ring-[#b68938]"
                    />
                    <label className="ml-2 text-sm text-gray-300">
                      Mark as Popular Package
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#b68938]"
                    placeholder="Package description..."
                  />
                </div>

                {/* Social Media Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Social Media Platforms
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook'] as const).map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          formData.socialMediaPlatforms.includes(platform)
                            ? 'bg-[#b68938] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#b68938]"
                          placeholder="Enter feature"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-[#b68938] hover:text-[#d4af37]"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-6">
                  <button
                    onClick={() => setViewMode('list')}
                    className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePackage}
                    disabled={createPackageMutation.isPending}
                    className="px-6 py-3 bg-gradient-to-r from-[#b68938] to-[#d4af37] text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {createPackageMutation.isPending ? 'Creating...' : 'Create Package'}
                  </button>
                </div>
              </div>
            </GlassCard>
        </div>
      )}
    </div>
  );
};
