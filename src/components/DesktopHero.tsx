import React, { useEffect, useRef, useState } from 'react';
import { CursorGrid } from './CursorGrid';
import { VALUE_PROPOSITIONS, ENGINEERING_DISCIPLINES } from '../data/heroData';

interface DesktopHeroProps {
  onStartProject: () => void;
  onExploreWork?: () => void;
  isDarkTheme?: boolean;
}

const TOTAL_FRAMES = 300;
const MAX_CONCURRENT_LOADS = 4;

export const DesktopHero: React.FC<DesktopHeroProps> = ({ onStartProject }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const robotWrapperRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const whyChooseContainerRef = useRef<HTMLDivElement>(null);
  const whyChooseHeadingRef = useRef<HTMLDivElement>(null);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

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
    return `/frames/robot_arm/desktop/frame_${num}.webp`;
  };

  const renderToCanvas = (canvas: HTMLCanvasElement, frameIdx: number) => {
    let imgToDraw: HTMLImageElement | null = imagesRef.current[frameIdx];

    // Nearest loaded frame fallback to prevent blank frames or flicker
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
    const naturalW = imgToDraw.naturalWidth || 960;
    const naturalH = imgToDraw.naturalHeight || 540;

    const targetWidth = Math.round(naturalW * dpr);
    const targetHeight = Math.round(naturalH * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, naturalW, naturalH);
    ctx.drawImage(imgToDraw, 0, 0, naturalW, naturalH);
    ctx.restore();
  };

  const drawFrame = (frameIdx: number) => {
    if (canvasRef.current) {
      renderToCanvas(canvasRef.current, frameIdx);
    }
    lastDrawnFrameRef.current = frameIdx;
  };

  const triggerDraw = () => {
    if (!animFrameIdRef.current) {
      animFrameIdRef.current = requestAnimationFrame(() => {
        animFrameIdRef.current = null;
        drawFrame(currentFrameRef.current);
      });
    }
  };

  // Process image loading queue with concurrency limit
  const processQueue = () => {
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
  };

  // Dynamically prioritize nearby frames based on scroll position
  const prioritizeNearbyFrames = (centerFrame: number) => {
    const range = 16;
    const start = Math.max(0, centerFrame - 4);
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
  };

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

    // Queue key initial frames progressively
    for (let i = 1; i < 20; i++) {
      pendingQueueRef.current.push(i);
    }
    for (let i = 20; i < TOTAL_FRAMES - 1; i++) {
      pendingQueueRef.current.push(i);
    }
    processQueue();

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Desktop synchronized scroll controller
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollableDistance = trackRef.current.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollableDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      // 1. Robotic arm assembly animation: completes assembly at 0.80 progress
      const frameProgress = Math.min(1, clampedProgress / 0.80);
      const targetFrame = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(frameProgress * (TOTAL_FRAMES - 1)))
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        triggerDraw();
        prioritizeNearbyFrames(targetFrame);
      }

      // 2. Robotic arm wrapper translation:
      // At scroll = 0 (hero view), arm is offset down (+130px) so it sits comfortably BELOW the CTA button
      // Between 0.16 and 0.32, glides smoothly to stage center (0px)
      if (robotWrapperRef.current) {
        let centerRatio = 0;
        if (clampedProgress > 0.16) {
          centerRatio = Math.min(1, (clampedProgress - 0.16) / 0.16);
        }
        const armTranslateY = (1 - centerRatio) * 130;
        robotWrapperRef.current.style.transform = `translate3d(0, ${armTranslateY.toFixed(1)}px, 0)`;
      }

      // 3. Hero content fade out:
      // Fully visible from 0 to 0.16; smoothly fades out and floats upward from 0.16 to 0.28
      if (heroContentRef.current) {
        let heroOpacity = 1;
        if (clampedProgress > 0.16) {
          heroOpacity = Math.max(0, 1 - (clampedProgress - 0.16) / 0.12);
        }
        const heroTranslateY = -((1 - heroOpacity) * 32);
        heroContentRef.current.style.opacity = heroOpacity.toString();
        heroContentRef.current.style.transform = `translate3d(0, ${heroTranslateY.toFixed(1)}px, 0)`;
        heroContentRef.current.style.visibility = heroOpacity > 0 ? 'visible' : 'hidden';
        heroContentRef.current.style.pointerEvents = heroOpacity > 0.1 ? 'auto' : 'none';
      }

      // 4. Scroll Cue visibility:
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = clampedProgress < 0.08 ? '1' : '0';
      }

      // 5. Why Choose Container and Heading:
      // Reveals between 0.28 and 0.38
      if (whyChooseContainerRef.current) {
        const isVisible = clampedProgress >= 0.28;
        whyChooseContainerRef.current.style.visibility = isVisible ? 'visible' : 'hidden';
        whyChooseContainerRef.current.style.opacity = isVisible ? '1' : '0';
        whyChooseContainerRef.current.style.pointerEvents = clampedProgress >= 0.30 ? 'auto' : 'none';
      }

      if (whyChooseHeadingRef.current) {
        let hOpacity = 0;
        if (clampedProgress >= 0.28) {
          hOpacity = Math.min(1, (clampedProgress - 0.28) / 0.10);
        }
        const hTranslateY = (1 - hOpacity) * 16;
        whyChooseHeadingRef.current.style.opacity = hOpacity.toString();
        whyChooseHeadingRef.current.style.transform = `translate3d(0, ${hTranslateY.toFixed(1)}px, 0)`;
      }

      // 6. Synchronized 4-Corner Card Entrances:
      // - 01 Top-Left (Creative Solutions): 0.32 to 0.44
      // - 02 Top-Right (Customer First): 0.44 to 0.56
      // - 03 Bottom-Left (End-to-End Development): 0.56 to 0.68
      // - 04 Bottom-Right (Long-Term Partnership): 0.68 to 0.80
      // - 0.80 to 1.00: All 4 cards remain 100% settled and interactive
      const cardRanges = [
        { start: 0.32, end: 0.44 },
        { start: 0.44, end: 0.56 },
        { start: 0.56, end: 0.68 },
        { start: 0.68, end: 0.80 },
      ];

      cardRanges.forEach(({ start, end }, idx) => {
        let ratio = 0;
        if (clampedProgress >= start) {
          ratio = Math.min(1, (clampedProgress - start) / (end - start));
        }
        const easedRatio = 1 - Math.pow(1 - ratio, 2);
        const translateY = (1 - easedRatio) * 16;
        const opacityStr = easedRatio.toFixed(3);
        const transformStr = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;

        const dEl = desktopCardRefs.current[idx];
        if (dEl) {
          dEl.style.opacity = opacityStr;
          dEl.style.transform = transformStr;
          dEl.style.pointerEvents = ratio > 0.5 ? 'auto' : 'none';
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full text-[#191c1b]">
      {/* Background Subtle Tech Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="tech-grid absolute inset-0 opacity-40" />
        <CursorGrid color="0, 0, 0" maxOpacity={0.25} />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (>= 1024px): Synchronized Scroll Track & Four-Corner Stage */}
      {/* ========================================================================= */}
      <div
        ref={trackRef}
        id="hero-scroll-track-desktop"
        className="relative w-full"
        style={{
          height: reducedMotion ? 'auto' : '260vh',
        }}
      >
        {/* Sticky Full-Viewport Stage */}
        <div
          className={`${
            reducedMotion
              ? 'relative min-h-[90vh] py-12'
              : 'sticky top-0 h-screen'
          } w-full flex flex-col items-center justify-center px-6 lg:px-12 z-10 overflow-hidden relative`}
        >
          {/* ROBOTIC ARM CANVAS: Centered in stage between cards with controlled boundaries */}
          <div
            ref={robotWrapperRef}
            className={`${
              reducedMotion
                ? 'relative w-full max-w-[460px] my-6'
                : 'absolute inset-0 flex items-center justify-center pointer-events-none'
            } z-10 will-change-[transform]`}
            style={{
              transform: 'translate3d(0, 130px, 0)',
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full max-w-[420px] xl:max-w-[460px] h-auto max-h-[30vh] xl:max-h-[34vh] object-contain select-none pointer-events-none bg-transparent"
              style={{
                aspectRatio: '960 / 540',
                backgroundColor: 'transparent',
                mixBlendMode: 'multiply',
              }}
            />
          </div>

          {/* HERO CONTENT: Initial Reveal & Progressive Fade (Phase 1) */}
          <div
            ref={heroContentRef}
            className={`${
              reducedMotion
                ? 'relative mb-8'
                : 'absolute top-16 lg:top-20 left-6 right-6'
            } w-full max-w-[1240px] mx-auto text-center flex flex-col items-center justify-start z-20 shrink-0 transition-opacity duration-75 ease-out will-change-[opacity,transform]`}
            style={{
              opacity: 1,
              transform: 'translate3d(0, 0px, 0)',
              visibility: 'visible',
              pointerEvents: 'auto',
            }}
          >
            {/* Eyebrow Status Badge */}
            <div className="inline-flex items-center gap-2 border border-[#c4c7c7] px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#c8f179] animate-pulse shadow-[0_0_8px_#c8f179]" />
              <span className="font-mono-tech text-xs text-[#444748] uppercase tracking-wider font-semibold">
                End-to-End Product Engineering Studio
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="font-display-tech text-5xl lg:text-6xl xl:text-[64px] leading-[1.08] font-bold text-[#000000] tracking-tight max-w-5xl"
            >
              <div>MAKE YOUR IDEA</div>
              <div className="mt-1">
                INTO A{' '}
                <span className="text-[#476800] bg-[#daf396] px-3.5 py-0.5 rounded-sm inline-block font-extrabold shadow-2xs">
                  PRODUCT.
                </span>
              </div>
            </h1>

            {/* Core Message */}
            <p className="text-sm lg:text-base text-[#444748] max-w-2xl mt-3 leading-relaxed font-normal">
              We don&apos;t just build projects or ordinary websites. We engineer complete technology systems and products from concept to mass production.
            </p>

            {/* Engineering Disciplines Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 max-w-3xl">
              {ENGINEERING_DISCIPLINES.map((item) => (
                <span
                  key={item}
                  className="font-mono-tech text-[10px] lg:text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded bg-white border border-[#c4c7c7]/70 text-[#2e312f] shadow-2xs font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#476800]" />
                  {item}
                </span>
              ))}
            </div>

            {/* CTA Button: Start a Project */}
            <div className="flex items-center justify-center mt-5">
              <button
                onClick={onStartProject}
                id="hero-start-project-btn"
                className="cosmic-project-btn"
              >
                <svg
                  height="22"
                  width="22"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>Start a Project</span>
              </button>
            </div>
          </div>

          {/* Scroll Cue (Hero phase only) */}
          {!reducedMotion && (
            <div
              ref={scrollCueRef}
              className="absolute bottom-4 left-0 right-0 text-center flex items-center justify-center gap-2 font-mono-tech text-[10px] text-[#444748] tracking-widest uppercase transition-opacity duration-300 pointer-events-none z-20"
              style={{ opacity: 1 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#476800] animate-bounce" />
              <span>Scroll to explore product engineering</span>
            </div>
          )}

          {/* SYNCHRONIZED FOUR-CORNER "WHY CHOOSE COSMIC CIRCUIT?" STAGE */}
          <div
            ref={whyChooseContainerRef}
            id="why-choose-synchronized-stage"
            className={`${
              reducedMotion
                ? 'relative mt-12 w-full opacity-100 pointer-events-auto'
                : 'absolute inset-0 flex flex-col justify-between pt-24 lg:pt-28 pb-6 lg:pb-8 px-6 lg:px-12 z-20 pointer-events-none'
            } will-change-[opacity]`}
            style={
              reducedMotion
                ? { opacity: 1, visibility: 'visible', pointerEvents: 'auto' }
                : { opacity: 0, visibility: 'hidden', pointerEvents: 'none' }
            }
          >
            {/* Top Centered Heading */}
            <div
              ref={whyChooseHeadingRef}
              className="text-center shrink-0 mb-3 lg:mb-4 will-change-[opacity,transform]"
              style={
                reducedMotion
                  ? { opacity: 1, transform: 'translate3d(0, 0px, 0)' }
                  : { opacity: 0, transform: 'translate3d(0, 16px, 0)' }
              }
            >
              <div className="inline-flex items-center gap-2 border border-[#c4c7c7] px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-xs mb-2 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#476800]" />
                <span className="font-mono-tech text-[10px] lg:text-xs text-[#476800] uppercase tracking-widest font-semibold">
                  CORE PHILOSOPHY &amp; DFM PRINCIPLES
                </span>
              </div>
              <h2 className="font-display-tech text-3xl lg:text-4xl xl:text-[42px] font-extrabold text-[#000000] tracking-tight">
                WHY CHOOSE <span className="text-[#476800]">ZEN TECH SOLUTIONS</span>?
              </h2>
            </div>

            {/* FOUR-CORNER COMPOSITION (Arm centered unobstructed between cards) */}
            <div className="flex flex-col justify-between flex-1 min-h-0 w-full max-w-[1360px] mx-auto relative pointer-events-none my-1">
              {/* TOP ROW: Card 01 (Upper Left) & Card 02 (Upper Right) */}
              <div className="flex justify-between items-start gap-8 z-20 w-full">
                {/* CARD 01: CREATIVE SOLUTIONS */}
                <div
                  ref={(el) => (desktopCardRefs.current[0] = el)}
                  className="w-[305px] lg:w-[335px] xl:w-[365px] relative bg-white border border-[#c4c7c7]/80 hover:border-[#476800] rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-xs hover:shadow-md transition-all duration-300 group will-change-[opacity,transform] pointer-events-none"
                  style={
                    reducedMotion
                      ? { opacity: 1, transform: 'translate3d(0, 0px, 0)' }
                      : { opacity: 0, transform: 'translate3d(0, 16px, 0)' }
                  }
                >
                  <div className="hidden xl:block absolute -right-5 bottom-4 w-5 h-[1.5px] bg-[#476800]/40 pointer-events-none" />
                  <div className="w-6 h-[2px] bg-[#476800]/50 group-hover:bg-[#476800] group-hover:w-10 transition-all duration-300 mb-2 rounded-full" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono-tech text-xs sm:text-sm font-bold text-[#476800] bg-[#c8f179]/25 px-2 py-0.5 rounded border border-[#c8f179]/50 shrink-0">
                      {VALUE_PROPOSITIONS[0].num}
                    </span>
                    <h3 className="font-display-tech text-sm lg:text-base font-bold text-[#000000] tracking-tight uppercase group-hover:text-[#476800] transition-colors">
                      {VALUE_PROPOSITIONS[0].title}
                    </h3>
                  </div>
                  <p className="text-xs lg:text-[13px] xl:text-sm text-[#444748] leading-relaxed font-normal">
                    {VALUE_PROPOSITIONS[0].description}
                  </p>
                </div>

                {/* CARD 02: CUSTOMER FIRST */}
                <div
                  ref={(el) => (desktopCardRefs.current[1] = el)}
                  className="w-[305px] lg:w-[335px] xl:w-[365px] relative bg-white border border-[#c4c7c7]/80 hover:border-[#476800] rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-xs hover:shadow-md transition-all duration-300 group will-change-[opacity,transform] pointer-events-none"
                  style={
                    reducedMotion
                      ? { opacity: 1, transform: 'translate3d(0, 0px, 0)' }
                      : { opacity: 0, transform: 'translate3d(0, 16px, 0)' }
                  }
                >
                  <div className="hidden xl:block absolute -left-5 bottom-4 w-5 h-[1.5px] bg-[#476800]/40 pointer-events-none" />
                  <div className="w-6 h-[2px] bg-[#476800]/50 group-hover:bg-[#476800] group-hover:w-10 transition-all duration-300 mb-2 rounded-full" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono-tech text-xs sm:text-sm font-bold text-[#476800] bg-[#c8f179]/25 px-2 py-0.5 rounded border border-[#c8f179]/50 shrink-0">
                      {VALUE_PROPOSITIONS[1].num}
                    </span>
                    <h3 className="font-display-tech text-sm lg:text-base font-bold text-[#000000] tracking-tight uppercase group-hover:text-[#476800] transition-colors">
                      {VALUE_PROPOSITIONS[1].title}
                    </h3>
                  </div>
                  <p className="text-xs lg:text-[13px] xl:text-sm text-[#444748] leading-relaxed font-normal">
                    {VALUE_PROPOSITIONS[1].description}
                  </p>
                </div>
              </div>

              {/* BOTTOM ROW: Card 03 (Lower Left) & Card 04 (Lower Right) */}
              <div className="flex justify-between items-end gap-8 z-20 w-full">
                {/* CARD 03: END-TO-END DEVELOPMENT */}
                <div
                  ref={(el) => (desktopCardRefs.current[2] = el)}
                  className="w-[305px] lg:w-[335px] xl:w-[365px] relative bg-white border border-[#c4c7c7]/80 hover:border-[#476800] rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-xs hover:shadow-md transition-all duration-300 group will-change-[opacity,transform] pointer-events-none"
                  style={
                    reducedMotion
                      ? { opacity: 1, transform: 'translate3d(0, 0px, 0)' }
                      : { opacity: 0, transform: 'translate3d(0, 16px, 0)' }
                  }
                >
                  <div className="hidden xl:block absolute -right-5 top-4 w-5 h-[1.5px] bg-[#476800]/40 pointer-events-none" />
                  <div className="w-6 h-[2px] bg-[#476800]/50 group-hover:bg-[#476800] group-hover:w-10 transition-all duration-300 mb-2 rounded-full" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono-tech text-xs sm:text-sm font-bold text-[#476800] bg-[#c8f179]/25 px-2 py-0.5 rounded border border-[#c8f179]/50 shrink-0">
                      {VALUE_PROPOSITIONS[2].num}
                    </span>
                    <h3 className="font-display-tech text-sm lg:text-base font-bold text-[#000000] tracking-tight uppercase group-hover:text-[#476800] transition-colors">
                      {VALUE_PROPOSITIONS[2].title}
                    </h3>
                  </div>
                  <p className="text-xs lg:text-[13px] xl:text-sm text-[#444748] leading-relaxed font-normal">
                    {VALUE_PROPOSITIONS[2].description}
                  </p>
                </div>

                {/* CARD 04: LONG-TERM PARTNERSHIP */}
                <div
                  ref={(el) => (desktopCardRefs.current[3] = el)}
                  className="w-[305px] lg:w-[335px] xl:w-[365px] relative bg-white border border-[#c4c7c7]/80 hover:border-[#476800] rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-xs hover:shadow-md transition-all duration-300 group will-change-[opacity,transform] pointer-events-none"
                  style={
                    reducedMotion
                      ? { opacity: 1, transform: 'translate3d(0, 0px, 0)' }
                      : { opacity: 0, transform: 'translate3d(0, 16px, 0)' }
                  }
                >
                  <div className="hidden xl:block absolute -left-5 top-4 w-5 h-[1.5px] bg-[#476800]/40 pointer-events-none" />
                  <div className="w-6 h-[2px] bg-[#476800]/50 group-hover:bg-[#476800] group-hover:w-10 transition-all duration-300 mb-2 rounded-full" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono-tech text-xs sm:text-sm font-bold text-[#476800] bg-[#c8f179]/25 px-2 py-0.5 rounded border border-[#c8f179]/50 shrink-0">
                      {VALUE_PROPOSITIONS[3].num}
                    </span>
                    <h3 className="font-display-tech text-sm lg:text-base font-bold text-[#000000] tracking-tight uppercase group-hover:text-[#476800] transition-colors">
                      {VALUE_PROPOSITIONS[3].title}
                    </h3>
                  </div>
                  <p className="text-xs lg:text-[13px] xl:text-sm text-[#444748] leading-relaxed font-normal">
                    {VALUE_PROPOSITIONS[3].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
