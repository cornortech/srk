import { useState, useCallback } from 'react';

interface Alert {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const useAlert = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback(
    (message: string, type: Alert['type'] = 'info') => {
      const id = Date.now().toString();
      setAlerts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeAlert(id);
      }, 5000);
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return { alerts, addAlert, removeAlert };
};
