import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * ScrollReveal component
 * Automatically detects when elements enter viewport and smoothly fades them in
 * (opacity: 0 -> 1, translateY: 28px -> 0)
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;

    // Check if already in viewport or reduced motion
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let translateStyle = '';
  let activeTranslateStyle = 'translate-x-0 translate-y-0';

  if (direction === 'up') {
    translateStyle = 'translate-y-7';
  } else if (direction === 'down') {
    translateStyle = '-translate-y-7';
  } else if (direction === 'right') {
    // Starts shifted to the right, animates to original position
    translateStyle = 'translate-x-12 sm:translate-x-16';
  } else if (direction === 'left') {
    translateStyle = '-translate-x-12 sm:-translate-x-16';
  }

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? `opacity-100 ${activeTranslateStyle}` : `opacity-0 ${translateStyle}`
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
