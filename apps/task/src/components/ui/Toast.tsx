import { ToastType } from 'apps/grow/src/lib/types/dashboard';
import { CheckCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GOLD_ACCENT, GOLD_PRIMARY } from './constants/index';

interface ToastProps {
  message: string | null;
  type?: ToastType;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || message === null) return null;

  const baseClasses: string =
    'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 ease-out flex items-center gap-2';

  let typeClasses: string = '';

  switch (type) {
    case 'success':
      typeClasses = `bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border border-emerald-500/30`;
      break;
    case 'error':
      typeClasses = `bg-gradient-to-r from-rose-600 to-rose-500 text-white border border-rose-500/30`;
      break;
    case 'info':
      typeClasses = `bg-gradient-to-r from-${GOLD_ACCENT} to-${GOLD_PRIMARY} text-white border border-${GOLD_PRIMARY}/30`;
      break;
    default:
      typeClasses = 'bg-gray-700 text-white';
      break;
  }

  return (
    <div
      className={`${baseClasses} ${typeClasses} backdrop-blur-md`}
      role="alert"
    >
      {type === 'success' && <CheckCircleIcon className="w-4 h-4" />}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};
