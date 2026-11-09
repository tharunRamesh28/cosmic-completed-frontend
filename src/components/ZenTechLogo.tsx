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
  // Increased the robotic Z logo mark by 30% while keeping header compact
  const iconSizeClasses =
    size === 'sm'
      ? 'w-10 h-10 sm:w-11 sm:h-11'
      : size === 'lg'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-13 h-13 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px]';

  const verticalBarHeight =
    size === 'sm'
      ? 'clamp(22px, 4vw, 26px)'
      : size === 'lg'
      ? 'clamp(38px, 6vw, 46px)'
      : 'clamp(28px, 4.2vw, 36px)';

  const zenColor = isDarkBg ? '#FFFFFF' : '#080808';
  const techColor = '#6BC503';
  const solutionsColor = isDarkBg ? '#E2E8F0' : '#111111';
  const lineColor = isDarkBg ? 'rgba(255, 255, 255, 0.45)' : '#080808';

  // Use crisp white robot Z icon on dark backgrounds, black robot Z icon on light backgrounds
  const robotZIconSrc = isDarkBg ? '/zen_tech_robot_z_white.png' : '/zen_tech_robot_z.png';

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}
      aria-label="Zen Tech Solutions Logo"
    >
      {/* 1. Sleek Robotic 'Z' Logo Mark */}
      {showIcon && (
        <img
          src={robotZIconSrc}
          alt="Zen Tech Robotic Z Logo"
          className={`${iconSizeClasses} object-contain shrink-0`}
        />
      )}

      {/* 2. Vertical separator line */}
      <span
        className="w-[1.5px] sm:w-[2px] rounded-full shrink-0 transition-colors duration-300"
        style={{
          height: verticalBarHeight,
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
                ? 'clamp(0.8rem, 1.8vw, 0.95rem)'
                : size === 'lg'
                ? 'clamp(1.2rem, 3vw, 1.7rem)'
                : 'clamp(0.95rem, 2.1vw, 1.2rem)',
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
        </div>

        {/* Row 2: — SOLUTIONS — (Straight underneath with horizontal bars) */}
        <div className="flex items-center justify-between w-full mt-[2.5px] sm:mt-[3px] gap-1 sm:gap-1.5">
          {/* Left horizontal line */}
          <span
            className="flex-1 h-[1px] transition-colors duration-300 min-w-[6px]"
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
                  ? 'clamp(0.38rem, 0.9vw, 0.45rem)'
                  : size === 'lg'
                  ? 'clamp(0.55rem, 1.2vw, 0.68rem)'
                  : 'clamp(0.42rem, 0.95vw, 0.52rem)',
              letterSpacing: '0.34em',
              marginRight: '-0.34em', // Offsets trailing space so it centers exactly
              lineHeight: 1,
            }}
          >
            SOLUTIONS
          </span>

          {/* Right horizontal line */}
          <span
            className="flex-1 h-[1px] transition-colors duration-300 min-w-[6px]"
            style={{ backgroundColor: lineColor }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

