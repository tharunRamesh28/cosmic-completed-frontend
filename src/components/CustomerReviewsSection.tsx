import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Star, MessageSquarePlus, Quote, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { supabase, CustomerReview } from '../lib/supabase';
import { useReviewModal } from '../lib/ReviewModalContext';

export const CustomerReviewsSection: React.FC = () => {
  const { openReviewModal, reviewSubmittedCount } = useReviewModal();

  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const fetchApprovedReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data as CustomerReview[]);
      }
    } catch {
      // Graceful fallback for network issues
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedReviews();
  }, [fetchApprovedReviews, reviewSubmittedCount]);

  // Compute metrics
  const totalApproved = reviews.length;
  const averageRating = useMemo(() => {
    if (totalApproved === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / totalApproved).toFixed(1);
  }, [reviews, totalApproved]);

  const displayedReviews = useMemo(() => {
    return reviews.slice(0, visibleCount);
  }, [reviews, visibleCount]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <section
      id="reviews"
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto border-t border-[#c4c7c7]/30 select-none"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-bold text-[#476800] bg-[#c8f179]/20 border border-[#c8f179]/50 px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span># CLIENT FEEDBACK</span>
          </div>
          <h2 className="font-display-tech text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000000] tracking-tight mb-3">
            CUSTOMER REVIEWS.
          </h2>
          <p className="font-display-tech text-base sm:text-lg text-[#444748] leading-relaxed">
            Real feedback from innovators, engineering teams, and startups who build with Zen Tech Solutions.
          </p>
        </div>

        {/* Action Button & Overall Rating Badge */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {totalApproved > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#c4c7c7]/80 bg-white shadow-2xs font-mono-tech text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[#191c1b] text-sm">{averageRating}</span>
              </div>
              <span className="text-[#74786d]">/ 5.0</span>
              <span className="text-neutral-300">|</span>
              <span className="text-[#444748] font-semibold">
                {totalApproved} {totalApproved === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          )}

          <button
            onClick={openReviewModal}
            className="inline-flex items-center gap-2 bg-[#c8f179] hover:bg-[#bbf060] text-[#191c1b] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-mono-tech text-xs font-bold tracking-wider transition-all duration-200 border border-[#a8df48] shadow-xs hover:shadow-[0_0_20px_rgba(200,241,121,0.4)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>SHARE YOUR EXPERIENCE</span>
          </button>
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="py-16 flex items-center justify-center font-mono-tech text-xs text-[#476800]">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-[#476800]/30 border-t-[#476800] rounded-full animate-spin" />
            <span>SYNCING REVIEWS...</span>
          </div>
        </div>
      ) : totalApproved === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#c8f179]/20 border border-[#74a81e]/30 flex items-center justify-center text-[#476800] mb-4">
            <Star className="w-7 h-7 fill-[#c8f179] text-[#476800]" />
          </div>
          <h3 className="font-display-tech text-xl sm:text-2xl font-extrabold text-[#191c1b] mb-2">
            Be the First to Review Us
          </h3>
          <p className="font-display-tech text-sm text-[#444748] leading-relaxed mb-6 max-w-md mx-auto">
            Have you collaborated with Zen Tech Solutions on electronics, robotics, IoT, or product prototyping? Share your experience with future partners.
          </p>
          <button
            onClick={openReviewModal}
            className="inline-flex items-center gap-2 bg-black text-[#c8f179] hover:bg-[#191c1b] px-5 py-2.5 rounded-xl font-mono-tech text-xs font-bold transition-all border border-black hover:border-[#c8f179] cursor-pointer shadow-xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      ) : (
        /* Reviews Grid */
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-[#c4c7c7]/70 rounded-2xl p-6 flex flex-col justify-between hover:border-black transition-all duration-300 shadow-2xs group relative"
              >
                <div>
                  {/* Top Bar: Stars & Verified Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-200 fill-neutral-100'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 font-mono-tech text-[10px] text-[#476800] bg-[#c8f179]/25 border border-[#c8f179]/60 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#476800]" />
                      <span>Verified Client</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-6">
                    <Quote className="w-6 h-6 text-neutral-200 absolute -top-2 -left-1 -z-0 opacity-40" />
                    <p className="font-display-tech text-sm text-[#191c1b] leading-relaxed relative z-10 italic">
                      "{review.review_text}"
                    </p>
                  </div>
                </div>

                {/* Footer: Customer Name & Date */}
                <div className="pt-4 border-t border-[#c4c7c7]/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-display-tech text-sm font-bold text-[#191c1b]">
                      {review.customer_name}
                    </h4>
                    <p className="font-mono-tech text-[11px] text-[#74786d]">
                      {formatDate(review.created_at)}
                    </p>
                  </div>

                  <span className="w-2 h-2 rounded-full bg-[#476800] shadow-[0_0_8px_#c8f179]" />
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < totalApproved && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="inline-flex items-center gap-2 bg-white text-[#191c1b] hover:bg-[#f9faf7] px-6 py-3 rounded-xl border border-[#c4c7c7] hover:border-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <span>Load More Reviews ({totalApproved - visibleCount} remaining)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
