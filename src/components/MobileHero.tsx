import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ENGINEERING_DISCIPLINES } from '../data/heroData';
import { MobileWheelPicker } from './MobileWheelPicker';

interface MobileHeroProps {
  onStartProject: () => void;
  onExploreWork?: () => void;
  isDarkTheme?: boolean;
}

const TOTAL_FRAMES = 300;
const MAX_CONCURRENT_LOADS = 4;

export const MobileHero: React.FC<MobileHeroProps> = ({ onStartProject }) => {
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const robotWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [contentOpacity, setContentOpacity] = useState<number>(1);
  const [contentTranslateY, setContentTranslateY] = useState<number>(0);
  const [robotCenterOffset, setRobotCenterOffset] = useState<number>(0);

  // Frame Cache & Queue State
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingSetRef = useRef<Set<number>>(new Set());
  const pendingQueueRef = useRef<number[]>([]);
  const activeLoadCountRef = useRef<number>(0);

  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const animFrameIdRef = useRef<number | null>(null);

  const getFrameUrl = (idx: number) => {
    const num = (idx + 1).toString().padStart(4, '0');
    return `/frames/robot_arm/mobile/frame_${num}.webp`;
  };

  const renderToCanvas = useCallback((canvas: HTMLCanvasElement, frameIdx: number) => {
    let imgToDraw: HTMLImageElement | null = imagesRef.current[frameIdx];

    // Nearest loaded frame fallback to avoid blank frames or flicker
    if (!imgToDraw) {
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        if (frameIdx - delta >= 0 && imagesRef.current[frameIdx - delta]) {
          imgToDraw = imagesRef.current[frameIdx - delta];
          break;
        }
        if (frameIdx + delta < TOTAL_FRAMES && imagesRef.current[frameIdx + delta]) {
          imgToDraw = imagesRef.current[frameIdx + delta];
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2.0, window.devicePixelRatio || 1);
    const canvasCssW = canvas.clientWidth || 360;
    const canvasCssH = canvas.clientHeight || 210;

    const targetWidth = Math.round(canvasCssW * dpr);
    const targetHeight = Math.round(canvasCssH * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasCssW, canvasCssH);

    // Source frames are 540x304.
    // Full robot bounds across all frames: x=[41..531] (w=490), y=[6..288] (h=282).
    // Maintain a consistent camera distance throughout the animation.
    const scale = Math.min(
      (canvasCssW * 0.94) / 492.0,
      (canvasCssH * 0.94) / 284.0
    );

    const dw = 540.0 * scale;
    const dh = 304.0 * scale;
    // Perfectly center in canvas without zoom distortion
    const dx = (canvasCssW - dw) / 2.0;
    const dy = (canvasCssH - dh) / 2.0;

    ctx.drawImage(imgToDraw, dx, dy, dw, dh);
    ctx.restore();
  }, []);

  const drawFrame = useCallback((frameIdx: number) => {
    if (canvasRef.current) {
      renderToCanvas(canvasRef.current, frameIdx);
    }
    lastDrawnFrameRef.current = frameIdx;
  }, [renderToCanvas]);

  const triggerDraw = useCallback(() => {
    if (!animFrameIdRef.current) {
      animFrameIdRef.current = requestAnimationFrame(() => {
        animFrameIdRef.current = null;
        drawFrame(currentFrameRef.current);
      });
    }
  }, [drawFrame]);

  // Process image loading queue with mobile-appropriate concurrency
  const processQueue = useCallback(() => {
    while (
      activeLoadCountRef.current < MAX_CONCURRENT_LOADS &&
      pendingQueueRef.current.length > 0
    ) {
      const idx = pendingQueueRef.current.shift();
      if (idx === undefined) break;

      if (imagesRef.current[idx] || loadingSetRef.current.has(idx)) {
        continue;
      }

      loadingSetRef.current.add(idx);
      activeLoadCountRef.current++;

      const primaryUrl = getFrameUrl(idx);
      const img = new Image();

      const onComplete = (loadedImg: HTMLImageElement | null) => {
        loadingSetRef.current.delete(idx);
        activeLoadCountRef.current--;
        if (loadedImg) {
          imagesRef.current[idx] = loadedImg;
          triggerDraw();
        }
        processQueue();
      };

      img.onload = () => onComplete(img);
      img.onerror = () => {
        const fallbackUrl = `/frames/robot_arm/frame_${(idx + 1).toString().padStart(4, '0')}.webp`;
        const fallbackImg = new Image();
        fallbackImg.onload = () => onComplete(fallbackImg);
        fallbackImg.onerror = () => onComplete(null);
        fallbackImg.src = fallbackUrl;
      };

      img.src = primaryUrl;
    }
  }, [triggerDraw]);

  // Dynamically prioritize nearby frames based on scroll position
  const prioritizeNearbyFrames = useCallback((centerFrame: number) => {
    const range = 8;
    const start = Math.max(0, centerFrame - 3);
    const end = Math.min(TOTAL_FRAMES - 1, centerFrame + range);

    const highPriority: number[] = [];
    for (let i = start; i <= end; i++) {
      if (!imagesRef.current[i] && !loadingSetRef.current.has(i)) {
        highPriority.push(i);
      }
    }

    if (highPriority.length > 0) {
      pendingQueueRef.current = [
        ...highPriority,
        ...pendingQueueRef.current.filter((idx) => !highPriority.includes(idx)),
      ];
      processQueue();
    }
  }, [processQueue]);

  // Setup initial loading sequence & handle prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Immediate load of Frame 0 (initial exploded frame)
    const img0 = new Image();
    img0.onload = () => {
      imagesRef.current[0] = img0;
      drawFrame(0);
    };
    img0.src = getFrameUrl(0);

    // Immediate load of Frame 299 (fully assembled frame)
    const imgEnd = new Image();
    imgEnd.onload = () => {
      imagesRef.current[TOTAL_FRAMES - 1] = imgEnd;
      if (currentFrameRef.current === TOTAL_FRAMES - 1) {
        drawFrame(TOTAL_FRAMES - 1);
      }
    };
    imgEnd.src = getFrameUrl(TOTAL_FRAMES - 1);

    if (mediaQuery.matches) {
      const targetIdx = TOTAL_FRAMES - 1;
      currentFrameRef.current = targetIdx;
      pendingQueueRef.current.unshift(targetIdx);
      processQueue();
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }

    // Queue key frames progressively for mobile
    for (let i = 1; i < 20; i++) {
      pendingQueueRef.current.push(i);
    }
    for (let i = 20; i < TOTAL_FRAMES - 1; i += 2) {
      pendingQueueRef.current.push(i);
    }
    processQueue();

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [drawFrame, processQueue]);

  // Mobile scroll metrics:
  // ASSEMBLY_TRAVEL: Scroll distance to assemble from Frame 0 to Frame 299
  // HOLD_TRAVEL: Scroll distance to hold fully assembled robot in view
  // RELEASE_MARGIN: Breathing room before philosophy section enters
  const ASSEMBLY_TRAVEL = 280;
  const HOLD_TRAVEL = 60;
  const TOTAL_HERO_TRAVEL = ASSEMBLY_TRAVEL + HOLD_TRAVEL;

  // Mobile scroll scrubbing controller
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // Hero Content Fade & Translate:
      // Over the first 140px of scroll, the text smoothly fades and rises slightly
      const fadeProgress = Math.max(0, Math.min(1, scrollY / 140));
      setContentOpacity(1 - fadeProgress);
      setContentTranslateY(-fadeProgress * 28);

      // Robot Canvas Centering:
      // As the text fades, the robot moves smoothly up into the vertical center
      const centerProgress = Math.max(0, Math.min(1, scrollY / ASSEMBLY_TRAVEL));
      setRobotCenterOffset(-centerProgress * 135);

      // Assembly Frame Scrubbing (0 to 299):
      let targetFrame = 0;
      if (scrollY <= 0) {
        targetFrame = 0;
      } else if (scrollY >= ASSEMBLY_TRAVEL) {
        targetFrame = TOTAL_FRAMES - 1; // Hold Frame 299
      } else {
        const progress = Math.max(0, Math.min(1, scrollY / ASSEMBLY_TRAVEL));
        targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));
      }

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        triggerDraw();
        prioritizeNearbyFrames(targetFrame);
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
  }, [reducedMotion, triggerDraw, prioritizeNearbyFrames]);

  return (
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* 1. HERO PINNED ASSEMBLY TRACK                                             */}
      {/*    - Opening Screen: Hero text + Exploded Robot fit within mobile viewport */}
      {/*    - Scroll Assembly: Scrub from Frame 0 to 299                            */}
      {/*    - Final Hold: Stable assembled robot pose                               */}
      {/*    - Clean Release: Hero finishes completely BEFORE Philosophy enters      */}
      {/* ========================================================================= */}
      <div
        ref={heroTrackRef}
        id="hero-robot-assembly-track"
        className="relative w-full"
        style={{
          height: reducedMotion
            ? 'auto'
            : `calc(100svh - 70px + ${TOTAL_HERO_TRAVEL}px)`,
        }}
      >
        {/* Sticky Full Mobile Stage */}
        <div
          className={`${
            reducedMotion
              ? 'relative py-6'
              : 'sticky top-[70px] sm:top-[76px] h-[calc(100svh-70px)] sm:h-[calc(100svh-76px)]'
          } w-full flex flex-col justify-between items-center px-4 sm:px-6 py-2 overflow-hidden z-10`}
        >
          {/* A. HERO CONTENT (Headline, description, tags, CTA) */}
          <div
            ref={heroContentRef}
            id="hero-mobile"
            className="w-full max-w-md mx-auto flex flex-col items-center text-center shrink-0 pt-3.5 sm:pt-4 transition-transform duration-75 ease-out"
            style={{
              opacity: reducedMotion ? 1 : contentOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${contentTranslateY}px)`,
              pointerEvents: contentOpacity < 0.15 ? 'none' : 'auto',
            }}
          >
            {/* 1. Eyebrow Status Badge */}
            <div className="inline-flex items-center gap-2 border border-[#c4c7c7] px-3 py-0.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c8f179] animate-pulse shadow-[0_0_8px_#c8f179]" />
              <span className="font-mono-tech text-[10px] sm:text-xs text-[#444748] uppercase tracking-wider font-semibold">
                End-to-End Product Engineering Studio
              </span>
            </div>

            {/* 2. Main Hero Heading */}
            <h1
              id="hero-title-mobile"
              className="font-display-tech text-[28px] sm:text-4xl leading-[1.12] font-bold text-[#000000] tracking-tight max-w-md"
            >
              <div>MAKE YOUR IDEA</div>
              <div className="mt-0.5">
                INTO A{' '}
                <span className="text-[#476800] bg-[#daf396] px-2.5 py-0.5 rounded-sm inline-block font-extrabold shadow-2xs">
                  PRODUCT.
                </span>
              </div>
            </h1>

            {/* 3. Brief Supporting Description */}
            <p className="text-xs sm:text-sm text-[#444748] max-w-sm mx-auto mt-1.5 leading-relaxed font-normal px-2">
              We don&apos;t just build projects or ordinary websites. We engineer complete technology systems and products from concept to mass production.
            </p>

            {/* 4. Discipline Tags / Chips (Consistent with Desktop) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 max-w-md mx-auto px-1">
              {ENGINEERING_DISCIPLINES.map((item) => (
                <span
                  key={item}
                  className="font-mono-tech text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#c4c7c7]/70 text-[#2e312f] shadow-2xs font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#476800]" />
                  {item}
                </span>
              ))}
            </div>

            {/* 5. Touch-friendly CTA Button */}
            <div className="flex items-center justify-center mt-2.5 sm:mt-3">
              <button
                onClick={onStartProject}
                id="hero-start-project-btn-mobile"
                className="cosmic-project-btn text-sm sm:text-base py-2.5 px-6 shadow-xs"
              >
                <svg
                  height="18"
                  width="18"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                    fill="currentColor"
                  />
                </svg>
                <span>Start a Project</span>
              </button>
            </div>
          </div>

          {/* B. ROBOTIC ARM CANVAS */}
          {/* Centered with consistent camera distance, full robot visible (base and gripper) */}
          <div
            ref={robotWrapperRef}
            className="w-full max-w-[400px] mx-auto flex items-center justify-center relative transition-transform duration-100 ease-out pb-1"
            style={{
              transform: reducedMotion
                ? 'none'
                : `translateY(${robotCenterOffset}px)`,
            }}
          >
            <div className="w-full aspect-[540/304] max-h-[220px] sm:max-h-[260px] flex items-center justify-center relative px-2">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain select-none pointer-events-none"
                style={{
                  aspectRatio: '540 / 304',
                  backgroundColor: 'transparent',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE "WHY CHOOSE COSMIC CIRCUIT?" SECTION                            */}
      {/*    Begins cleanly after the Hero robot animation completes                */}
      {/* ========================================================================= */}
      <MobileWheelPicker reducedMotion={reducedMotion} />
    </div>
  );
};

export default MobileHero;
