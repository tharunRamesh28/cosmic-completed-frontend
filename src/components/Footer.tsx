import React from 'react';
import { CursorGrid } from './CursorGrid';
import { Share2, Terminal, Shield, ArrowUpRight } from 'lucide-react';
import { Link, useRouter } from '../router';

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
        SUBTLE GREEN AMBIENT SHADE:
        Soft luminous Cosmic Circuit green atmospheric glow rising gently from the bottom of the black footer area,
        without overpowering or washing out the deep dark background.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Soft bottom-up gentle green atmospheric glow */}
        <div
          className="absolute inset-x-0 bottom-0 h-[220px] opacity-25 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(71, 104, 0, 0.4) 0%, rgba(116, 168, 30, 0.2) 40%, transparent 100%)',
          }}
        />

        {/* Soft centered bloom behind the logo */}
        <div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[85%] max-w-[1000px] h-[220px] opacity-35 blur-[90px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at bottom center, #c8f179 0%, #74a81e 35%, transparent 75%)',
          }}
        />

        {/* Technical baseline grid pattern over the glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="tech-grid-dark absolute inset-0 opacity-15" />
        <CursorGrid color="185, 232, 106" maxOpacity={0.25} />
      </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-10 sm:py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div>
              <Link
                to="/"
                className="font-display-tech text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 hover:opacity-90"
              >
                <img 
                  src="/zen_tech_icon.jpg" 
                  alt="Zen Tech Solutions Logo" 
                  className="w-9 h-9 object-contain rounded-md bg-white p-0.5"
                />
                <span className="font-extrabold tracking-tight">ZEN TECH <span className="text-[#c8f179]">SOLUTIONS</span></span>
              </Link>
              <p className="font-mono-tech text-xs text-neutral-400 mt-2">
                High-End Technical Minimalism
              </p>
            </div>

            {/* Social / Terminal Icons */}
            <div className="flex gap-4 items-center">
              <Link
                to="/works"
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-neutral-400 hover:text-[#c8f179] hover:border-[#c8f179] transition-colors"
                title="Works"
              >
                <Share2 className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-neutral-400 hover:text-[#c8f179] hover:border-[#c8f179] transition-colors"
                title="Services"
              >
                <Terminal className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-neutral-400 hover:text-[#c8f179] hover:border-[#c8f179] transition-colors"
                title="About"
              >
                <Shield className="w-4 h-4" />
              </Link>
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

        {/* Large Brand Typography with Green Gradient in Black Area */}
        <div className="pt-8 pb-4 sm:pt-10 sm:pb-6 border-t border-neutral-800/80 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4 mb-2">
            <img 
              src="/zen_tech_full_logo.jpg" 
              alt="Zen Tech Solutions" 
              className="max-h-20 sm:max-h-28 md:max-h-36 object-contain rounded-xl shadow-2xl bg-white p-2 sm:p-3"
            />
          </div>
          <span className="font-mono-tech text-[10px] sm:text-xs text-[#c8f179]/90 tracking-[0.25em] uppercase font-bold mt-2">
            END-TO-END PRODUCT ENGINEERING STUDIO
          </span>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-6 sm:pt-8 border-t border-neutral-900/90 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono-tech text-xs text-neutral-400">
          <p>© 2026 Zen Tech Solutions. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8f179] shadow-[0_0_8px_#c8f179]"></span>
            <span className="text-neutral-300">SYSTEM NODE: ACTIVE (0.01mm TOLERANCE)</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
