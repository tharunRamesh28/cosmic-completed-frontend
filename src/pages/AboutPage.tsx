import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from '../router';
import { ScrollReveal } from '../components/ScrollReveal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import karthikPhoto from '../../projects/members/karthik.png';
import tharunPhoto from '../../projects/members/tharun.png';
import cooPhoto from '../../projects/members/coo.png';
import vinnarasuPhoto from '../../projects/members/vinnarasu.png';

gsap.registerPlugin(ScrollTrigger);

export const AboutPage: React.FC = () => {
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typographyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [teamVisible, setTeamVisible] = useState(false);

  useEffect(() => {
    const el = teamSectionRef.current;
    if (!el) return;

    // Trigger heading visibility immediately if already in view
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTeamVisible(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTeamVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger sequence:
  // 1. Cards arrive first in their final positions while headings remain 100% hidden behind them.
  // 2. Only after all cards have arrived do the headings gradually emerge from behind the cards.
  useEffect(() => {
    const sectionEl = teamSectionRef.current;
    const cardsEl = cardsContainerRef.current;
    if (!sectionEl || !cardsEl) return;

    const typoEls = typographyRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!typoEls.length) return;

    const mm = gsap.matchMedia();

    // DESKTOP (>= 1024px): Synchronized sequence — cards enter first, then headings emerge from behind
    mm.add('(min-width: 1024px)', () => {
      // Typography starts completely hidden behind the photo cards
      gsap.set(typoEls, {
        y: 140,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsEl,
          // Start when cards begin entering the lower viewport
          start: 'top 85%',
          // Complete when cards reach prime reading position in the viewport
          end: 'top 22%',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      // STAGE 1: Cards scroll in from bottom to top; typography stays strictly hidden (0 to 0.45)
      tl.to({}, { duration: 0.45 });

      // STAGE 2: Now that cards have arrived, headings smoothly emerge from behind the cards (0.45 to 1.0)
      typoEls.forEach((el, i) => {
        tl.to(
          el,
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 0.55,
          },
          0.45 + i * 0.08
        );
      });
    });

    // TABLET & MOBILE (< 1024px): Responsive Per-Card Sequence
    // Each card arrives into view first; heading emerges only after card has settled
    mm.add('(max-width: 1023px)', () => {
      typoEls.forEach((el) => {
        const parentCard = el.parentElement;
        if (!parentCard) return;

        gsap.set(el, {
          y: 110,
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: parentCard,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        // Stage 1: Card arrives into viewport; heading stays hidden behind card
        tl.to({}, { duration: 0.45 });

        // Stage 2: Heading reveals from behind card once card is in place
        tl.to(el, {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          duration: 0.55,
        });
      });
    });

    return () => mm.revert();
  }, []);

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
      role: 'FOUNDER',
      behindLabel: 'FOUNDER',
      description: 'CAD Designer, Embedded Engineer and Hardware Verification Engineer',
      image: karthikPhoto,
      socials: {
        instagram: 'https://www.instagram.com/karthik_arjun_8?dmpr=MWtqNXZqcGVzMXczZA==',
        linkedin: 'https://www.linkedin.com/in/karthik-arjun-kalavakunta-14b7b7397?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        email: 'mailto:kalavakuntakarthik8@gmail.com'
      }
    },
    {
      name: 'Tharun',
      role: 'CO-FOUNDER',
      behindLabel: 'CO-FOUNDER',
      description: 'IoT Engineer, Full Stack Developer, Software Testing and Verification Engineer',
      image: tharunPhoto,
      socials: {
        instagram: 'https://www.instagram.com/tharun_25_07_?fqnt=MWEwbGl1NHIyZTVtMw==',
        linkedin: 'https://www.linkedin.com/in/tharun-ramesh25',
        email: 'mailto:rameshtharun067@gmail.com'
      }
    },
    {
      name: 'Navadeep',
      role: 'CORE TEAM',
      behindLabel: 'CORE TEAM',
      description: 'Finance, Product Strategy and Business Development',
      image: cooPhoto,
      socials: {
        instagram: 'https://www.instagram.com/m__r__navadeep?bqrl=MXI5dmxnaHkzc3g1eA==',
        linkedin: 'https://www.linkedin.com/in/navadeep-jinugu-258446387?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        email: 'mailto:jinugunavadeep@gmail.com'
      }
    },
    {
      name: 'Vinnarasu',
      role: 'CORE TEAM',
      behindLabel: 'CORE TEAM',
      description: 'Core Engineering, Research and Product Development',
      image: vinnarasuPhoto,
      socials: {
        instagram: 'https://www.instagram.com/vinn___03?hvrq=ZnhpeDE0Y2M1bnlk',
        linkedin: 'https://www.linkedin.com/in/vinnarasu-r?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        email: 'mailto:r.vinnarasu2006@gmail.com'
      }
    }
  ];

  const getTypographyClass = (label: string) => {
    if (label === 'CORE TEAM') {
      return 'text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-black tracking-tight';
    }
    return 'text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-black tracking-tight';
  };

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

      {/* TEAM / LEADERSHIP SECTION */}
      <div ref={teamSectionRef} className="mb-20">
        {/* Heading & Subtitle: Smooth pure opacity fade-in on scroll (no vertical/horizontal movement) */}
        <div
          className={`max-w-3xl mb-16 md:mb-20 lg:mb-24 transition-opacity duration-1000 ease-out will-change-[opacity] ${teamVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
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

        {/* 4-Card Balanced Horizontal Row on Desktop, Adaptive on Tablet & Mobile */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-[1380px] mx-auto items-stretch pt-4">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              ref={(el) => (cardRefs.current[index] = el)}
              className="relative flex flex-col h-full pt-20 sm:pt-24 lg:pt-28"
            >
              {/* LAYER 2: Oversized Behind-the-Image Typography */}
              <div
                ref={(el) => (typographyRefs.current[index] = el)}
                className="absolute left-0 right-0 top-0 h-20 sm:h-24 lg:h-28 z-10 flex items-end justify-center pb-5 sm:pb-5 lg:pb-6 pointer-events-none select-none will-change-transform"
                style={{
                  transform: 'translate3d(0, 135px, 0)',
                }}
              >
                <div className="text-center px-1">
                  <span
                    className={`font-display-tech text-[#000000] leading-none block select-none uppercase text-center ${getTypographyClass(
                      member.behindLabel
                    )}`}
                  >
                    {member.behindLabel}
                  </span>
                </div>
              </div>

              {/* LAYER 3: Foreground Card with Photo & Details */}
              <div className="relative z-20 bg-white border border-[#c4c7c7]/60 rounded-xl overflow-hidden shadow-xs hover:border-black transition-all duration-300 flex flex-col justify-between group h-full">
                {/* Photo with Grayscale to Color Hover Transition on Desktop, Full Original Color on Mobile */}
                <div className="aspect-[4/3] bg-[#f3f4f1] overflow-hidden relative shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter md:grayscale md:group-hover:grayscale-0 transition-[filter] duration-500 ease-in-out"
                  />
                </div>

                {/* Information & Social Navigation Icons */}
                <div className="p-5 flex flex-col justify-between flex-grow bg-white">
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

                  {/* Social Navigation Icons or Leadership Badge at bottom of card */}
                  {(member.socials.instagram || member.socials.linkedin || member.socials.email) ? (
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
                  ) : (
                    <div className="pt-4 mt-4 border-t border-[#c4c7c7]/30">
                      <span className="font-mono-tech text-[10px] text-[#74a81e] font-semibold">
                        ZEN TECH SOLUTIONS LEADERSHIP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
