import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ProofOfScaleSectionProps {
  onStartProject?: () => void;
}

function useCountUp(target: number, duration: number = 1300, isVisible: boolean = false) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing out cubic curve for smooth slowing down at the end
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, target, duration]);

  return count;
}

export const ProofOfScaleSection: React.FC<ProofOfScaleSectionProps> = ({ onStartProject }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const clientsCount = useCountUp(150, 1300, isVisible);
  const productsCount = useCountUp(200, 1300, isVisible);

  return (
    <div ref={sectionRef} className="w-full">
      {/* 1. PROOF OF SCALE SECTION */}
      <section className="py-8 sm:py-14 md:py-28 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto border-t border-[#c4c7c7]/40 relative overflow-hidden select-none">
        {/* Subtle engineering grid background */}
        <div className="tech-grid absolute inset-0 opacity-40 pointer-events-none z-0" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Section Eyebrow Tag */}
          <div className="mb-6 sm:mb-10 md:mb-14">
            <span className="font-mono-tech text-xs md:text-sm text-[#444748] tracking-[0.2em] uppercase flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-[#000000] inline-block" />
              ENGINEERING AT SCALE
              <span className="w-8 h-px bg-[#000000] inline-block" />
            </span>
          </div>

          {/* Scale Statistics Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-0 items-center relative py-3 sm:py-6 md:py-10">
            {/* Desktop Vertical Technical Divider Line */}
            <div
              className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#c4c7c7] to-transparent -translate-x-1/2 pointer-events-none"
              aria-hidden="true"
            >
              {/* Technical crosshair dots */}
              <div className="absolute top-0 -left-[3px] w-2 h-2 rounded-full bg-[#476800]" />
              <div className="absolute bottom-0 -left-[3px] w-2 h-2 rounded-full bg-[#476800]" />
            </div>

            {/* Stat 1: 150+ CLIENTS */}
            <div className="flex flex-col items-center justify-center px-4 md:px-12 group">
              <div className="font-display-tech text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#000000] tracking-tighter leading-none mb-2 sm:mb-4 flex items-baseline">
                <span>{clientsCount}</span>
                <span className="text-[#476800] ml-1 font-bold">+</span>
              </div>
              <div className="font-mono-tech text-sm sm:text-lg md:text-xl font-bold tracking-[0.25em] text-[#191c1b] uppercase">
                CLIENTS
              </div>
            </div>

            {/* Stat 2: 200+ PRODUCTS */}
            <div className="flex flex-col items-center justify-center px-4 md:px-12 group">
              <div className="font-display-tech text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#000000] tracking-tighter leading-none mb-2 sm:mb-4 flex items-baseline">
                <span>{productsCount}</span>
                <span className="text-[#476800] ml-1 font-bold">+</span>
              </div>
              <div className="font-mono-tech text-sm sm:text-lg md:text-xl font-bold tracking-[0.25em] text-[#191c1b] uppercase">
                PRODUCTS
              </div>
            </div>
          </div>

          {/* Short Supporting Statement */}
          <div className="mt-6 sm:mt-10 md:mt-16 pt-5 sm:pt-8 border-t border-[#c4c7c7]/30 max-w-xl mx-auto">
            <p className="font-display-tech text-sm sm:text-lg md:text-xl font-medium text-[#444748] tracking-tight">
              Trusted by clients. Built into real products.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FINAL CTA SECTION IMMEDIATELY AFTER STATISTICS */}
      <section className="px-4 sm:px-6 md:px-16 pt-2 pb-12 sm:pb-16 md:pb-20 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <div className="bg-[#ffffff] border border-[#c4c7c7]/70 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 group hover:border-[#b9e86a] transition-all duration-300">
            {/* Subtle background tech grid */}
            <div className="tech-grid absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />

            <div className="space-y-2 sm:space-y-3 max-w-2xl relative z-10">
              <span className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest block">
                ENGINEERING EXECUTION
              </span>
              <h2 className="font-display-tech text-2xl sm:text-4xl md:text-5xl font-black text-[#000000] tracking-tight uppercase leading-tight">
                HAVE AN ENGINEERING <span className="text-[#476800]">PROBLEM?</span>
              </h2>
              <p className="font-display-tech text-sm sm:text-lg text-[#444748] font-medium leading-relaxed">
                LET'S TURN IT INTO A WORKING SYSTEM.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                type="button"
                onClick={onStartProject}
                className="inline-flex items-center gap-3 bg-[#000000] text-[#c8f179] font-mono-tech font-bold text-xs sm:text-sm px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl hover:bg-[#191c1b] transition-all duration-300 group/btn cursor-pointer shadow-md"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 text-[#c8f179]" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
