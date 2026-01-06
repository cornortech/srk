import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ScrollIntent = string | null;

export const useScrollIntent = (
  sectionRefMap: Record<string, React.RefObject<HTMLElement>>
) => {
  const location = useLocation();

  useEffect(() => {
    const section = location.state?.scrollTo as ScrollIntent;
    if (section && sectionRefMap[section]?.current) {
      requestAnimationFrame(() => {
        sectionRefMap[section].current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location.state, sectionRefMap]);
};
