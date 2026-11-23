import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, AlertCircle, Sparkles, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useReviewModal } from '../lib/ReviewModalContext';

const PREDEFINED_SUGGESTIONS = [
  'Excellent service and professional support.',
  'Very satisfied with the quality of work.',
  'The team understood our requirements perfectly.',
  'Great communication and timely delivery.',
  'Highly recommended for innovative solutions.',
  'Excellent technical support and execution.',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Exceptional',
};

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, closeReviewModal, notifyReviewSubmitted } = useReviewModal();

  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when modal closes or opens
  useEffect(() => {
    if (isReviewModalOpen) {
      setCustomerName('');
      setRating(5);
      setHoverRating(0);
      setReviewText('');
      setSelectedSuggestion(null);
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMessage(null);
    }
  }, [isReviewModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReviewModalOpen) {
        closeReviewModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewModalOpen, closeReviewModal]);

  if (!isReviewModalOpen) return null;

  const handleSelectSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    // If the textarea is empty or already matches a previous suggestion, replace it. Otherwise append.
    if (!reviewText.trim() || PREDEFINED_SUGGESTIONS.includes(reviewText.trim())) {
      setReviewText(suggestion);
    } else {
      setReviewText(`${reviewText.trim()} ${suggestion}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = customerName.trim();
    const trimmedText = reviewText.trim();

    // Validation
    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (trimmedName.length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }

    if (!trimmedText) {
      setErrorMessage('Please write your review or select a suggestion.');
      return;
    }

    if (trimmedText.length < 10) {
      setErrorMessage('Review must be at least 10 characters long.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('Please select a star rating between 1 and 5.');
      return;
    }

    // Spam Protection / Cooldown: Prevent multiple submissions within 20 seconds
    const storageKey = 'cc_review_last_submission_ts';
    const lastSubTs = localStorage.getItem(storageKey);
    const now = Date.now();
    if (lastSubTs) {
      const diff = now - parseInt(lastSubTs, 10);
      if (diff < 15000) {
        const waitSec = Math.ceil((15000 - diff) / 1000);
        setErrorMessage(`Please wait ${waitSec}s before submitting another review.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('customer_reviews').insert([
        {
          customer_name: trimmedName,
          rating,
          review_text: trimmedText,
          status: 'pending',
        },
      ]);

      if (error) {
        throw error;
      }

      localStorage.setItem(storageKey, now.toString());
      setIsSuccess(true);
      notifyReviewSubmitted();
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to submit review. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeReviewModal();
      }}
    >
      <div
        data-lenis-prevent
        className="bg-[#ffffff] text-[#191c1b] border border-[#c4c7c7] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto overscroll-contain"
      >
        {/* Close Button */}
        <button
          onClick={closeReviewModal}
          className="absolute top-5 right-5 p-2 rounded-lg border border-[#c4c7c7]/60 bg-white hover:bg-neutral-100 hover:border-black transition-all cursor-pointer text-[#444748] hover:text-black z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#c8f179]/20 border border-[#74a81e]/40 flex items-center justify-center text-[#476800] mb-5 shadow-[0_0_20px_rgba(200,241,121,0.3)] animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="font-mono-tech text-xs font-bold text-[#476800] tracking-widest uppercase mb-2">
              # FEEDBACK RECEIVED
            </span>

            <h3 className="font-display-tech text-2xl sm:text-3xl font-extrabold text-[#191c1b] mb-4">
              Thank You!
            </h3>

            <p className="font-display-tech text-sm sm:text-base text-[#444748] leading-relaxed max-w-md mb-8">
              Thank you for sharing your experience! Your review has been submitted and will be published after approval.
            </p>

            <button
              onClick={closeReviewModal}
              className="bg-black text-[#c8f179] hover:bg-[#191c1b] font-mono-tech text-xs font-bold px-8 py-3 rounded-xl border border-black hover:border-[#c8f179] transition-all shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div>
            {/* Header */}
            <div className="mb-6 pr-8">
              <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-bold text-[#476800] bg-[#c8f179]/20 border border-[#c8f179]/50 px-2.5 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLIENT FEEDBACK</span>
              </div>
              <h2 className="font-display-tech text-2xl sm:text-3xl font-extrabold text-[#191c1b] tracking-tight mb-2">
                Share Your Experience
              </h2>
              <p className="font-display-tech text-xs sm:text-sm text-[#444748] leading-relaxed">
                Your feedback helps us continuously refine our electronics, IoT, robotics, and product engineering solutions.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-mono-tech animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Name */}
              <div>
                <label className="block font-mono-tech text-xs font-bold uppercase tracking-wider text-[#191c1b] mb-2">
                  Your Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson or Tech Lead"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c4c7c7] bg-[#f9faf7] text-[#191c1b] placeholder-neutral-400 font-display-tech text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              {/* Star Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[#191c1b]">
                    Rating <span className="text-rose-600">*</span>
                  </label>
                  <span className="font-mono-tech text-xs font-semibold text-[#476800]">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-3 rounded-xl border border-[#c4c7c7]/60 bg-[#f9faf7]">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                              : 'text-neutral-300 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="font-mono-tech text-xs font-bold ml-2 text-neutral-600">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Predefined Review Suggestions */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#476800]" />
                  <span className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-[#444748]">
                    Quick Suggestions (Click to use or edit)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PREDEFINED_SUGGESTIONS.map((suggestion) => {
                    const isSelected = selectedSuggestion === suggestion;
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer font-display-tech leading-snug ${
                          isSelected
                            ? 'bg-[#c8f179]/20 border-[#74a81e] text-[#191c1b] font-semibold shadow-xs'
                            : 'bg-white border-[#c4c7c7]/70 text-[#444748] hover:border-black hover:text-black hover:bg-[#f9faf7]'
                        }`}
                      >
                        "{suggestion}"
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Written Review */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[#191c1b]">
                    Written Review <span className="text-rose-600">*</span>
                  </label>
                  <span className="font-mono-tech text-[10px] text-neutral-400">
                    {reviewText.length}/1000
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  placeholder="Share details about your collaboration, engineering quality, communication, and project delivery..."
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (selectedSuggestion && e.target.value !== selectedSuggestion) {
                      setSelectedSuggestion(null);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c7c7] bg-[#f9faf7] text-[#191c1b] placeholder-neutral-400 font-display-tech text-sm focus:outline-none focus:border-black focus:bg-white transition-all resize-y leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-black text-[#c8f179] hover:bg-[#191c1b] disabled:opacity-50 disabled:cursor-not-allowed font-mono-tech text-xs font-bold px-6 py-3.5 rounded-xl border border-black hover:border-[#c8f179] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-[0_0_15px_rgba(200,241,121,0.25)]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#c8f179]/30 border-t-[#c8f179] rounded-full animate-spin" />
                      <span>SUBMITTING REVIEW...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT REVIEW</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeReviewModal}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#c4c7c7] text-[#444748] hover:text-black hover:border-black font-mono-tech text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
