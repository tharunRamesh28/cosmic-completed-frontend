import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Radio, Globe, Compass, Bot } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { CAPABILITIES } from '../data/cosmicData';

interface CapabilitiesCoreProps {
  onStartProjectForService?: (serviceName: string) => void;
}

export const CapabilitiesCore: React.FC<CapabilitiesCoreProps> = () => {
  const [activeCardId, setActiveCardId] = useState<string>('hardware');
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const activeCardIdRef = useRef<string>('hardware');

  useEffect(() => {
    // Scroll-based card highlighting for mobile viewports with anti-flicker hysteresis
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        if (activeCardId !== null) setActiveCardId('');
        return;
      }

      const focalY = window.innerHeight * 0.44;
      let closestId: string | null = null;
      let minDistance = Infinity;

      // Current distance of the active card
      let currentActiveDistance = Infinity;
      const currentActiveEl = cardRefs.current.get(activeCardIdRef.current);
      if (currentActiveEl) {
        const rect = currentActiveEl.getBoundingClientRect();
        currentActiveDistance = Math.abs(rect.top + rect.height / 2 - focalY);
      }

      cardRefs.current.forEach((el, id) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - focalY);

        if (dist < minDistance && rect.bottom > 60 && rect.top < window.innerHeight - 60) {
          minDistance = dist;
          closestId = id;
        }
      });

      // Hysteresis: only switch if the closest card is at least 24px closer than current active
      if (closestId && closestId !== activeCardIdRef.current) {
        if (minDistance + 24 < currentActiveDistance) {
          activeCardIdRef.current = closestId;
          setActiveCardId(closestId);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeCardId]);

  const getServiceIcon = (iconName: string, isActive: boolean) => {
    const iconClass = `w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-200 ${
      isActive ? 'text-[#476800]' : 'text-[#191c1b]'
    }`;
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'Radio':
        return <Radio className={iconClass} />;
      case 'Globe':
        return <Globe className={iconClass} />;
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'Bot':
        return <Bot className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start end', 'end center'],
  });

  // Smooth scroll progress with a responsive spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.5,
  });

  // Starts from right (positive x offset) and glides smoothly into place (0px)
  // Percentage based so it works seamlessly on both mobile (screens ~360px-450px) and desktop (>1024px)
  const headerX = useTransform(smoothProgress, [0, 1], ['55%', '0%']);
  const headerOpacity = useTransform(smoothProgress, [0, 0.45, 1], [0.15, 0.75, 1]);

  return (
    <section id="services" className="pt-8 pb-6 sm:py-14 md:py-28 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto overflow-hidden">
      {/* Section Header with smooth scroll-linked glide from right to left */}
      <div ref={headerRef} className="mb-5 sm:mb-10 md:mb-16">
        <motion.div
          style={{
            x: headerX,
            opacity: headerOpacity,
          }}
          className="will-change-transform"
        >
          <span className="font-mono-tech text-xs md:text-sm text-[#444748] tracking-widest uppercase flex items-center mb-1.5 sm:mb-2">
            <span className="w-6 sm:w-8 h-px bg-[#000000] mr-3 sm:mr-4 inline-block" />
            Engineering Disciplines
          </span>
          <h2 className="font-display-tech text-2xl sm:text-4xl md:text-5xl font-bold text-[#000000] tracking-tight">
            WHAT WE BUILD
          </h2>
        </motion.div>
      </div>

      {/* Clean Single-Column on Mobile, Multi-Column on Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {CAPABILITIES.map((cap) => {
          const isActive = activeCardId === cap.id;
          return (
            <div
              key={cap.id}
              ref={(el) => {
                if (el) cardRefs.current.set(cap.id, el);
                else cardRefs.current.delete(cap.id);
              }}
              className={`bg-[#ffffff] rounded-xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between group relative select-none transition-all duration-200 ${
                isActive
                  ? 'border border-[#b9e86a] shadow-[0_0_18px_rgba(185,232,106,0.25)] ring-1 ring-[#b9e86a]/40 -translate-y-0.5'
                  : 'border border-[#c4c7c7]/60 shadow-xs hover:border-[#b9e86a] hover:shadow-[0_0_24px_rgba(185,232,106,0.3)] hover:-translate-y-0.5'
              }`}
              id={`capability-card-${cap.id}`}
            >
              <div>
                {/* Header: Icon + Technical Identifier aligned */}
                <div className="flex justify-between items-center mb-3 sm:mb-5">
                  <div
                    className={`w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'border border-[#b9e86a] bg-[#c8f179]/20 shadow-2xs'
                        : 'bg-[#f3f4f1] border border-[#c4c7c7]/50 group-hover:border-[#b9e86a] group-hover:bg-[#c8f179]/20'
                    }`}
                  >
                    {getServiceIcon(cap.iconName, isActive)}
                  </div>
                  <span
                    className={`font-mono-tech text-[10px] px-2 py-0.5 rounded transition-all duration-200 font-medium ${
                      isActive
                        ? 'border border-[#b9e86a]/70 text-[#476800] bg-[#f4fbe9]'
                        : 'text-[#444748] border border-[#c4c7c7]/50 bg-[#f9faf7]'
                    }`}
                  >
                    {cap.tag}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`font-display-tech text-lg sm:text-2xl font-bold mb-1.5 sm:mb-2 transition-colors duration-200 ${
                    isActive ? 'text-[#476800]' : 'text-[#000000] group-hover:text-[#476800]'
                  }`}
                >
                  {cap.title}
                </h3>

                {/* Content-driven description (no artificial min-height) */}
                <p className="font-display-tech text-xs sm:text-sm text-[#444748] leading-relaxed">
                  {cap.shortDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CapabilitiesCore;
