import React, { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface LoginFormProps {
  onLoginSuccess?: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      console.log('Login attempt:', { email, password });

      if (onLoginSuccess) {
        onLoginSuccess(email);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const handleBuyPackage = () => {
    navigate('/landing/packages');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-2xl p-8 border border-[#b68938]/20 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="relative">
            <label className="text-sm text-gray-400 mb-2 block font-medium">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
              <input
                type="email"
                className="w-full bg-black/40 text-white pl-12 pr-4 py-4 rounded-xl border border-white/10 focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="text-sm text-gray-400 mb-2 block font-medium">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-black/40 text-white pl-12 pr-12 py-4 rounded-xl border border-white/10 focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b68938] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="relative w-full py-4 mt-2 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-[length:200%_100%] text-black rounded-xl font-bold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            style={{
              boxShadow: '0 0 30px rgba(182, 137, 56, 0.3)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: loading ? ['-100%', '100%'] : '0%' }}
              transition={{
                duration: 1,
                repeat: loading ? Infinity : 0,
                ease: 'linear',
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </motion.button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4 text-[13px]">
          <p> Haven't bought package yet?</p>
          <button
            className="flex items-center justify-center text-secondary hover:italic"
            onClick={handleBuyPackage}
          >
            Buy Now
            <ArrowRight className="h-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            By continuing, you agree to our{' '}
            <span className="text-[#b68938] hover:text-[#e1ba73] cursor-pointer transition-colors">
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
