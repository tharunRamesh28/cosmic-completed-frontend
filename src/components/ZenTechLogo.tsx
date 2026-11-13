import React from 'react';

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
  const robotZIconSrc = isDarkBg ? '/zen_tech_robot_z_white.png' : '/zen_tech_robot_z.png';
  const wordmarkSrc = useCosmicGradient
    ? '/zen_tech_wordmark_cosmic.png'
    : isDarkBg
    ? '/zen_tech_wordmark_white.png'
    : '/zen_tech_wordmark.png';
  const lineColor = isDarkBg ? 'rgba(255, 255, 255, 0.45)' : '#080808';

  const iconSizeClasses =
    size === 'sm'
      ? 'w-9 h-9 sm:w-10 sm:h-10'
      : size === 'xl'
      ? 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44'
      : size === 'lg'
      ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36'
      : 'w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13';

  const verticalBarHeight =
    size === 'sm'
      ? 'clamp(20px, 4vw, 24px)'
      : size === 'xl'
      ? 'clamp(64px, 12vw, 92px)'
      : size === 'lg'
      ? 'clamp(52px, 9vw, 72px)'
      : 'clamp(28px, 4.2vw, 36px)';

  const wordmarkSizeStyle =
    size === 'sm'
      ? { height: 'clamp(20px, 4vw, 24px)' }
      : size === 'xl'
      ? { height: 'clamp(72px, 14vw, 100px)' }
      : size === 'lg'
      ? { height: 'clamp(58px, 11vw, 84px)' }
      : { height: 'clamp(26px, 4.8vw, 34px)' };

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
