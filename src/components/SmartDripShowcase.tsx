import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Activity, Droplet, Thermometer } from 'lucide-react';
import smartDripImg from '../assets/smartdrip_plus.jpg';
import { useRouter } from '../router';

interface SmartDripShowcaseProps {
  onStartProject?: (service?: string) => void;
}

export const SmartDripShowcase: React.FC<SmartDripShowcaseProps> = ({ onStartProject }) => {
  const { navigate } = useRouter();
  const [activeDimension, setActiveDimension] = useState<number>(0);

  const dimensions = [
    {
      num: '01',
      title: 'VITAL',
      icon: Activity,
      desc: 'Real-time telemetry and continuous monitoring of critical patient indicators.'
    },
    {
      num: '02',
      title: 'IV',
      icon: Droplet,
      desc: 'Precision volumetric infusion tracking, flow-rate supervision and automated occlusion detection.'
    },
    {
      num: '03',
      title: 'THERMAL',
      icon: Thermometer,
      desc: 'Continuous thermal environment regulation and real-time core fluid temperature monitoring.'
    }
  ];

  const handleExplore = () => {
    navigate('/works');
  };

  const handleRequestDemo = () => {
    if (onStartProject) {
      onStartProject('SmartDrip+ Connected Medical Monitoring');
    } else {
      navigate('/order');
    }
  };

  return (
    <section id="smartdrip" className="px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 max-w-[1440px] mx-auto">
      {/* Large Deep-Black Section Card Container */}
      <div className="bg-[#090909] text-white rounded-2xl md:rounded-3xl border border-neutral-800/90 overflow-hidden shadow-2xl relative">
        {/* Subtle Ambient Lime-Green Glow Background Accents */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#b9e86a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#b9e86a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="p-4 sm:p-8 md:p-14 lg:p-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            
            {/* Left Column: Product Story & Content (~42% desktop, full-width mobile) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              {/* 1. Clear Eyebrow Label */}
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <span className="w-2 h-2 rounded-full bg-[#b9e86a] inline-block shadow-[0_0_8px_#b9e86a]"></span>
                <span className="font-mono-tech text-xs tracking-widest uppercase text-[#b9e86a] font-semibold">
                  OUR FEATURED PRODUCT
                </span>
              </div>

              {/* 2. Main Heading */}
              <h2 className="font-display-tech text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-2 sm:mb-4">
                SmartDrip<span className="text-[#b9e86a]">+</span>
              </h2>

              {/* 3. Tagline Statement */}
              <p className="font-display-tech text-sm sm:text-xl font-medium text-neutral-200 leading-snug mb-3 sm:mb-4">
                One connected view across vital, IV and thermal monitoring.
              </p>

              {/* 4. Prominent Mobile Product Visual (Shown directly below tagline on mobile) */}
              <div className="block lg:hidden mb-4 sm:mb-6">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl flex items-center justify-center">
                  <img
                    src={smartDripImg}
                    alt="SmartDrip+ Connected Vital, IV and Thermal Medical Monitoring System"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Subtle Technical Hardware Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-md border border-neutral-700/80 rounded-md px-2 py-1 flex items-center gap-1.5 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b9e86a] animate-pulse" />
                    <span className="font-mono-tech text-[9px] tracking-wider uppercase text-neutral-300 font-semibold">
                      SMARTDRIP+ # CONNECTED
                    </span>
                  </div>
                  {/* Fluid Telemetry Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md border border-neutral-800 rounded-md px-2 py-1 pointer-events-none shadow-md">
                    <span className="font-mono-tech text-[10px] font-bold text-[#b9e86a]">
                      ACTIVE (0.01mm)
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Comprehensive Product Description */}
              <p className="font-display-tech text-xs sm:text-base text-neutral-400 font-normal leading-relaxed mb-4 sm:mb-6">
                Designed to bring critical monitoring information together in a clear, connected system, SmartDrip+ combines vital, IV and thermal awareness into one intelligent hardware solution. Engineered with high-precision optical drop-sensing, low-power telemetry, and continuous thermal regulation.
              </p>

              {/* 6. Responsive Product Metadata Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 py-2.5 px-3 sm:px-4 bg-neutral-900/90 rounded-xl border border-neutral-800 mb-4 sm:mb-8 font-mono-tech text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">PRODUCT</span>
                  <span className="font-bold text-white text-xs">SmartDrip+</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">CATEGORY</span>
                  <span className="font-bold text-neutral-300 text-xs">Medical IoT</span>
                </div>
                <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 border-neutral-800/80 pt-2 sm:pt-0">
                  <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">SYSTEM ARCHITECTURE</span>
                  <span className="font-bold text-[#b9e86a] text-xs">Vital × IV × Thermal</span>
                </div>
              </div>

              {/* 7. Three Core Feature Dimensions (01 VITAL, 02 IV, 03 THERMAL) */}
              <div className="mb-5 sm:mb-8">
                <div className="flex flex-row gap-1.5 sm:gap-4 border-b border-neutral-800 pb-2.5 sm:pb-4">
                  {dimensions.map((dim, idx) => {
                    const isSelected = activeDimension === idx;
                    return (
                      <button
                        key={dim.num}
                        type="button"
                        onClick={() => setActiveDimension(idx)}
                        onMouseEnter={() => setActiveDimension(idx)}
                        className={`group text-left p-1.5 sm:p-2.5 rounded-lg transition-all duration-200 flex-1 cursor-pointer border ${
                          isSelected
                            ? 'bg-neutral-800/80 border-[#b9e86a]/60 text-white'
                            : 'bg-neutral-900/40 border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`font-mono-tech text-[10px] sm:text-[11px] font-bold transition-colors ${
                            isSelected ? 'text-[#b9e86a]' : 'text-neutral-500 group-hover:text-[#b9e86a]'
                          }`}>
                            {dim.num}
                          </span>
                          <span className="font-display-tech text-[11px] sm:text-sm font-bold tracking-wider text-white">
                            {dim.title}
                          </span>
                        </div>
                        <div className={`h-[2px] w-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-[#b9e86a] scale-x-100' : 'bg-transparent scale-x-0 group-hover:scale-x-50'
                        }`} />
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic short description for active dimension */}
                <p className="font-mono-tech text-xs text-neutral-400 mt-2 sm:mt-3 flex items-start gap-2">
                  <span className="text-[#b9e86a] font-bold mt-0.5">↳</span>
                  <span>{dimensions[activeDimension].desc}</span>
                </p>
              </div>

              {/* 8. CTAs */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button
                  onClick={handleExplore}
                  className="bg-white text-[#0a0a0a] font-mono-tech text-xs font-bold px-4 sm:px-7 py-3 sm:py-3.5 rounded-lg hover:bg-[#b9e86a] transition-all duration-200 flex items-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(185,232,106,0.3)]"
                >
                  <span>EXPLORE SMARTDRIP+</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleRequestDemo}
                  className="bg-transparent text-neutral-300 border border-neutral-700 hover:border-[#b9e86a] hover:text-white font-mono-tech text-xs font-semibold px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>REQUEST A DEMO</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#b9e86a] transition-colors" />
                </button>
              </div>
            </div>

            {/* Right Column: Desktop Large SmartDrip+ Product Visual (~58%) */}
            <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center relative">
              <div className="relative w-full aspect-[4/3] max-h-[560px] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group flex items-center justify-center">
                <img
                  src={smartDripImg}
                  alt="SmartDrip+ Connected Vital, IV and Thermal Medical Monitoring System"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                />

                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-neutral-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-[#b9e86a] inline-block animate-pulse"></span>
                  <span className="font-mono-tech text-[10px] tracking-wider uppercase text-neutral-300 font-semibold">
                    SMARTDRIP+ # CONNECTED SYSTEM
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-2 flex items-center gap-3 pointer-events-none shadow-lg">
                  <div className="flex flex-col text-right">
                    <span className="font-mono-tech text-[9px] text-neutral-500 uppercase">TELEMETRY STATUS</span>
                    <span className="font-mono-tech text-xs font-bold text-[#b9e86a]">ACTIVE (0.01mm TOLERANCE)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartDripShowcase;
