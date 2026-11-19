import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Radio, Globe, Compass, Bot, ArrowRight, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from '../router';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesCoreProps {
  onStartProjectForService?: (serviceName: string) => void;
}

interface ServiceCardData {
  id: string;
  num: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ElementType;
  capabilities: string[];
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    id: 'hardware',
    num: '01',
    tag: 'PHYSICAL_NODE_01',
    title: 'HARDWARE',
    description: 'Custom PCB design, circuitry, and embedded systems engineered for reliability and scale.',
    icon: Cpu,
    capabilities: [
      'Multi-layer HDI & RF Circuit Layouts',
      'Ultra-Low Power Micro-Amp Sleep Regimes',
      'Power Electronics, BMS & Battery Mgmt',
      'Design for Manufacturability (DFM) Yield'
    ]
  },
  {
    id: 'iot',
    num: '02',
    tag: 'CONNECTIVITY_NODE_02',
    title: 'IoT',
    description: 'Connected device ecosystems, sensor networks, and secure data transmission protocols.',
    icon: Radio,
    capabilities: [
      'LoRaWAN, BLE 5.4 Mesh & Cellular (NB-IoT)',
      'Hardware Cryptographic Key Security',
      'Fault-Tolerant A/B Partition OTA Engine',
      'Multi-Modal Environmental Sensor Fusion'
    ]
  },
  {
    id: 'web',
    num: '03',
    tag: 'INTERFACE_NODE_03',
    title: 'WEB',
    description: 'Performant web applications, dashboards, and APIs to interface with physical products.',
    icon: Globe,
    capabilities: [
      'Real-Time Telemetry Streaming & WebSockets',
      'High-Performance WebGL Data Visualizers',
      'Fleet Provisioning & Remote Diagnostics',
      'RESTful & gRPC Resilient Microservices'
    ]
  },
  {
    id: 'cad',
    num: '04',
    tag: 'MECHANICAL_NODE_04',
    title: 'CAD',
    description: 'Industrial design, 3D modelling, and mechanical engineering for manufacturability.',
    icon: Compass,
    capabilities: [
      'Industrial Product Styling & Ergonomics',
      'Tooling-Ready Plastic Injection Molding',
      'IP67 / IP68 Waterproof Gasket Engineering',
      'Finite Element Analysis (FEA) Thermal Models'
    ]
  },
  {
    id: 'robotics',
    num: '05',
    tag: 'AUTONOMOUS_NODE_05',
    title: 'ROBOTICS',
    description: 'Design and development of intelligent robotic systems for automation, monitoring, inspection, and real-world applications.',
    icon: Bot,
    capabilities: [
      'Kinematic Multi-Axis Actuation & Arms',
      'Precision Servo & Stepper Motor Control',
      'Autonomous Path Planning & Avoidance',
      'Real-Time Sensor & Machine Vision Fusion'
    ]
  }
];

