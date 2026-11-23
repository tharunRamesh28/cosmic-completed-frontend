import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, AlertCircle, Sparkles, LogIn, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useReviewModal } from '../lib/ReviewModalContext';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from '../router';

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
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill user name if logged in
  useEffect(() => {
    if (isReviewModalOpen) {
      if (user) {
        const defaultName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
        setCustomerName(defaultName);
      } else {
        setCustomerName('');
      }
      setRating(5);
      setHoverRating(0);
      setReviewText('');
      setSelectedSuggestion(null);
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMessage(null);
    }
  }, [isReviewModalOpen, user]);

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

  const handleEmailSignIn = () => {
    closeReviewModal();
    navigate('/login');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    if (!reviewText.trim() || PREDEFINED_SUGGESTIONS.includes(reviewText.trim())) {
      setReviewText(suggestion);
    } else {
      setReviewText(`${reviewText.trim()} ${suggestion}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('You must be signed in with your email to submit a review.');
      return;
    }

    const trimmedName = customerName.trim();
    const trimmedText = reviewText.trim();
    const customerEmail = user.email || '';

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

    // Cooldown check (15 seconds)
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

    // Save with customer email in customer_name so admin always sees email regardless of schema
    const formattedName = `${trimmedName} (${customerEmail})`;

    try {
      // 1. Try insert with customer_email and user_id if columns exist
      let { error } = await supabase.from('customer_reviews').insert([
        {
          customer_name: formattedName,
          customer_email: customerEmail,
          user_id: user.id,
          rating,
          review_text: trimmedText,
          status: 'pending',
        },
      ]);

      // 2. Fallback if schema doesn't have customer_email / user_id column yet
      if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
        const fallbackRes = await supabase.from('customer_reviews').insert([
          {
            customer_name: formattedName,
            rating,
            review_text: trimmedText,
            status: 'pending',
          },
        ]);
        error = fallbackRes.error;
      }

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

        {!user ? (
          /* Sign In Required Screen */
          <div className="py-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#f4fbe9] border border-[#c8f179] flex items-center justify-center text-[#476800] mb-5 shadow-xs">
              <LogIn className="w-8 h-8" />
            </div>

            <span className="font-mono-tech text-xs font-bold text-[#476800] tracking-widest uppercase mb-2">
              # SIGN IN REQUIRED
            </span>

            <h3 className="font-display-tech text-2xl sm:text-3xl font-extrabold text-[#191c1b] mb-3">
              Sign In to Leave a Review
            </h3>

            <p className="font-display-tech text-sm text-[#444748] leading-relaxed max-w-md mb-8">
              To verify customer authenticity and maintain genuine feedback, please sign in with your email before submitting your review.
            </p>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-mono-tech w-full">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3 w-full max-w-sm">
              <button
                type="button"
                onClick={handleEmailSignIn}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-mono-tech text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#c8f179]" />
                <span>SIGN IN WITH EMAIL</span>
              </button>
            </div>
          </div>
        ) : isSuccess ? (
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
            <div className="mb-5 pr-8">
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

            {/* Signed-in Account Verification Banner */}
            <div className="mb-5 p-3 rounded-xl bg-[#f4fbe9] border border-[#c8f179] flex items-center justify-between font-mono-tech text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[#476800] shrink-0" />
                <span className="text-neutral-500 shrink-0">Reviewing as:</span>
                <span className="font-bold text-black truncate">{user.email}</span>
              </div>
              <span className="text-[10px] text-[#476800] bg-[#c8f179]/50 border border-[#aee64b] px-2 py-0.5 rounded font-bold uppercase shrink-0">
                Verified
              </span>
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
                  placeholder="e.g. Alex Johnson"
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
                        className="p-1 focus:outline-none transition-transform hover:scale-115 active:scale-95 cursor-pointer"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Predefined Review Suggestions */}
              <div>
                <label className="block font-mono-tech text-xs font-bold uppercase tracking-wider text-[#191c1b] mb-2">
                  Predefined Suggestions <span className="text-neutral-400 font-normal">(Tap to add or customize)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_SUGGESTIONS.map((suggestion) => {
                    const isSelected = selectedSuggestion === suggestion;
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className={`text-left text-xs font-display-tech px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-black text-[#c8f179] border-black font-semibold'
                            : 'bg-white hover:bg-neutral-100 text-neutral-700 border-[#c4c7c7]'
                        }`}
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Written Review */}
              <div>
                <label className="block font-mono-tech text-xs font-bold uppercase tracking-wider text-[#191c1b] mb-2">
                  Your Review <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details of your collaboration with Zen Tech Solutions..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c7c7] bg-[#f9faf7] text-[#191c1b] placeholder-neutral-400 font-display-tech text-sm focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                />
                <div className="flex justify-between items-center mt-1 text-[11px] font-mono-tech text-neutral-400">
                  <span>Minimum 10 characters</span>
                  <span>{reviewText.length}/1000</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#c8f179] hover:bg-[#bbf060] text-[#191c1b] font-mono-tech text-xs font-bold py-3.5 px-6 rounded-xl border border-[#a8df48] transition-all duration-200 shadow-xs hover:shadow-[0_0_20px_rgba(200,241,121,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>SUBMITTING REVIEW...</span>
                    </>
                  ) : (
                    <span>SUBMIT REVIEW</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
