import React from 'react';
import { CursorGrid } from './CursorGrid';
import { ArrowUpRight, Instagram, Mail, Linkedin } from 'lucide-react';
import { Link, useRouter } from '../router';
import { ZenTechLogo } from './ZenTechLogo';

// Social navigation links (ready for URLs to be added)
const SOCIAL_LINKS = {
  instagram: '#',
  email: '#',
  linkedin: '#',
};

interface FooterProps {
  onStartProject?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartProject }) => {
  const { navigate } = useRouter();

  const handleAction = () => {
    if (onStartProject) {
      onStartProject();
    } else {
      navigate('/about');
    }
  };

  return (
    <footer
      className="bg-[#000000] text-white w-full border-t border-neutral-900 mt-10 sm:mt-16 md:mt-20 relative overflow-hidden select-none"
      id="footer"
    >
      {/*
        LUMINOUS COSMIC CIRCUIT GREEN AMBIENT SHADE (Referenced from original Cosmic Circuit aesthetic):
        Atmospheric green illumination and centered bloom rising behind the brand centerpiece,
        complemented by the subtle high-tech baseline grid.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Soft bottom-up gentle green atmospheric glow */}
        <div
          className="absolute inset-x-0 bottom-0 h-[480px] opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 110% 80% at 50% 100%, rgba(71, 104, 0, 0.45) 0%, rgba(25, 36, 6, 0.3) 40%, transparent 80%)',
          }}
        />

        {/* Soft centered radiant bloom behind the logo centerpiece */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-[1100px] h-[340px] opacity-45 blur-[85px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, #c8f179 0%, #74a81e 35%, transparent 75%)',
          }}
        />

        {/* Technical baseline grid pattern over the glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="tech-grid-dark absolute inset-0 opacity-25" />
          <CursorGrid color="185, 232, 106" maxOpacity={0.3} />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-10 sm:py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div>
              <Link
                to="/"
                className="inline-flex items-center hover:opacity-90 transition-opacity"
                title="Zen Tech Solutions"
              >
                <ZenTechLogo isDarkBg={true} size="sm" />
              </Link>
              <p className="font-mono-tech text-xs text-neutral-400 mt-2">
                High-End Technical Minimalism
              </p>
            </div>

            {/* Social / Contact Navigation Icons */}
            <div className="flex gap-4 items-center">
              <a
                href={SOCIAL_LINKS.instagram}
                target={SOCIAL_LINKS.instagram !== '#' ? '_blank' : undefined}
                rel={SOCIAL_LINKS.instagram !== '#' ? 'noopener noreferrer' : undefined}
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-neutral-400 hover:text-[#c8f179] hover:border-[#c8f179] transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.email}
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-neutral-400 hover:text-[#c8f179] hover:border-[#c8f179] transition-colors"
                title="Email"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target={SOCIAL_LINKS.linkedin !== '#' ? '_blank' : undefined}
                rel={SOCIAL_LINKS.linkedin !== '#' ? 'noopener noreferrer' : undefined}
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-neutral-400 hover:text-[#c8f179] hover:border-[#c8f179] transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Navigation (Only 4 options) */}
          <div className="flex flex-col gap-3 font-mono-tech text-xs">
            <span className="text-neutral-500 uppercase tracking-wider text-[11px] mb-1 font-bold">
              # NAVIGATION
            </span>
            <Link to="/" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              Home
            </Link>
            <Link to="/works" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              Works
            </Link>
            <Link to="/services" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              Services
            </Link>
            <Link to="/about" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              About
            </Link>
          </div>

          {/* Column 2: Engineering Disciplines */}
          <div className="flex flex-col gap-3 font-mono-tech text-xs">
            <span className="text-neutral-500 uppercase tracking-wider text-[11px] mb-1 font-bold">
              # DISCIPLINES
            </span>
            <Link to="/services" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              Hardware
            </Link>
            <Link to="/services" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              IoT
            </Link>
            <Link to="/services" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              Web
            </Link>
            <Link to="/services" className="text-neutral-300 hover:text-[#c8f179] transition-colors duration-200">
              CAD
            </Link>
          </div>

          {/* Column 3: Studio & Engagement */}
          <div className="flex flex-col gap-4 font-mono-tech text-xs">
            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[11px] mb-2 block font-bold">
                # ENGAGEMENT
              </span>
              <button
                onClick={handleAction}
                className="w-full bg-[#c8f179] text-[#0a0a0a] font-mono-tech text-xs font-bold px-4 py-3 rounded hover:bg-[#b9e86a] transition-all flex items-center justify-between shadow-[0_0_20px_rgba(200,241,121,0.3)] cursor-pointer"
              >
                <span>COMMISSION WORK</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 pt-2 text-neutral-400">
              <Link to="/about" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/about" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/about" className="hover:text-white transition-colors">Security</Link>
            </div>
          </div>
        </div>

        {/* Large Brand Centerpiece Banner */}
        <div className="pt-12 pb-6 sm:pt-16 sm:pb-8 border-t border-[#74a81e]/30 flex flex-col items-center justify-center text-center relative z-10">
          <div className="flex flex-col items-center gap-6 mb-4">
            <ZenTechLogo isDarkBg={true} size="lg" showIcon={false} useCosmicGradient={true} />
          </div>
          <span className="font-mono-tech text-xs sm:text-sm text-[#c8f179] tracking-[0.28em] uppercase font-bold mt-4 drop-shadow-[0_0_12px_rgba(200,241,121,0.55)]">
            END-TO-END PRODUCT ENGINEERING STUDIO
          </span>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#74a81e]/25 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono-tech text-xs text-neutral-400 relative z-10">
          <p>© 2026 Zen Tech Solutions. All rights reserved.</p>
          <p className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8f179] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8f179] shadow-[0_0_10px_#c8f179,0_0_20px_#74a81e]"></span>
            </span>
            <span className="text-neutral-300 font-semibold tracking-wide">SYSTEM NODE: ACTIVE (0.01mm TOLERANCE)</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