export const CapabilitiesCore: React.FC<CapabilitiesCoreProps> = ({ onStartProjectForService }) => {
  const { navigate } = useRouter();

  // DOM Refs for GSAP scoping
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const whatWeRef = useRef<HTMLDivElement>(null);
  const buildWordRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingTitleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  // Mobile header and heading refs for scroll reveal
  const mobileHeaderRef = useRef<HTMLDivElement>(null);
  const mobileHeadingRef = useRef<HTMLHeadingElement>(null);

  // Cards carousel refs
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile cards refs for scroll focal tracking
  const mobileCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [mobileActiveCardId, setMobileActiveCardId] = useState<string>(SERVICES_DATA[0].id);
  const mobileActiveCardIdRef = useRef<string>(SERVICES_DATA[0].id);

  // Active index for state coordination
  const activeIndexRef = useRef<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // ScrollTrigger instance ref
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  // GSAP ScrollTrigger Pinned Overlapping Horizontal Deck Timeline (Desktop)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    // 1. DESKTOP & TABLET: SCROLL INTRO & OVERLAPPING CARDS (min-width: 1024px)
    mm.add('(min-width: 1024px)', () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length || !cardsTrackRef.current) return;

      // Coordinate anchors with clear padding space between cards (ZERO OVERLAP):
      // Card width is ~285px. Center-to-center distance is 320px, giving a clean 35px visible gap between cards.
      // Active card sits at X_ACTIVE (-40px), centered in the right showcase viewport.
      // Upcoming card peeks at X_PEEK (+280px) with NO overlap, completely readable.
      // Previous card sits at X_PREV_1 (-360px) with NO overlap, completely readable.
      // Older card sits at X_PREV_2 (-660px) with soft intensity.
      // Queued cards wait offscreen at X_QUEUED (+660px).
      const X_ACTIVE = -40;
      const X_PREV_1 = -360;
      const X_PREV_2 = -660;
      const X_PEEK = 280;
      const X_QUEUED = 660;

      // 1. First ensure neutral transform state to measure natural docked rects
      gsap.set(headingWrapperRef.current, { x: 0, y: 0, scale: 1, opacity: 1 });
      gsap.set(buildWordRef.current, { x: 0, y: 0 });

      const stageEl = stageRef.current;
      const headingWrapperEl = headingWrapperRef.current;
      const whatWeEl = whatWeRef.current;
      const buildWordEl = buildWordRef.current;

      let centerDeltaX = 0;
      let centerDeltaY = 0;
      let buildRow1X = 227;
      let buildRow1Y = -55;
      const INTRO_SCALE = 1.45;

      if (stageEl && headingWrapperEl && whatWeEl && buildWordEl) {
        const stageRect = stageEl.getBoundingClientRect();
        const whatWeRect = whatWeEl.getBoundingClientRect();
        const buildRect = buildWordEl.getBoundingClientRect();

        // Row 1 offsets for BUILD to sit directly next to WHAT WE:
        const ROW1_GAP = 14;
        buildRow1X = whatWeRect.width + ROW1_GAP;
        const whatWeCenterY = whatWeRect.top + whatWeRect.height / 2;
        const buildCenterY = buildRect.top + buildRect.height / 2;
        buildRow1Y = whatWeCenterY - buildCenterY;

        // Combined 1-line phrase dimensions:
        const phraseWidth = whatWeRect.width + ROW1_GAP + buildRect.width;
        const phraseHeight = Math.max(whatWeRect.height, buildRect.height);

        const scaledWidth = phraseWidth * INTRO_SCALE;
        const scaledHeight = phraseHeight * INTRO_SCALE;

        // Screen center inside stage:
        const stageCenterX = stageRect.left + stageRect.width / 2;
        const stageCenterY = stageRect.top + stageRect.height / 2;

        const targetLeft = stageCenterX - (scaledWidth / 2);
        const targetTop = stageCenterY - (scaledHeight / 2);
        centerDeltaX = targetLeft - whatWeRect.left;
        centerDeltaY = targetTop - whatWeRect.top;
      }

      // Initial state: "WHAT WE BUILD" starts with animated arrival state (offset down, opacity 0, scale 0.92)
      gsap.set(headingWrapperEl, {
        transformOrigin: 'top left',
        x: centerDeltaX,
        y: centerDeltaY + 50,
        scale: INTRO_SCALE * 0.92,
        opacity: 0
      });

      gsap.set(whatWeEl, {
        x: -25,
        opacity: 0
      });

      gsap.set(buildWordEl, {
        transformOrigin: 'left center',
        x: buildRow1X,
        y: buildRow1Y,
        scale: 0.82,
        opacity: 0
      });

      // Supporting left-column elements start hidden until heading docks
      gsap.set(eyebrowRef.current, { opacity: 0, x: -25 });
      gsap.set(descRef.current, { opacity: 0, y: 18 });
      gsap.set(ctaBtnRef.current, { opacity: 0, y: 18 });

      // Service cards start hidden during the centered hero intro
      cards.forEach((card, i) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: i === 0 ? X_ACTIVE : i === 1 ? X_PEEK : X_QUEUED,
          y: 0,
          rotation: 0,
          scale: i === 0 ? 1 : i === 1 ? 0.98 : 0.9,
          opacity: 0,
          zIndex: i === 0 ? 50 : i === 1 ? 30 : 10,
          transformOrigin: 'center center'
        });
      });

      // Master Scroll-Driven Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2600',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            const p = self.progress;
            let currentIdx = 0;
            if (p >= 0.83) {
              currentIdx = 4;
            } else if (p >= 0.65) {
              currentIdx = 3;
            } else if (p >= 0.48) {
              currentIdx = 2;
            } else if (p >= 0.31) {
              currentIdx = 1;
            } else {
              currentIdx = 0;
            }
            if (currentIdx !== activeIndexRef.current) {
              activeIndexRef.current = currentIdx;
              setActiveCardIndex(currentIdx);
            }
          }
        }
      });

      scrollTriggerInstanceRef.current = tl.scrollTrigger || null;

      // =========================================================================
      // PHASE 1 — DYNAMIC ARRIVAL ANIMATION: "WHAT WE BUILD" ARRIVES IN CENTER
      // =========================================================================
      // 1.1 Heading container floats up into center and reveals (t = 0.0 -> 0.6)
      tl.to(
        headingWrapperEl,
        {
          y: centerDeltaY,
          scale: INTRO_SCALE,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out'
        },
        0.0
      );

      // 1.2 "WHAT WE" slides in from the left and fades in (t = 0.05 -> 0.55)
      tl.to(
        whatWeEl,
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        },
        0.05
      );

      // 1.3 "BUILD" badge blooms in with spring bounce (t = 0.15 -> 0.65)
      tl.to(
        buildWordEl,
        {
          scale: 1.0,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.5)'
        },
        0.15
      );

      // =========================================================================
      // PHASE 2 — CENTER PROMINENCE HOLD: User sees arrived phrase (t = 0.65 -> 1.15)
      // =========================================================================
      tl.to({}, { duration: 0.5 });

      // =========================================================================
      // PHASE 3 — GLIDE TO LEFT, WRAP INTO 2 LINES & DOCK (t = 1.15 -> 2.15)
      // =========================================================================
      // Heading wrapper glides from center to resting left position (0, 0) and scales to 1
      tl.to(
        headingWrapperEl,
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: 'power2.inOut'
        },
        1.15
      );

      // BUILD word smoothly glides from Row 1 down into Row 2 beneath WHAT WE
      tl.to(
        buildWordEl,
        {
          x: 0,
          y: 0,
          duration: 1.0,
          ease: 'power2.inOut'
        },
        1.15
      );

      // Supporting left column elements reveal as heading settles
      tl.to(eyebrowRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 1.65);
      tl.to(descRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.85);
      tl.to(ctaBtnRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.0);

      // Service cards on the right reveal into balance
      tl.to(cards[0], { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 1.95);
      tl.to(cards[1], { opacity: 0.85, scale: 0.98, duration: 0.7, ease: 'power2.out' }, 1.95);

      // =========================================================================
      // PHASE 4 — BALANCED READING HOLD ON DOCKED STATE (t = 2.15 -> 2.75)
      // =========================================================================
      tl.to({}, { duration: 0.6 });

      // =========================================================================
      // PHASE 5 — CAROUSEL DECK SHOWCASE (t = 2.75 onward)
      // =========================================================================
      // Transition 1: HARDWARE -> IoT (t = 2.75 -> 3.75)
      tl.set(cards[1], { zIndex: 50 }, 2.75);
      tl.set(cards[0], { zIndex: 20 }, 2.75);
      if (cards[2]) tl.set(cards[2], { zIndex: 30 }, 2.75);
      tl.to(
        cards[0],
        { x: X_PREV_1, opacity: 0.65, scale: 0.96, duration: 1.0, ease: 'power1.inOut' },
        2.75
      );
      tl.to(
        cards[1],
        { x: X_ACTIVE, scale: 1, opacity: 1, duration: 1.0, ease: 'power1.inOut' },
        2.75
      );
      if (cards[2]) {
        tl.to(
          cards[2],
          { x: X_PEEK, scale: 0.98, opacity: 0.85, duration: 1.0, ease: 'power1.inOut' },
          2.75
        );
      }

      // Reading hold on Card 1 (IoT) (t = 3.75 -> 4.25)
      tl.to({}, { duration: 0.5 });

      // Transition 2: IoT -> WEB (t = 4.25 -> 5.25)
      tl.set(cards[2], { zIndex: 50 }, 4.25);
      tl.set(cards[1], { zIndex: 20 }, 4.25);
      tl.set(cards[0], { zIndex: 10 }, 4.25);
      if (cards[3]) tl.set(cards[3], { zIndex: 30 }, 4.25);
      tl.to(
        cards[0],
        { x: -480, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power1.in' },
        4.25
      );
      tl.to(
        cards[1],
        { x: X_PREV_1, opacity: 0.65, scale: 0.96, duration: 1.0, ease: 'power1.inOut' },
        4.25
      );
      tl.to(
        cards[2],
        { x: X_ACTIVE, scale: 1, opacity: 1, duration: 1.0, ease: 'power1.inOut' },
        4.25
      );
      if (cards[3]) {
        tl.to(
          cards[3],
          { x: X_PEEK, scale: 0.98, opacity: 0.85, duration: 1.0, ease: 'power1.inOut' },
          4.25
        );
      }

      // Reading hold on Card 2 (Web) (t = 5.25 -> 5.75)
      tl.to({}, { duration: 0.5 });

      // Transition 3: WEB -> CAD (t = 5.75 -> 6.75)
      tl.set(cards[3], { zIndex: 50 }, 5.75);
      tl.set(cards[2], { zIndex: 20 }, 5.75);
      tl.set(cards[1], { zIndex: 10 }, 5.75);
      if (cards[4]) tl.set(cards[4], { zIndex: 30 }, 5.75);
      tl.to(
        cards[1],
        { x: -480, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power1.in' },
        5.75
      );
      tl.to(
        cards[2],
        { x: X_PREV_1, opacity: 0.65, scale: 0.96, duration: 1.0, ease: 'power1.inOut' },
        5.75
      );
      tl.to(
        cards[3],
        { x: X_ACTIVE, scale: 1, opacity: 1, duration: 1.0, ease: 'power1.inOut' },
        5.75
      );
      if (cards[4]) {
        tl.to(
          cards[4],
          { x: X_PEEK, scale: 0.98, opacity: 0.85, duration: 1.0, ease: 'power1.inOut' },
          5.75
        );
      }

      // Reading hold on Card 3 (CAD) (t = 6.75 -> 7.25)
      tl.to({}, { duration: 0.5 });

      // Transition 4: CAD -> ROBOTICS (t = 7.25 -> 8.25)
      tl.set(cards[4], { zIndex: 50 }, 7.25);
      tl.set(cards[3], { zIndex: 20 }, 7.25);
      tl.set(cards[2], { zIndex: 10 }, 7.25);
      tl.to(
        cards[2],
        { x: -480, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power1.in' },
        7.25
      );
      tl.to(
        cards[3],
        { x: X_PREV_1, opacity: 0.65, scale: 0.96, duration: 1.0, ease: 'power1.inOut' },
        7.25
      );
      tl.to(
        cards[4],
        { x: X_ACTIVE, scale: 1, opacity: 1, duration: 1.0, ease: 'power1.inOut' },
        7.25
      );

      // Section exit settling (t = 8.25 -> 8.8)
      tl.to({}, { duration: 0.55 });
    });

    // 2. MOBILE: SCROLL-BASED CARD HIGHLIGHTING & HEADING RIGHT-TO-LEFT REVEAL (max-width: 767px)
    mm.add('(max-width: 767px)', () => {
      // Right-to-left scroll-driven entrance for "WHAT WE BUILD" heading on mobile
      if (mobileHeadingRef.current) {
        gsap.fromTo(
          mobileHeadingRef.current,
          {
            x: 90,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mobileHeaderRef.current || mobileHeadingRef.current,
              start: 'top 88%',
              end: 'top 48%',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      const handleScroll = () => {
        const focalY = window.innerHeight * 0.45;
        let closestId: string | null = null;
        let minDistance = Infinity;

        let currentActiveDistance = Infinity;
        const currentActiveEl = mobileCardRefs.current.get(mobileActiveCardIdRef.current);
        if (currentActiveEl) {
          const rect = currentActiveEl.getBoundingClientRect();
          currentActiveDistance = Math.abs(rect.top + rect.height / 2 - focalY);
        }

        mobileCardRefs.current.forEach((el, id) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenter - focalY);

          if (dist < minDistance && rect.bottom > 50 && rect.top < window.innerHeight - 50) {
            minDistance = dist;
            closestId = id;
          }
        });

        // Anti-flicker hysteresis threshold (20px)
        if (closestId && closestId !== mobileActiveCardIdRef.current) {
          if (minDistance + 20 < currentActiveDistance) {
            mobileActiveCardIdRef.current = closestId;
            setMobileActiveCardId(closestId);
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    });

    return () => {
      mm.revert();
      scrollTriggerInstanceRef.current = null;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full min-h-screen pt-[70px] sm:pt-[76px] md:pt-[84px] z-10 bg-[#f9faf7] overflow-hidden border-t border-[#c4c7c7]/30 select-none flex flex-col justify-center"
    >
      {/* Subtle Engineering Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none" />

      {/* ========================================================================= */}
      {/* DESKTOP SHOWCASE STAGE: LEFT-MIDDLE ALIGNED CONTENT + OVERLAPPING CARDS   */}
      {/* ========================================================================= */}
      <div
        ref={stageRef}
        className="hidden md:flex relative w-full h-[calc(100vh-84px)] min-h-[460px] max-h-[620px] items-center px-6 lg:px-12 xl:px-18 max-w-[1560px] mx-auto overflow-visible z-10"
      >
        {/* LEFT-MIDDLE FIXED COLUMN: Enters from left, settles and stays stable */}
        <div
          ref={leftColRef}
          className="w-[36%] lg:w-[34%] xl:w-[32%] shrink-0 pr-4 lg:pr-8 z-30 flex flex-col justify-center"
        >
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse shadow-[0_0_8px_#c8f179]" />
            <span className="font-mono-tech text-xs tracking-widest uppercase text-[#444748] font-bold">
              ENGINEERING DISCIPLINES
            </span>
          </div>

          {/* Heading: Begins centered in 1 line in big font, then smoothly glides left, wraps into 2 lines and docks */}
          <div ref={headingWrapperRef} className="mb-2.5 will-change-transform w-fit z-40">
            <h2
              ref={headingTitleRef}
              className="font-display-tech text-3xl lg:text-4xl xl:text-5xl font-black text-[#000000] tracking-tight leading-[1.08] block"
            >
              <div ref={whatWeRef} className="whitespace-nowrap inline-block">
                WHAT WE
              </div>
              <div className="mt-1">
                <span
                  ref={buildWordRef}
                  className="relative inline-block text-[#476800] bg-[#c8f179]/35 px-3 py-0.5 rounded-sm border border-[#b9e86a]/70 shadow-[0_0_24px_rgba(200,241,121,0.35)] will-change-transform"
                >
                  BUILD
                </span>
              </div>
            </h2>
          </div>

          {/* Supporting Description */}
          <p
            ref={descRef}
            className="font-display-tech text-xs lg:text-sm text-[#444748] leading-relaxed max-w-sm mb-4"
          >
            Innovative solutions across multiple disciplines to shape a smarter tomorrow.
          </p>

          {/* Explore Our Works Button */}
          <div>
            <button
              ref={ctaBtnRef}
              type="button"
              onClick={() => navigate('/works')}
              className="inline-flex items-center gap-2 bg-black text-[#c8f179] hover:bg-[#191c1b] px-4 py-2 rounded-xl font-mono-tech text-xs font-bold tracking-wider transition-all duration-200 group shadow-xs hover:shadow-[0_0_24px_rgba(200,241,121,0.25)] cursor-pointer"
            >
              <span>Explore Our Works</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c8f179] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: HORIZONTAL OVERLAPPING DECK STAGE (ALIGNED STRAIGHT OPPOSITE WHAT WE BUILD) */}
        <div
          className="w-[64%] lg:w-[66%] xl:w-[68%] h-full relative flex items-center justify-center overflow-visible"
        >
          {/* Relative Track vertically centered straight opposite the left content */}
          <div
            ref={cardsTrackRef}
            className="relative w-full h-[365px] lg:h-[380px] flex items-center justify-center"
          >
            {SERVICES_DATA.map((service, idx) => {
              const IconComponent = service.icon;
              const isActive = activeCardIndex === idx;

              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`absolute top-1/2 left-1/2 w-[280px] lg:w-[285px] xl:w-[295px] h-[360px] lg:h-[375px] rounded-[22px] p-4 lg:p-4.5 flex flex-col justify-between transition-[border-color,box-shadow,background-color] duration-200 ${isActive
                    ? 'bg-white border-2 border-[#b9e86a] shadow-[0_16px_36px_rgba(0,0,0,0.08),0_0_28px_rgba(185,232,106,0.30)] ring-1 ring-[#c8f179]/50'
                    : 'bg-white border border-[#c4c7c7]/80 shadow-[0_12px_28px_rgba(0,0,0,0.05)]'
                    }`}
                  style={{
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  {/* Card Top: Number badge, tag and line icon */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4fbe9] border border-[#c8f179] text-[#476800]">
                          {service.num}
                        </span>
                        <span className="font-mono-tech text-[8px] uppercase tracking-wider text-[#717572] font-semibold">
                          {service.tag}
                        </span>
                      </div>

                      {/* Line Icon */}
                      <div
                        className={`w-7.5 h-7.5 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${isActive
                          ? 'bg-[#c8f179]/25 border border-[#b9e86a] text-[#476800] shadow-[0_0_12px_rgba(200,241,121,0.35)]'
                          : 'bg-[#f3f4f1] border border-[#c4c7c7]/50 text-[#191c1b]'
                          }`}
                      >
                        <IconComponent className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3
                      className={`font-display-tech text-lg lg:text-xl font-black tracking-tight mb-1 transition-colors duration-200 ${isActive ? 'text-[#476800]' : 'text-[#000000]'
                        }`}
                    >
                      {service.title}
                    </h3>

                    {/* Editorial Description */}
                    <p className="font-display-tech text-[11.5px] lg:text-xs text-[#2e312f] leading-snug font-medium mb-2.5 line-clamp-2">
                      &ldquo;{service.description}&rdquo;
                    </p>

                    {/* Deliverables / Capabilities Pills */}
                    <div className="space-y-1 mb-1.5">
                      {service.capabilities.map((cap, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center gap-1.5 bg-[#f9faf7] border border-[#c4c7c7]/60 rounded-md px-2 py-0.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#476800] shrink-0" />
                          <span className="font-mono-tech text-[9.5px] lg:text-[10px] text-[#2e312f] font-medium truncate">
                            {cap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Micro CTA Button */}
                  <div className="pt-2 border-t border-[#c4c7c7]/40 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartProjectForService?.(service.title)}
                      className={`w-full font-mono-tech text-[9.5px] lg:text-[10px] tracking-wider px-2.5 py-1.5 rounded-lg flex justify-between items-center transition-colors duration-200 cursor-pointer font-bold ${isActive
                        ? 'bg-black text-[#c8f179] hover:bg-neutral-800 shadow-xs'
                        : 'bg-[#f3f4f1] border border-[#c4c7c7]/60 text-[#191c1b] hover:border-black'
                        }`}
                    >
                      <span>START A PROJECT WITH {service.title}</span>
                      <ArrowRight className="w-3 h-3 text-[#c8f179]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE SHOWCASE (max-width: 767px) — CLEAN VERTICAL STACK (OLD DESIGN)    */}
      {/* ========================================================================= */}
      <div className="md:hidden py-10 px-4 flex flex-col relative z-10 overflow-hidden">
        {/* Mobile Section Header */}
        <div ref={mobileHeaderRef} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse" />
            <span className="font-mono-tech text-[11px] tracking-wider uppercase text-[#444748] font-bold">
              ENGINEERING DISCIPLINES
            </span>
          </div>

          <h2
            ref={mobileHeadingRef}
            className="font-display-tech text-3xl font-black text-[#000000] tracking-tight leading-tight mb-2 will-change-transform"
          >
            WHAT WE{' '}
            <span className="text-[#476800] bg-[#c8f179]/35 px-2 py-0.5 rounded-sm border border-[#b9e86a]/70">
              BUILD
            </span>
          </h2>

          <p className="font-display-tech text-xs text-[#444748] leading-relaxed mb-4">
            Innovative solutions across multiple disciplines to shape a smarter tomorrow.
          </p>

          <button
            type="button"
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 bg-black text-[#c8f179] px-4 py-2 rounded-lg font-mono-tech text-xs font-bold tracking-wider"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c8f179]" />
          </button>
        </div>

        {/* Vertical Stack of Cards */}
        <div className="flex flex-col gap-4">
          {SERVICES_DATA.map((service) => {
            const IconComp = service.icon;
            const isMobActive = mobileActiveCardId === service.id;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) mobileCardRefs.current.set(service.id, el);
                  else mobileCardRefs.current.delete(service.id);
                }}
                className={`w-full rounded-2xl p-5 bg-white transition-all duration-300 flex flex-col justify-between ${isMobActive
                  ? 'border-2 border-[#b9e86a] shadow-[0_0_24px_rgba(185,232,106,0.30)] ring-1 ring-[#c8f179]/50 -translate-y-0.5'
                  : 'border border-[#c4c7c7]/70 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded transition-colors duration-200 ${isMobActive
                          ? 'bg-[#f4fbe9] border border-[#c8f179] text-[#476800]'
                          : 'bg-[#f3f4f1] border border-[#c4c7c7]/50 text-[#717572]'
                          }`}
                      >
                        {service.num}
                      </span>
                      <span className="font-mono-tech text-[9px] uppercase tracking-wider text-[#717572]">
                        {service.tag}
                      </span>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${isMobActive
                        ? 'bg-[#c8f179]/25 border border-[#b9e86a] text-[#476800]'
                        : 'bg-[#f3f4f1] border border-[#c4c7c7]/50 text-[#191c1b]'
                        }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <h3
                    className={`font-display-tech text-xl font-bold tracking-tight mb-1.5 transition-colors duration-200 ${isMobActive ? 'text-[#476800]' : 'text-black'
                      }`}
                  >
                    {service.title}
                  </h3>

                  <p className="font-display-tech text-xs text-[#444748] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {service.capabilities.map((cap, capIdx) => (
                      <div
                        key={capIdx}
                        className="flex items-center gap-2 bg-[#f9faf7] border border-[#c4c7c7]/50 rounded-md px-2.5 py-1 text-[10px] font-mono-tech text-[#2e312f]"
                      >
                        <Check className="w-3 h-3 text-[#476800] shrink-0" />
                        <span className="truncate">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartProjectForService?.(service.title)}
                  className={`w-full font-mono-tech text-[11px] font-bold py-2.5 px-3 rounded-lg flex items-center justify-between transition-all duration-200 ${isMobActive
                    ? 'bg-black text-[#c8f179] shadow-xs'
                    : 'bg-black text-[#c8f179] hover:bg-neutral-800'
                    }`}
                >
                  <span>SELECT {service.title}</span>
                  <ArrowRight className="w-3 h-3 text-[#c8f179]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesCore;
