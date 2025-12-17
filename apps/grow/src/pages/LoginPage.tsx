import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/user-components/auth/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (email: string) => {
    console.log('User logged in:', email);
    navigate('/dashboard');
  };

  const handleBuyPackage = () => {
    navigate('/', {
      state: { scrollTo: 'packages' },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center p-4">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[120px] animate-pulse" />
      </div>
      {/* Login Form Container */}
      <div className="relative z-10 w-full">
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onBuyPackage={handleBuyPackage}
        />
      </div>

      {/* Mock Login Dev Tools */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
        <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">
          Dev Tools: Mock Login
        </p>
        <button
          onClick={() => {
            const mockUser = {
              id: 'mock-approved',
              name: 'Demo User',
              email: 'demo@srk.com',
              kycStatus: 'approved',
              approved: true,
              country: 'Nepal',
              phone: 1234567890,
              kycDocuments: [],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            localStorage.setItem(
              'srkgrow-activesession',
              JSON.stringify(mockUser)
            );
            navigate('/socialmedia-grow');
          }}
          className="px-3 py-2 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 border border-green-500/30 transition-colors"
        >
          Login as Approved
        </button>
        <button
          onClick={() => {
            const mockUser = {
              id: 'mock-pending',
              name: 'Pending User',
              email: 'pending@srk.com',
              kycStatus: 'pending',
              approved: false,
              country: 'Nepal',
              phone: 1234567890,
              kycDocuments: [],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            localStorage.setItem(
              'srkgrow-activesession',
              JSON.stringify(mockUser)
            );
            navigate('/grow/verification');
          }}
          className="px-3 py-2 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30 border border-blue-500/30 transition-colors"
        >
          Login as Pending
        </button>
        <button
          onClick={() => {
            const mockUser = {
              id: 'mock-rejected',
              name: 'Rejected User',
              email: 'rejected@srk.com',
              kycStatus: 'rejected',
              approved: false,
              country: 'Nepal',
              phone: 1234567890,
              transactionId: 'TXN-REJECTED-001',
              paymentProofUrl:
                'https://via.placeholder.com/300x200?text=Payment+Proof',
              kycDocuments: [
                {
                  id: 'doc1',
                  name: 'citizenship_front.jpg',
                  size: 1024 * 1024 * 2,
                  type: 'image/jpeg',
                  url: 'https://via.placeholder.com/100?text=Doc+1',
                  status: 'rejected',
                  submittedAt: new Date().toISOString(),
                },
                {
                  id: 'doc2',
                  name: 'citizenship_back.jpg',
                  size: 1024 * 1024 * 2,
                  type: 'image/jpeg',
                  url: 'https://via.placeholder.com/100?text=Doc+2',
                  status: 'rejected',
                  submittedAt: new Date().toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            localStorage.setItem(
              'srkgrow-activesession',
              JSON.stringify(mockUser)
            );
            navigate('/grow/verification');
          }}
          className="px-3 py-2 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 border border-red-500/30 transition-colors"
        >
          Login as Rejected
        </button>
      </div>
    </div>
  );
};
