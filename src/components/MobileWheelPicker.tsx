import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VALUE_PROPOSITIONS } from '../data/heroData';

interface MobileWheelPickerProps {
  reducedMotion?: boolean;
}

// Compact scroll metrics
const TRAVEL_PER_ITEM = 130; // px scroll per principle transition (3 transitions = 390px)
const HOLD_DISTANCE = 40;    // px brief hold on principle 04 before clean unpin
const TOTAL_SCROLL_DISTANCE = 3 * TRAVEL_PER_ITEM + HOLD_DISTANCE; // 430px total scroll travel

export const MobileWheelPicker: React.FC<MobileWheelPickerProps> = ({
  reducedMotion: propReducedMotion = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState<boolean>(propReducedMotion);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHeadingRevealed, setIsHeadingRevealed] = useState<boolean>(false);
  const [stickyHeight, setStickyHeight] = useState<number>(460);
  const [stageHeight, setStageHeight] = useState<number>(360);

  const scrollProgressRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Touch gesture state for direct scrubbing
  const touchStartYRef = useRef<number>(0);
  const touchStartProgressRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches || propReducedMotion);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches || propReducedMotion);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [propReducedMotion]);

  // Dynamic calibration of wheel stage height to fit available viewport without empty void
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        const vh = window.innerHeight;
        // Ample stage room for active description + clean clearance of adjacent items
        const calculatedStage = Math.max(380, Math.min(460, Math.round(vh * 0.52)));
        setStageHeight(calculatedStage);

        if (stickyRef.current) {
          const h = stickyRef.current.offsetHeight;
          if (h > 0) setStickyHeight(h);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Heading reveal trigger with quick crisp left-to-right reveal
  useEffect(() => {
    if (reducedMotion) {
      setIsHeadingRevealed(true);
      return;
    }

    const checkReveal = () => {
      if (headingRef.current) {
        const rect = headingRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 60) {
          setIsHeadingRevealed(true);
        }
      }
    };

    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    return () => window.removeEventListener('scroll', checkReveal);
  }, [reducedMotion]);

  const updateProgress = useCallback((rawTarget: number) => {
    const clamped = Math.max(0, Math.min(3, rawTarget));
    scrollProgressRef.current = clamped;
    setScrollProgress(clamped);

    const nearestInt = Math.max(0, Math.min(3, Math.round(clamped)));
    setActiveIndex(nearestInt);
  }, []);

  // Synchronized scroll scrubbing for smooth forward and reverse progression
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 640 ? 68 : 58;
      const scrollInsideTrack = stickyTop - rect.top;

      if (scrollInsideTrack <= 0) {
        if (scrollProgressRef.current !== 0) {
          updateProgress(0);
        }
        return;
      }

      // Progresses smoothly 0.0 to 3.0 across 300px, then holds at 3.0 before release
      const rotationTravel = 3 * TRAVEL_PER_ITEM;
      const targetProgress = Math.max(
        0,
        Math.min(3, (scrollInsideTrack / rotationTravel) * 3)
      );

      if (Math.abs(targetProgress - scrollProgressRef.current) > 0.002) {
        if (!animFrameIdRef.current) {
          animFrameIdRef.current = requestAnimationFrame(() => {
            animFrameIdRef.current = null;
            updateProgress(targetProgress);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [reducedMotion, updateProgress]);

  // Click on a principle to scroll directly to it
  const scrollToPrinciple = (targetIdx: number) => {
    if (reducedMotion || !trackRef.current) {
      updateProgress(targetIdx);
      return;
    }

    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const stickyTop = window.innerWidth >= 640 ? 68 : 58;
    const trackStart = scrollTop + rect.top - stickyTop;
    const targetScrollY = trackStart + targetIdx * TRAVEL_PER_ITEM;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  // Touch gesture listeners on the wheel container for direct thumb scrubbing
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartProgressRef.current = scrollProgressRef.current;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    const progressDelta = -deltaY / 100;
    const nextProg = Math.max(0, Math.min(3, touchStartProgressRef.current + progressDelta));
    updateProgress(nextProg);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Accessible fallback view for reduced motion
  if (reducedMotion) {
    return (
      <section
        id="why-choose-mobile"
        className="w-full px-4 pt-6 pb-8 max-w-md mx-auto flex flex-col"
      >
        <div className="mb-4">
          <span className="font-mono-tech text-[10px] sm:text-xs text-[#476800] uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#476800]" />
            CORE PHILOSOPHY &amp; DFM PRINCIPLES
          </span>
          <h2 className="font-display-tech text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight">
            WHY CHOOSE <span className="text-[#476800]">COSMIC CIRCUIT</span>?
          </h2>
        </div>

        <div className="w-full flex flex-col gap-4">
          {VALUE_PROPOSITIONS.map((item) => (
            <div key={item.num} className="border-b border-[#c4c7c7]/40 pb-3 last:border-b-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono-tech text-xs font-bold text-[#476800]">
                  {item.num}
                </span>
                <span className="text-[#c4c7c7] text-xs">—</span>
                <h3 className="font-display-tech text-base font-extrabold text-[#000000] tracking-tight uppercase">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#333735] leading-relaxed pl-5">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Visual center Y for the active principle within the wheel stage
  // Positioned at ~30% of stage height so that Title + expanded Description have full room below
  const centerY = Math.round(stageHeight * 0.30);

  // Wheel Items Geometry
  const itemsGeometry = VALUE_PROPOSITIONS.map((item, idx) => {
    const delta = idx - scrollProgress; // -3 to +3
    const absDelta = Math.abs(delta);
    const isCenterActive = absDelta < 0.42;
    const isVisible = absDelta < 1.45;

    // Dynamic, content-aware vertical displacement:
    // When delta < 0 (item is above active): spacing is ~75px
    // When delta > 0 (item is below active): spacing is 165px minimum, providing 24-30px
    // clear breathing room below the complete multi-line description of the active principle.
    let displacementY = 0;
    if (delta < 0) {
      displacementY = delta * 75;
    } else {
      displacementY = delta * 165;
    }

    // Scale decreases gently with distance from center
    const scale = Math.max(0.88, 1.0 - Math.min(0.12, absDelta * 0.08));

    // Opacity: center is 1.0; adjacent item is ~0.55; distant items fade smoothly
    const opacity = isCenterActive
      ? 1.0
      : !isVisible
      ? 0
      : Math.max(0.2, 1.0 - (absDelta - 0.42) * 0.8);

    return {
      item,
      idx,
      delta,
      absDelta,
      isCenterActive,
      isVisible,
      Y: displacementY,
      scale,
      opacity,
    };
  });

  return (
    <div
      ref={trackRef}
      id="why-choose-mobile-wheel-track"
      className="relative w-full"
      style={{
        height: `${stickyHeight + TOTAL_SCROLL_DISTANCE}px`,
      }}
    >
      {/* Sticky Stage: Positioned cleanly beneath header */}
      <div
        ref={stickyRef}
        className="sticky top-[58px] sm:top-[68px] w-full flex flex-col items-center px-4 sm:px-6 pt-3 pb-2 z-20"
      >
        <div className="w-full max-w-md mx-auto flex flex-col">
          {/* 1. Eyebrow Badge & Section Title with subtle left-to-right reveal */}
          <div
            ref={headingRef}
            className="mb-1 text-left will-change-[clip-path,transform,opacity]"
            style={{
              clipPath: isHeadingRevealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transform: isHeadingRevealed ? 'translateX(0)' : 'translateX(-10px)',
              opacity: isHeadingRevealed ? 1 : 0,
              transition:
                'clip-path 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out',
            }}
          >
            <div className="inline-flex items-center gap-1.5 border border-[#c4c7c7]/70 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs mb-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#476800] animate-pulse" />
              <span className="font-mono-tech text-[10px] sm:text-xs text-[#476800] uppercase tracking-widest font-semibold">
                CORE PHILOSOPHY &amp; DFM PRINCIPLES
              </span>
            </div>
            <h2 className="font-display-tech text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight leading-tight">
              WHY CHOOSE <span className="text-[#476800]">COSMIC CIRCUIT</span>?
            </h2>
          </div>

          {/* 2. Compact Status & Hint Bar */}
          <div className="flex items-center justify-between w-full pb-1 mb-1 border-b border-[#c4c7c7]/35 font-mono-tech text-[10px] sm:text-[11px] text-[#555a57]">
            <span className="flex items-center gap-1.5 font-bold text-[#191c1b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#476800]" />
              PRINCIPLE {VALUE_PROPOSITIONS[activeIndex].num} / 04
            </span>
            <span className="text-[#717774] tracking-wider uppercase flex items-center gap-1 font-medium">
              <span>SCROLL TO EXPLORE</span>
              <span className="text-[#476800] font-bold">↓</span>
            </span>
          </div>

          {/* 3. CURVED DOTTED WHEEL SELECTOR STAGE (Compact, centered, no blank void) */}
          <div
            className="w-full relative flex items-start select-none touch-pan-y overflow-hidden"
            style={{
              height: `${stageHeight}px`,
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* CURVED DOTTED TRACK GUIDE (Left Edge) */}
            <div
              className="w-7 h-full relative shrink-0 pointer-events-none flex items-start justify-center z-10"
              aria-hidden="true"
            >
              <svg
                width="28"
                height={stageHeight}
                viewBox={`0 0 28 ${stageHeight}`}
                className="overflow-visible"
              >
                {/* Curved neutral arc following the cylindrical profile */}
                <path
                  d={`M 22 16 C 6 ${Math.round(stageHeight * 0.22)}, 4 ${centerY}, 4 ${centerY} C 4 ${centerY + 30}, 8 ${Math.round(stageHeight * 0.78)}, 22 ${stageHeight - 16}`}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.22)"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />

                {/* Fixed center active indicator notch aligned with active title row */}
                <polygon
                  points={`1,${centerY - 4} 7,${centerY} 1,${centerY + 4}`}
                  fill="#476800"
                />

                {/* Dynamic tick marks aligned with principles along the arc */}
                {itemsGeometry.map(({ idx, Y, isCenterActive, isVisible }) => {
                  if (!isVisible) return null;
                  const tickY = centerY + Y;
                  if (tickY < 12 || tickY > stageHeight - 12) return null;
                  return (
                    <line
                      key={`tick-${idx}`}
                      x1="10"
                      y1={tickY}
                      x2={isCenterActive ? '24' : '18'}
                      y2={tickY}
                      stroke={isCenterActive ? '#476800' : 'rgba(0, 0, 0, 0.32)'}
                      strokeWidth={isCenterActive ? '2' : '1'}
                    />
                  );
                })}
              </svg>
            </div>

            {/* PRINCIPLE ITEMS CONTAINER */}
            <div className="relative flex-1 h-full overflow-visible">
              {itemsGeometry.map(
                ({ item, idx, isCenterActive, isVisible, Y, scale, opacity, absDelta }) => {
                  return (
                    <div
                      key={item.num}
                      onClick={() => scrollToPrinciple(idx)}
                      className="absolute left-2 right-0 cursor-pointer will-change-transform flex flex-col justify-start"
                      style={{
                        top: `${centerY}px`,
                        transform: `translate3d(0, ${Y}px, 0) scale(${scale.toFixed(3)})`,
                        transformOrigin: 'left center',
                        opacity,
                        display: isVisible ? 'flex' : 'none',
                        transition: isDraggingRef.current
                          ? 'none'
                          : 'opacity 0.15s ease-out',
                        zIndex: isCenterActive ? 20 : 10 - Math.round(absDelta),
                        WebkitFontSmoothing: 'antialiased',
                      }}
                    >
                      {/* Item Title Row: Green Dot / Active Accent + Number + Dash + Title */}
                      <div className="flex items-center gap-2">
                        {isCenterActive ? (
                          <span className="w-2 h-2 rounded-full bg-[#476800] shrink-0 shadow-[0_0_6px_#c8f179]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                        )}

                        <span
                          className={`font-mono-tech text-xs sm:text-sm font-bold transition-colors duration-200 ${
                            isCenterActive ? 'text-[#476800]' : 'text-[#717774]'
                          }`}
                        >
                          {item.num}
                        </span>

                        <span
                          className={`text-xs transition-colors duration-200 ${
                            isCenterActive ? 'text-[#a4aba6]' : 'text-[#c4c7c7]'
                          }`}
                        >
                          —
                        </span>

                        <h3
                          className={`font-display-tech tracking-tight uppercase transition-colors duration-200 ${
                            isCenterActive
                              ? 'text-[#000000] font-black text-base sm:text-lg'
                              : 'text-[#444748] font-bold text-sm sm:text-base'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>

                      {/* Active Description (Visually connected directly below title) */}
                      <div
                        className={`overflow-hidden pl-4 sm:pl-4 transition-all duration-300 ${
                          isCenterActive
                            ? 'opacity-100 max-h-40 mt-2 mb-2'
                            : 'opacity-0 max-h-0 mt-0 mb-0 pointer-events-none'
                        }`}
                      >
                        <p className="text-[13px] sm:text-sm text-[#262827] leading-[1.65] font-normal max-w-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWheelPicker;
