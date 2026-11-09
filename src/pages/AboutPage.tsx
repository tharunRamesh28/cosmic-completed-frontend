import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from '../router';
import { ScrollReveal } from '../components/ScrollReveal';

import karthikPhoto from '../../projects/members/karthik.png';
import tharunPhoto from '../../projects/members/tharun.png';

export const AboutPage: React.FC = () => {
  const expertiseList = [
    'Electronics',
    'Embedded Systems',
    'IoT',
    'CAD Design',
    'Robotics',
    'Product Prototyping'
  ];

  const teamMembers = [
    {
      name: 'Karthik Arjun',
      role: 'FOUNDER & CEO',
      description: 'CAD Designer, Embedded Engineer and Hardware Verification Engineer',
      image: karthikPhoto,
      socials: {
        instagram: 'https://www.instagram.com/cosmic_circuits_',
        linkedin: 'https://www.linkedin.com/in/karthik-arjun-kalavakunta-14b7b7397?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        email: 'mailto:kalavakuntakarthik8@gmail.com'
      }
    },
    {
      name: 'Tharun',
      role: 'CO-FOUNDER & CTO',
      description: 'IoT Engineer, Full Stack Developer, Problem Solver',
      image: tharunPhoto,
      socials: {
        instagram: 'https://www.instagram.com/cosmic_circuits_',
        linkedin: 'https://www.linkedin.com/in/tharun-ramesh25',
        email: 'mailto:rameshtharun067@gmail.com'
      }
    }
  ];

  return (
    <div className="animate-in fade-in duration-300 px-6 md:px-16 py-12 md:py-20 max-w-[1440px] mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="font-mono-tech text-xs text-[#74a81e] font-semibold mb-6 flex items-center gap-2">
        <Link to="/" className="text-[#444748] hover:text-black transition-colors">HOME</Link>
        <span>#</span>
        <span>ABOUT</span>
      </div>

      {/* Page Header */}
      <div className="max-w-4xl mb-16 md:mb-24">
        <h1 className="font-display-tech text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#000000] tracking-tight mb-6">
          ABOUT ZEN TECH SOLUTIONS
        </h1>
        <div className="inline-block bg-[#f3f4f1] text-[#476800] border border-[#c4c7c7] font-mono-tech text-xs font-bold px-3 py-1 rounded mb-6">
          STUDIO POSITIONING
        </div>
        <h2 className="font-display-tech text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1b] tracking-tight mb-6">
          "WE TURN IDEAS INTO WORKING TECHNOLOGY."
        </h2>
        <p className="font-display-tech text-lg sm:text-xl md:text-2xl text-[#444748] font-normal leading-relaxed">
          Zen Tech Solutions is an electronics and product engineering studio focused on transforming ideas into real-world technology. We work across electronics, embedded systems, IoT, PCB development, CAD design, AI-powered hardware and complete product development.
        </p>
      </div>

      {/* OUR EXPERTISE SECTION */}
      <ScrollReveal>
        <div className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-8 md:p-12 mb-20 shadow-xs">
          <span className="font-mono-tech text-xs text-[#74a81e] font-bold uppercase tracking-wider block mb-6">
            # OUR EXPERTISE
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {expertiseList.map((item) => (
              <div
                key={item}
                className="bg-[#f9faf7] border border-[#c4c7c7]/50 rounded-xl p-4 flex items-center gap-3 hover:border-black transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#476800] shrink-0" />
                <span className="font-display-tech text-sm font-bold text-[#191c1b]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* TEAM / FOUNDERS SECTION */}
      <ScrollReveal>
        <div className="mb-20">
          <div className="max-w-3xl mb-12">
            <span className="font-mono-tech text-xs text-[#74a81e] font-bold uppercase tracking-wider block mb-2">
              # LEADERSHIP
            </span>
            <h2 className="font-display-tech text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000000] tracking-tight mb-4">
              OUR TEAM.
            </h2>
            <p className="font-display-tech text-base sm:text-lg text-[#444748]">
              The engineers and product architects behind Zen Tech Solutions.
            </p>
          </div>

          {/* 2-column balanced grid on desktop for Leadership */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-[#c4c7c7]/60 rounded-xl overflow-hidden shadow-xs hover:border-black transition-all duration-300 flex flex-col group"
              >
                {/* Compact Photo with Grayscale to Color Hover Transition */}
                <div className="aspect-[4/3] bg-[#f3f4f1] overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-[filter] duration-500 ease-in-out"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white font-mono-tech text-[10px] font-bold px-2.5 py-1 rounded">
                    {member.role}
                  </div>
                </div>

                {/* Information & Social Navigation Icons */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-display-tech text-lg font-bold text-[#000000] mb-0.5">
                      {member.name}
                    </h3>
                    <div className="font-mono-tech text-xs text-[#74a81e] font-semibold mb-2">
                      {member.role}
                    </div>
                    {member.description && (
                      <p className="font-display-tech text-sm text-[#444748] leading-relaxed">
                        {member.description}
                      </p>
                    )}
                  </div>

                  {/* Social Navigation Icons at bottom of card */}
                  {(member.socials.instagram || member.socials.linkedin || member.socials.email) && (
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#c4c7c7]/30">
                      {member.socials.instagram && (
                        <a
                          href={member.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-md border border-[#c4c7c7]/60 bg-[#f9faf7] flex items-center justify-center text-[#444748] hover:text-[#000000] hover:bg-[#c8f179]/20 hover:border-[#476800] transition-colors"
                          title={`${member.name} on Instagram`}
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-md border border-[#c4c7c7]/60 bg-[#f9faf7] flex items-center justify-center text-[#444748] hover:text-[#000000] hover:bg-[#c8f179]/20 hover:border-[#476800] transition-colors"
                          title={`${member.name} on LinkedIn`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.socials.email && (
                        <a
                          href={member.socials.email}
                          className="w-8 h-8 rounded-md border border-[#c4c7c7]/60 bg-[#f9faf7] flex items-center justify-center text-[#444748] hover:text-[#000000] hover:bg-[#c8f179]/20 hover:border-[#476800] transition-colors"
                          title={`Email ${member.name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Return Home Subtle Link */}
      <div className="pt-8 border-t border-[#c4c7c7]/30 flex justify-between items-center font-mono-tech text-xs">
        <Link to="/" className="text-[#444748] hover:text-black transition-colors flex items-center gap-1.5">
          <span>RETURN HOME</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link to="/works" className="text-[#476800] font-bold hover:underline flex items-center gap-1.5">
          <span>EXPLORE OUR WORKS</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
