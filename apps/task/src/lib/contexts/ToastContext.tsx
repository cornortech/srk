import { Toast } from '@srk/task/components/ui/Toast';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    id: number;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      // Clear current toast first to ensure re-mount if it's the same message/type
      setToast(null);
      // Use a small timeout to allow React to process the unmount before re-mounting
      setTimeout(() => {
        setToast({ message, type, id: Date.now() });
      }, 10);
    },
    []
  );

  const success = useCallback(
    (msg: string) => showToast(msg, 'success'),
    [showToast]
  );
  const error = useCallback(
    (msg: string) => showToast(msg, 'error'),
    [showToast]
  );
  const info = useCallback(
    (msg: string) => showToast(msg, 'info'),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
