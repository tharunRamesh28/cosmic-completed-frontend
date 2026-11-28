import React from 'react';
import { ArrowRight, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { useRouter } from '../router';

import karthikPhoto from '../../projects/members/karthik.png';
import tharunPhoto from '../../projects/members/tharun.png';
import cooPhoto from '../../projects/members/coo.png';
import vinnarasuPhoto from '../../projects/members/vinnarasu.png';

export const TeamPreviewSection: React.FC = () => {
  const { navigate } = useRouter();

  const leaders = [
    {
      name: 'Karthik Arjun',
      role: 'FOUNDER',
      focus: 'CAD & Embedded Systems',
      image: karthikPhoto,
    },
    {
      name: 'Tharun',
      role: 'CO-FOUNDER',
      focus: 'IoT & Full-Stack Engineering',
      image: tharunPhoto,
    },
    {
      name: 'Navadeep',
      role: 'CORE TEAM',
      focus: 'Product Strategy & Finance',
      image: cooPhoto,
    },
    {
      name: 'Vinnarasu',
      role: 'CORE TEAM',
      focus: 'Core Engineering & R&D',
      image: vinnarasuPhoto,
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto select-none">
      <div className="bg-[#ffffff] border border-[#c4c7c7]/80 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-sm hover:border-[#b9e86a] transition-all duration-300">
        {/* Subtle engineering grid background */}
        <div className="tech-grid absolute inset-0 opacity-25 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Heading & Value Proposition */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 border border-[#c4c7c7] px-3 py-1 rounded-full bg-[#f9faf7] mb-4 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse" />
              <span className="font-mono-tech text-[10px] sm:text-xs text-[#476800] uppercase font-bold tracking-wider">
                # LEADERSHIP &amp; ENGINEERING
              </span>
            </div>

            <h2 className="font-display-tech text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#000000] tracking-tight mb-3">
              THE ENGINEERS BEHIND <span className="text-[#476800]">ZEN TECH.</span>
            </h2>

            <p className="font-display-tech text-sm sm:text-base text-[#444748] leading-relaxed mb-6">
              We don&apos;t outsource your technology. Our founding team of specialized embedded developers, CAD designers, and robotics engineers builds and verifies every prototype in-house.
            </p>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-[#c4c7c7]/40 mb-6 sm:mb-8 font-mono-tech text-xs text-[#191c1b]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#476800]" />
                <span className="font-semibold">In-House Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#476800]" />
                <span className="font-semibold">Hardware + Firmware Native</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/about')}
              id="home-meet-team-cta-btn"
              className="inline-flex items-center gap-3 bg-[#000000] text-[#c8f179] hover:bg-[#191c1b] font-mono-tech font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-[0_0_24px_rgba(200,241,121,0.35)] cursor-pointer group"
              title="View full credentials and profiles of the Zen Tech team"
            >
              <Users className="w-4 h-4 text-[#c8f179]" />
              <span>MEET OUR TEAM</span>
              <ArrowRight className="w-4 h-4 text-[#c8f179] group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Right Column: 4-Member Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 w-full lg:max-w-2xl shrink-0">
            {leaders.map((member) => (
              <div
                key={member.name}
                onClick={() => navigate('/about')}
                className="group/card bg-[#f9faf7] border border-[#c4c7c7]/70 rounded-xl overflow-hidden hover:border-black hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-white overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter md:grayscale md:group-hover/card:grayscale-0 transition-[filter] duration-500 ease-in-out group-hover/card:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[#c8f179] font-mono-tech text-[9px] font-bold uppercase tracking-wider">
                    {member.role}
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 bg-white flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-display-tech text-xs sm:text-sm font-bold text-[#000000] group-hover/card:text-[#476800] transition-colors line-clamp-1">
                      {member.name}
                    </h3>
                    <p className="font-mono-tech text-[10px] text-[#74a81e] font-semibold mb-1 line-clamp-1">
                      {member.role}
                    </p>
                    <p className="font-display-tech text-[11px] text-[#444748] leading-snug line-clamp-2">
                      {member.focus}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#c4c7c7]/30 flex items-center justify-between text-[10px] font-mono-tech text-[#476800] font-bold">
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3 group-hover/card:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
