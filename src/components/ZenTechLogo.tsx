import React from 'react';

interface LogoProps {
  isDarkBg?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Recreates the ZEN TECH SOLUTIONS logo completely with semantic HTML & CSS.
 * - Font: 'Exo 2' ExtraBold (800/900) Italic
 * - ZEN: Black (#080808) (or white on dark backgrounds)
 * - TECH: Bright green (#6BC503)
 * - SOLUTIONS: Black (#111111) with wide letter-spacing and flanked horizontal divider rules
 * - Vertical bar on the left
 * - 100% vector-sharp, selectable, accessible text
 */
export const ZenTechLogo: React.FC<LogoProps> = ({
  isDarkBg = false,
  className = '',
  size = 'md',
}) => {
  // Adaptive sizing classes based on scale props or fluid clamp
  const verticalBarClasses =
    size === 'sm'
      ? 'h-7 w-[2px]'
      : size === 'lg'
      ? 'h-10 sm:h-12 w-[2.5px] sm:w-[3px]'
      : 'h-8 sm:h-9 md:h-10 w-[2px] sm:w-[2.5px]';

  const zenColor = isDarkBg ? '#FFFFFF' : '#080808';
  const techColor = '#6BC503';
  const solutionsColor = isDarkBg ? '#E2E8F0' : '#111111';
  const lineColor = isDarkBg ? 'rgba(255, 255, 255, 0.4)' : '#111111';

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}
      aria-label="Zen Tech Solutions Logo"
    >
      {/* Left Thin Vertical Line */}
      <span
        className={`shrink-0 rounded-full transition-colors duration-300 ${verticalBarClasses}`}
        style={{ backgroundColor: lineColor }}
        aria-hidden="true"
      />

      {/* Text Hierarchy Container */}
      <div className="flex flex-col justify-center leading-none tracking-tight">
        {/* Row 1: ZEN TECH */}
        <div
          className="font-logo-exo italic font-black uppercase flex items-baseline tracking-normal"
          style={{
            fontSize:
              size === 'sm'
                ? 'clamp(1rem, 2.5vw, 1.25rem)'
                : size === 'lg'
                ? 'clamp(1.5rem, 3.8vw, 2.25rem)'
                : 'clamp(1.2rem, 2.8vw, 1.65rem)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
          }}
        >
          {/* ZEN */}
          <span
            style={{
              color: zenColor,
              fontWeight: 900,
              fontStyle: 'italic',
            }}
            className="transition-colors duration-300 mr-[0.2em]"
          >
            ZEN
          </span>

          {/* TECH */}
          <span
            style={{
              color: techColor,
              fontWeight: 900,
              fontStyle: 'italic',
            }}
          >
            TECH
          </span>
        </div>

        {/* Row 2: — SOLUTIONS — */}
        <div className="flex items-center justify-between w-full mt-[3px] sm:mt-[4px] gap-1 sm:gap-1.5">
          {/* Left horizontal line */}
          <span
            className="flex-1 h-[1px] sm:h-[1.2px] transition-colors duration-300 min-w-[8px]"
            style={{ backgroundColor: lineColor }}
            aria-hidden="true"
          />

          {/* Centered SOLUTIONS Text with generous letter spacing */}
          <span
            className="font-logo-exo font-bold uppercase transition-colors duration-300 text-center"
            style={{
              color: solutionsColor,
              fontSize:
                size === 'sm'
                  ? 'clamp(0.48rem, 1.1vw, 0.58rem)'
                  : size === 'lg'
                  ? 'clamp(0.68rem, 1.5vw, 0.85rem)'
                  : 'clamp(0.52rem, 1.2vw, 0.68rem)',
              letterSpacing: 'clamp(5px, 1.4vw, 9px)',
              paddingLeft: 'clamp(5px, 1.4vw, 9px)', // Offset the final letter's spacing to keep it perfectly centered
              lineHeight: 1,
            }}
          >
            SOLUTIONS
          </span>

          {/* Right horizontal line */}
          <span
            className="flex-1 h-[1px] sm:h-[1.2px] transition-colors duration-300 min-w-[8px]"
            style={{ backgroundColor: lineColor }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
