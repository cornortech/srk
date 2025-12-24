import { useState, useEffect } from 'react';

export const useIsDesktop = (minWidth = 768): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);

    const handler = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler as EventListener);

    return () => {
      mediaQuery.removeEventListener('change', handler as EventListener);
    };
  }, [minWidth]);

  return isDesktop;
};
