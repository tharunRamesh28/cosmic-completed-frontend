import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: (tierName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const packages = [
    {
      id: 'rapid',
      name: 'RAPID',
      timeline: '7–10 Days',
      description: 'For ideas and projects that need a quick turnaround.',
      deliverables: [
        'Faster development cycle',
        'Focused implementation',
        'Essential testing',
        'Priority execution'
      ],
      cta: 'SELECT RAPID',
      highlighted: false
    },
    {
      id: 'standard',
      name: 'STANDARD',
      timeline: '10–14 Days',
      description: 'For projects requiring a balanced development and testing cycle.',
      deliverables: [
        'Complete implementation',
        'Development and testing',
        'Refinement and corrections',
        'Recommended for most projects'
      ],
      cta: 'SELECT STANDARD',
      highlighted: true
    },
    {
      id: 'extended',
      name: 'EXTENDED',
      timeline: '14–20 Days',
      description: 'For projects that require additional development, testing, or refinement.',
      deliverables: [
        'Detailed implementation',
        'Extended testing',
        'Multiple refinement cycles',
        'Additional technical requirements'
      ],
      cta: 'SELECT EXTENDED',
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-8 sm:py-14 md:py-28 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto border-t border-[#c4c7c7]/30">
      {/* Header */}
      <div className="mb-5 sm:mb-10 md:mb-14">
        <span className="font-mono-tech text-xs md:text-sm text-[#444748] tracking-widest uppercase flex items-center mb-1.5 sm:mb-2">
          <span className="w-6 sm:w-8 h-px bg-[#000000] mr-3 sm:mr-4 inline-block" />
          Development Speed &amp; Timeline
        </span>
        <h2 className="font-display-tech text-2xl sm:text-4xl md:text-5xl font-bold text-[#000000] tracking-tight">
          DEVELOPMENT PACKAGES
        </h2>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 mb-5 sm:mb-10">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-[#ffffff] rounded-xl p-4 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-200 relative ${
              pkg.highlighted
                ? 'border-2 border-[#000000] shadow-sm ring-1 ring-[#c8f179]'
                : 'border border-[#c4c7c7]/60 shadow-xs hover:border-black'
            }`}
          >
            {pkg.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8f179] text-[#141f00] font-mono-tech text-[9px] sm:text-[10px] uppercase font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-black shadow-xs">
                RECOMMENDED
              </div>
            )}

            <div>
              {/* Package Name & Timeline */}
              <div className="mb-2 sm:mb-4">
                <span className="font-mono-tech text-[10px] sm:text-[11px] text-[#476800] uppercase font-bold tracking-wider block mb-0.5 sm:mb-1">
                  SPEED TIER
                </span>
                <h3 className="font-display-tech text-xl sm:text-3xl font-black text-[#000000] tracking-tight">
                  {pkg.name}
                </h3>
              </div>

              {/* Timeline Pill */}
              <div className="flex items-center gap-2 font-mono-tech text-[11px] sm:text-xs text-[#191c1b] font-bold bg-[#f4fbe9] border border-[#c8f179] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg mb-3 sm:mb-5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#476800]" />
                <span>TIMELINE: {pkg.timeline}</span>
              </div>

              {/* Description */}
              <p className="font-display-tech text-xs sm:text-sm text-[#444748] leading-relaxed mb-3 sm:mb-6">
                {pkg.description}
              </p>

              <div className="h-px w-full bg-[#c4c7c7]/50 mb-3 sm:mb-6" />

              {/* Deliverables List */}
              <div className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8">
                {pkg.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-display-tech text-[#191c1b]">
                    <Check className="w-3.5 h-3.5 text-[#476800] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={() => onSelectTier(pkg.name)}
              className={`w-full font-mono-tech text-xs tracking-wider px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg flex justify-between items-center transition-all cursor-pointer font-bold ${
                pkg.highlighted
                  ? 'bg-[#000000] text-white hover:bg-[#2e312f]'
                  : 'bg-transparent border border-[#000000] text-[#000000] hover:bg-[#edeeeb]'
              }`}
            >
              <span>{pkg.cta}</span>
              <ArrowRight className="w-4 h-4 text-[#c8f179]" />
            </button>
          </div>
        ))}
      </div>

      {/* Professional Pricing Message */}
      <div className="border border-[#c4c7c7]/60 bg-[#f9faf7] rounded-xl p-3.5 sm:p-6 text-center max-w-3xl mx-auto">
        <p className="font-display-tech text-xs sm:text-base font-semibold text-[#191c1b] mb-1">
          Your project fee is based on the package and development timeline you select.
        </p>
        <p className="font-mono-tech text-[11px] sm:text-xs text-[#444748]">
          The final project fee will depend on your selected package, technical complexity, hardware/software requirements, and overall engineering scope.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
