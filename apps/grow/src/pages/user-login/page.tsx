import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/user-components/auth/LoginForm";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (email: string) => {
    console.log("User logged in:", email);
    navigate("/socialmedia-grow");
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
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

