import React, { useState, useEffect } from 'react';
import { DesktopHero } from './DesktopHero';
import { MobileHero } from './MobileHero';

export interface HeroProps {
  onStartProject: () => void;
  onExploreWork?: () => void;
  isDarkTheme?: boolean;
}

export const Hero: React.FC<HeroProps> = (props) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 1024;
      setIsMobile((prev) => (prev !== nextIsMobile ? nextIsMobile : prev));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full text-[#191c1b] selection:bg-[#c8f179] selection:text-[#000000]">
      {isMobile ? (
        <MobileHero {...props} />
      ) : (
        <DesktopHero {...props} />
      )}
    </div>
  );
};

export default Hero;
