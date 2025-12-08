import React, { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { X, Mail, Lock, Upload, Loader2, Eye, EyeOff, CheckCircle2, Clock, AlertCircle, CheckCircle, XCircle, FileText, Calendar, Shield } from "lucide-react";
import { LoginModalProps, UserData } from "../../../lib/types/types";

const hashPassword = (password: string) => btoa(password);

// In-memory user storage
export let usersDatabase: UserData[] = [];

const LoginModel: React.FC<LoginModalProps & { hasRegistered: boolean; onRegistrationComplete: () => void }> = ({
  onClose,
  onLoginSuccess,
  hasRegistered,
  onRegistrationComplete
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(!hasRegistered);
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'pending' | 'approved' | 'rejected'>('idle');
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update pending users list
    const interval = setInterval(() => {
      setPendingUsers(usersDatabase.filter(user => !user.approved));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleBackdropClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) onClose();
  };

const handleRegister = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);

  await new Promise((r) => setTimeout(r, 1200));

  // Check if user already exists
  if (usersDatabase.some((u) => u.email === email)) {
    alert("User already exists");
    setLoading(false);
    return;
  }

  // CREATE NEW USER AND SAVE TO MEMORY
  const newUser: UserData = {
    id: crypto.randomUUID(),
    email,
    password: hashPassword(password),
    approved: false,
    kycStatus: "pending",
    createdAt: new Date().toISOString(),
    lastLogin: "",
    kycDocuments: kycFile ? [kycFile] : [],
  };

  usersDatabase.push(newUser); // IMPORTANT ✔

  setLoading(false);
  setRegistrationStatus("pending");
};


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Find user in memory
    const user = usersDatabase.find(
      (u: UserData) =>
        u.email === email && u.password === hashPassword(password)
    );

    if (!user) {
      alert("Invalid email or password");
      setLoading(false);
      return;
    }

    // Check if user is approved
    if (!user.approved) {
      alert("Your account is pending approval. Please wait for admin approval.");
      setLoading(false);
      return;
    }

    user.lastLogin = new Date().toISOString();
    onLoginSuccess(user);
  };

  const handleApprove = (userId: string) => {
    const user = usersDatabase.find(u => u.id === userId);
    if (user) {
      user.approved = true;
      user.kycStatus = 'approved';
      setPendingUsers(usersDatabase.filter(u => !u.approved));
      alert(`User ${user.email} has been approved! They can now login.`);
    }
  };

  const handleReject = (userId: string) => {
    const user = usersDatabase.find(u => u.id === userId);
    if (user) {
      user.kycStatus = 'rejected';
      const index = usersDatabase.indexOf(user);
      usersDatabase.splice(index, 1);
      setPendingUsers(usersDatabase.filter(u => !u.approved));
      alert(`User ${user.email} has been rejected!`);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[1000] p-4"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[120px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        ref={modalRef}
        className="w-full max-w-2xl bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-8 rounded-3xl border border-[#b68938]/20 shadow-2xl shadow-[#b68938]/10 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#b68938]/5 via-transparent to-[#e1ba73]/5 pointer-events-none" />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(182, 137, 56, 0.3), transparent)",
            filter: "blur(20px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent">
                {registrationStatus === 'pending' ? "Registration Pending" : isRegisterMode ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {registrationStatus === 'pending' ? "Waiting for admin approval" : isRegisterMode ? "Join the SRK community" : "Sign in to continue"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="text-white w-5 h-5" />
            </motion.button>
          </div>

          {/* PENDING APPROVAL STATUS */}
          {registrationStatus === 'pending' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col"
            >
              {/* User Pending Status */}
              <div className="flex flex-col items-center justify-center py-8 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                  <Clock className="w-20 h-20 text-[#b68938]" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-3">Registration Submitted!</h3>
                <p className="text-gray-400 text-center mb-6 max-w-sm">
                  Your account has been created and is pending admin approval. You'll be able to login once your account is approved.
                </p>

                <div className="w-full bg-black/40 rounded-xl p-4 border border-[#b68938]/20 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#e1ba73] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-white mb-1">What's next?</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Admin will review your KYC document</li>
                        <li>You'll receive approval notification</li>
                        <li>Login with your credentials after approval</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setRegistrationStatus('idle');
                    setIsRegisterMode(false);
                    onRegistrationComplete();
                    setEmail("");
                    setPassword("");
                    setKycFile(null);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] text-black rounded-xl font-bold mb-6"
                  style={{
                    boxShadow: "0 0 30px rgba(182, 137, 56, 0.3)",
                  }}
                >
                  Go to Login
                </motion.button>
              </div>

              {/* Admin Approval Panel - ALWAYS VISIBLE */}
              <div className="border-t border-[#b68938]/20 pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#b68938]/20 to-[#e1ba73]/20 rounded-xl border border-[#b68938]/30">
                    <Shield className="w-6 h-6 text-[#b68938]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent">
                      Admin Approval Panel
                    </h3>
                    <p className="text-xs text-gray-500">
                      {pendingUsers.length} pending {pendingUsers.length === 1 ? 'request' : 'requests'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {pendingUsers.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/40 rounded-xl p-8 border border-green-500/20 text-center"
                    >
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-1">All Clear!</p>
                      <p className="text-gray-400 text-sm">No pending approvals at the moment</p>
                    </motion.div>
                  ) : (
                    pendingUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-black/60 to-black/40 rounded-xl p-5 border border-[#b68938]/30 hover:border-[#b68938]/50 transition-all shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-[#b68938]" />
                              <span className="text-white font-semibold text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span>•</span>
                              <span>{new Date(user.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-yellow-500/30"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </motion.div>
                        </div>

                        {user.kycDocuments && user.kycDocuments[0] && (
                          <div className="flex items-center gap-3 mb-4 text-xs bg-black/60 rounded-lg p-3 border border-[#b68938]/20">
                            <div className="p-2 bg-[#b68938]/20 rounded-lg">
                              <FileText className="w-5 h-5 text-[#e1ba73]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium text-white">{user.kycDocuments[0].name}</p>
                              <p className="text-gray-500 text-xs">{(user.kycDocuments[0].size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleApprove(user.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleReject(user.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-500/20"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ) : isRegisterMode ? (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block font-medium">Email Address</label>
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

              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block font-medium">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block font-medium">KYC Document</label>
                <div className="relative group">
                  <input
                    type="file"
                    id="kyc-upload"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setKycFile(e.target.files?.[0] || null)
                    }
                    required
                  />
                  <label
                    htmlFor="kyc-upload"
                    className="flex items-center gap-3 w-full bg-black/40 text-white px-4 py-4 rounded-xl border border-dashed border-white/20 hover:border-[#b68938]/50 hover:bg-black/60 transition-all cursor-pointer group"
                  >
                    <Upload className="w-5 h-5 text-gray-500 group-hover:text-[#b68938] transition-colors" />
                    <span className="text-gray-400 group-hover:text-white transition-colors flex-1">
                      {kycFile ? kycFile.name : "Choose file..."}
                    </span>
                    {kycFile && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </label>
                </div>
                <p className="text-xs text-gray-600 mt-2">Accepted: PDF, JPG, PNG (Max 5MB)</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="relative w-full py-4 mt-2 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-[length:200%_100%] text-black rounded-xl font-bold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                style={{
                  boxShadow: "0 0 30px rgba(182, 137, 56, 0.3)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: loading ? ["-100%", "100%"] : "0%" }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </span>
              </motion.button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block font-medium">Email Address</label>
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

              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block font-medium">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-black/40 text-white pl-12 pr-12 py-4 rounded-xl border border-white/10 focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b68938] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="relative w-full py-4 mt-2 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-[length:200%_100%] text-black rounded-xl font-bold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                style={{
                  boxShadow: "0 0 30px rgba(182, 137, 56, 0.3)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: loading ? ["-100%", "100%"] : "0%" }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </motion.button>
            </form>
          )}

          {/* Footer */}
          {registrationStatus !== 'pending' && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                By continuing, you agree to our{" "}
                <span className="text-[#b68938] hover:text-[#e1ba73] cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModel;