import { useState, useEffect } from 'react';
export interface AuthUser {
  _id: string;
  universityId?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  country?: string;
  gender?: string;
  dob?: string;
  bankDetailsId?: string;
}

export const useAuthAffiliateVerification = () => {
  const readFromStorage = (): { user: AuthUser | null; isAuthenticated: boolean } => {
    try {
      const stored = localStorage.getItem('srkAffiliate-auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const u = parsed?.state?.user;
        const auth = parsed?.state?.isAuthenticated;
        if (u && auth) {
          return { user: u as AuthUser, isAuthenticated: true };
        }
      }
    } catch (error) {
      console.error('Error parsing authState:', error);
    }
    return { user: null, isAuthenticated: false };
  };

  const [state, setState] = useState(() => readFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setState(readFromStorage());
    setIsLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'srkAffiliate-auth-storage') {
        setState(readFromStorage());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { user: state.user, isAuthenticated: state.isAuthenticated, isLoading };
};
