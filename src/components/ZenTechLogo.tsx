import React from 'react';

interface LogoProps {
  isDarkBg?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

/**
 * Official ZEN TECH SOLUTIONS Logo:
 * Renders the clean high-resolution wordmark image (ZEN TECH — SOLUTIONS —).
 * - Light mode / Header: /zen_tech_wordmark.png (Black & Green)
 * - Dark mode / Footer: /zen_tech_wordmark_white.png (White & Green)
 * - Sized exactly to match the old name proportions for a sleek, compact, elegant presentation.
 */
export const ZenTechLogo: React.FC<LogoProps> = ({
  isDarkBg = false,
  className = '',
  size = 'md',
}) => {
  const logoSrc = isDarkBg ? '/zen_tech_wordmark_white.png' : '/zen_tech_wordmark.png';

  const sizeStyle =
    size === 'sm'
      ? { height: 'clamp(20px, 4vw, 24px)' }
      : size === 'xl'
      ? { height: 'clamp(68px, 12vw, 88px)' }
      : size === 'lg'
      ? { height: 'clamp(48px, 9vw, 64px)' }
      : { height: 'clamp(26px, 4.8vw, 34px)' }; // default 'md' matches old name size (~28-34px)

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      aria-label="Zen Tech Solutions Logo"
    >
      <img
        src={logoSrc}
        alt="Zen Tech Solutions"
        style={sizeStyle}
        className="w-auto max-w-full object-contain shrink-0 transition-opacity duration-300"
      />
    </div>
  );
};

export default ZenTechLogo;
