import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';

export const CreateUserView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Client',
    package: 'SRK Basic',
    balance: '0',
    promoCode: '',
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      alert(
        `User ${formData.name} created successfully with promo code: ${
          formData.promoCode || 'None'
        }`
      );
      setFormData({
        name: '',
        email: '',
        role: 'Client',
        package: 'SRK Basic',
        balance: '0',
        promoCode: '',
      });
    },
    [formData.name, formData.promoCode]
  );

  const handleInputChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Create New User</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Register new clients or affiliates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={handleInputChange('role')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent appearance-none pr-8"
                    >
                      <option value="Client">Client</option>
                      <option value="Affiliate">Affiliate</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Package
                  </label>
                  <div className="relative">
                    <select
                      value={formData.package}
                      onChange={handleInputChange('package')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent appearance-none pr-8"
                    >
                      <option value="SRK Basic">SRK Basic (₹8,249)</option>
                      <option value="SRK Gold">SRK Gold (₹24,916)</option>
                      <option value="SRK Prime">SRK Prime (₹41,583)</option>
                      <option value="SRK Elite">SRK Elite (₹83,166)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Initial Balance (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.balance}
                      onChange={handleInputChange('balance')}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-8 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={handleInputChange('promoCode')}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    placeholder="Enter promo code"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(182,137,56,0.5)] relative overflow-hidden"
                style={{ background: THEME.colors.goldGradient }}
              >
                <span className="relative z-10">Create User Account</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </form>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">142</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-sm text-gray-400">Active Affiliates</p>
                <p className="text-2xl font-bold text-white">86</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-sm text-gray-400">Avg Balance</p>
                <p className="text-2xl font-bold text-white">₹1,03,792</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};
