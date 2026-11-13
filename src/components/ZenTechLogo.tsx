import React from 'react';
import robotZLight from '../assets/zen_tech_robot_z.png';
import robotZDark from '../assets/zen_tech_robot_z_white.png';
import wordmarkLight from '../assets/zen_tech_wordmark.png';
import wordmarkDark from '../assets/zen_tech_wordmark_white.png';
import wordmarkCosmic from '../assets/zen_tech_wordmark_cosmic.png';

interface LogoProps {
  isDarkBg?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  useCosmicGradient?: boolean;
}

/**
 * Official ZEN TECH SOLUTIONS Logo:
 * - Robotic "Z" arm logo mark on the left (controlled by showIcon, default true)
 * - Vertical separator line (controlled by showIcon, default true)
 * - Official wordmark image (ZEN TECH — SOLUTIONS —) preserved at the exact calibrated size
 * - Adapts to light (header) and dark (footer) themes automatically
 * - Optional useCosmicGradient for luminous Cosmic Circuit white-to-green gradient in footer centerpiece
 */
export const ZenTechLogo: React.FC<LogoProps> = ({
  isDarkBg = false,
  className = '',
  size = 'md',
  showIcon = true,
  useCosmicGradient = false,
}) => {
  const robotZIconSrc = isDarkBg ? robotZDark : robotZLight;
  const wordmarkSrc = useCosmicGradient
    ? wordmarkCosmic
    : isDarkBg
    ? wordmarkDark
    : wordmarkLight;
  const lineColor = isDarkBg ? 'rgba(255, 255, 255, 0.45)' : '#080808';

  const iconSizeClasses =
    size === 'sm'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : size === 'xl'
      ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40'
      : size === 'lg'
      ? 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32'
      : 'w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12';

  const verticalBarHeight =
    size === 'sm'
      ? 'clamp(18px, 3.5vw, 22px)'
      : size === 'xl'
      ? 'clamp(64px, 12vw, 92px)'
      : size === 'lg'
      ? 'clamp(48px, 8.5vw, 70px)'
      : 'clamp(22px, 4vw, 32px)';

  const wordmarkSizeStyle =
    size === 'sm'
      ? { height: 'clamp(18px, 3.5vw, 22px)' }
      : size === 'xl'
      ? { height: 'clamp(64px, 12vw, 92px)' }
      : size === 'lg'
      ? { height: 'clamp(48px, 8.5vw, 72px)' }
      : { height: 'clamp(20px, 4vw, 30px)' };

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}
      aria-label="Zen Tech Solutions Logo"
    >
      {/* 1. Robotic 'Z' Logo Mark */}
      {showIcon && (
        <img
          src={robotZIconSrc}
          alt="Zen Tech Robotic Z Logo"
          className={`${iconSizeClasses} object-contain shrink-0`}
        />
      )}

      {/* 2. Vertical separator line */}
      {showIcon && (
        <span
          className="w-[1.5px] sm:w-[2px] rounded-full shrink-0 transition-colors duration-300"
          style={{
            height: verticalBarHeight,
            backgroundColor: lineColor,
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. Official Wordmark Name */}
      <img
        src={wordmarkSrc}
        alt="Zen Tech Solutions"
        style={wordmarkSizeStyle}
        className={`w-auto max-w-full object-contain shrink-0 transition-all duration-300 ${
          useCosmicGradient
            ? 'drop-shadow-[0_0_30px_rgba(200,241,121,0.45)] drop-shadow-[0_0_15px_rgba(116,168,30,0.3)]'
            : ''
        }`}
      />
    </div>
  );
};

export default ZenTechLogo;
