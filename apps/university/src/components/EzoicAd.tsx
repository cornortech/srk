import React, { useEffect } from 'react';

declare global {
  interface Window {
    ezstandalone: any;
  }
}

interface EzoicAdProps {
  placementId: number;
}

export const EzoicAd: React.FC<EzoicAdProps> = ({ placementId }) => {
  useEffect(() => {
    // This ensures the script runs AFTER the <div> is rendered on the screen
    if (window.ezstandalone) {
      window.ezstandalone.cmd.push(function () {
        window.ezstandalone.showAds(placementId);
      });
    }

    // Dynamic Content Cleanup: When this component unmounts (changing pages, etc)
    return () => {
      if (window.ezstandalone) {
        window.ezstandalone.cmd.push(function () {
          window.ezstandalone.destroyPlaceholders(placementId);
        });
      }
    };
  }, [placementId]);

  return (
    <div
      id={`ezoic-pub-ad-placeholder-${placementId}`}
      style={{ minHeight: '280px', minWidth: '300px', width: '100%' }}
    />
  );
};
