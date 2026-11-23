import React from 'react';
import { Star } from 'lucide-react';
import { useReviewModal } from '../lib/ReviewModalContext';

export const FloatingReviewButton: React.FC = () => {
  const { openReviewModal } = useReviewModal();

  return (
    <button
      onClick={openReviewModal}
      className="fixed right-3 sm:right-6 bottom-5 sm:bottom-8 z-40 flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#191c1b] text-white hover:bg-black border border-[#c8f179]/60 shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_0_24px_rgba(200,241,121,0.5)] hover:border-[#c8f179] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
      title="Write a review or feedback for Zen Tech Solutions"
      aria-label="Review Us"
    >
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c8f179]/20 text-amber-300">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:animate-spin" />
      </span>
      <span className="font-mono-tech text-xs sm:text-xs font-bold tracking-wider text-white group-hover:text-[#c8f179] transition-colors pr-1">
        Review Us
      </span>
    </button>
  );
};
