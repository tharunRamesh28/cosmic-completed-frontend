import React from 'react';

interface LogoProps {
  isDarkBg?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

/**
 * Recreates the ZEN TECH SOLUTIONS logo with:
 * 1. Clean robotic "Z" icon (from official high-res logo upload)
 * 2. Pure HTML/CSS Exo 2 ExtraBold Italic typography:
 *    - ZEN: Black (#080808) (or white on dark backgrounds)
 *    - TECH: Bright green (#6BC503)
 *    - SOLUTIONS: Black (#111111) centered directly beneath ZEN TECH with horizontal lines
 *    - Left thin vertical divider line
 */
export const ZenTechLogo: React.FC<LogoProps> = ({
  isDarkBg = false,
  className = '',
  size = 'md',
  showIcon = true,
}) => {
  // Scaled an additional ~30% larger, making the robot icon dominant and impactful
  const iconSizeClasses =
    size === 'sm'
      ? 'w-14 h-14 sm:w-16 sm:h-16'
      : size === 'lg'
      ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36'
      : 'w-[72px] h-[72px] sm:w-20 sm:h-20 md:w-24 md:h-24';

  const zenColor = isDarkBg ? '#FFFFFF' : '#080808';
  const techColor = '#6BC503';
  const solutionsColor = isDarkBg ? '#E2E8F0' : '#111111';
  const lineColor = isDarkBg ? 'rgba(255, 255, 255, 0.45)' : '#080808';

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 select-none ${className}`}
      aria-label="Zen Tech Solutions Logo"
    >
      {/* 1. Large Robotic 'Z' Logo Mark (Scaled +30% larger, crystal clear) */}
      {showIcon && (
        <img
          src="/zen_tech_robot_z.png"
          alt="Zen Tech Robotic Z Logo"
          className={`${iconSizeClasses} object-contain shrink-0 drop-shadow-xs`}
        />
      )}

      {/* 2. Vertical separator line: Exactly 42–48px tall on desktop, vertically centered to ZEN TECH SOLUTIONS */}
      <span
        className="w-[2px] sm:w-[2.5px] rounded-full shrink-0 transition-colors duration-300"
        style={{
          height:
            size === 'sm'
              ? 'clamp(28px, 6vw, 36px)'
              : size === 'lg'
              ? 'clamp(48px, 8vw, 64px)'
              : 'clamp(32px, 5.5vw, 45px)', // ~42-45px on desktop, scaling smoothly on mobile
          backgroundColor: lineColor,
        }}
        aria-hidden="true"
      />

      {/* 3. Text Hierarchy Container */}
      <div className="flex flex-col justify-center leading-none tracking-tight">
        {/* Row 1: ZEN TECH (Aligned directly centered and straight over SOLUTIONS) */}
        <div
          className="font-logo-exo italic font-black uppercase flex items-baseline justify-center w-full"
          style={{
            fontSize:
              size === 'sm'
                ? 'clamp(0.95rem, 2.2vw, 1.15rem)'
                : size === 'lg'
                ? 'clamp(1.4rem, 3.6vw, 2.1rem)'
                : 'clamp(1.1rem, 2.5vw, 1.45rem)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
          }}
        >
          <div className="flex items-baseline">
            {/* ZEN */}
            <span
              style={{
                color: zenColor,
                fontWeight: 900,
                fontStyle: 'italic',
              }}
              className="transition-colors duration-300 mr-[0.22em]"
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
        </div>

        {/* Row 2: — SOLUTIONS — (Straight underneath with horizontal bars) */}
        <div className="flex items-center justify-between w-full mt-[3px] sm:mt-[4px] gap-1.5 sm:gap-2">
          {/* Left horizontal line */}
          <span
            className="flex-1 h-[1px] sm:h-[1.2px] transition-colors duration-300 min-w-[8px]"
            style={{ backgroundColor: lineColor }}
            aria-hidden="true"
          />

          {/* Centered SOLUTIONS Text */}
          <span
            className="font-logo-exo font-bold uppercase transition-colors duration-300 text-center"
            style={{
              color: solutionsColor,
              fontSize:
                size === 'sm'
                  ? 'clamp(0.44rem, 1vw, 0.52rem)'
                  : size === 'lg'
                  ? 'clamp(0.65rem, 1.4vw, 0.8rem)'
                  : 'clamp(0.48rem, 1.1vw, 0.6rem)',
              letterSpacing: '0.34em',
              marginRight: '-0.34em', // Offsets trailing space so it centers exactly
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

