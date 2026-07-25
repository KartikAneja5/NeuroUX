import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiCheckCircle, FiMessageSquare, FiSend, FiUser, FiAward } from 'react-icons/fi';
import { getProductReviews, submitProductReview } from '../../api/reviewApi';

export default function ProductReviewsSection({ productId, onReviewSubmitted }) {
  const [reviewsData, setReviewsData] = useState({ averageRating: 5.0, numReviews: 0, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await getProductReviews(productId);
      setReviewsData(res.data);
    } catch (err) {
      console.error('Failed to load product reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await submitProductReview(productId, {
        rating: ratingInput,
        comment: commentInput
      });

      setSuccessMsg('Thank you! Your rating and review have been published.');
      setCommentInput('');
      fetchReviews();

      if (onReviewSubmitted) {
        onReviewSubmitted(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review. Please log in first.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const { averageRating = 5.0, numReviews = 0, reviews = [] } = reviewsData;

  // Rating percentage bars calculation
  const getRatingCount = (star) => reviews.filter(r => Math.round(r.rating) === star).length;

  return (
    <div className="mt-16 pt-12 border-t border-white/10 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <FiMessageSquare size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Customer Reviews</h2>
          <p className="text-xs text-[#8b7fb5]">Verified community feedback and feature ratings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rating Overview Summary Box */}
        <div className="glass p-6 rounded-3xl border border-white/8 flex flex-col justify-between space-y-6">
          <div className="text-center py-2">
            <div className="text-5xl font-black text-white tracking-tight mb-2">
              {Number(averageRating).toFixed(1)}
            </div>
            <div className="flex justify-center items-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={18}
                  className={star <= Math.round(averageRating) ? "text-amber-400 fill-amber-400" : "text-zinc-600"}
                />
              ))}
            </div>
            <p className="text-xs text-[#8b7fb5]">
              Based on <span className="text-white font-semibold">{numReviews}</span> verified {numReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Breakdown Progress Bars */}
          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = getRatingCount(star);
              const percentage = numReviews > 0 ? (count / numReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-zinc-400">
                  <span className="w-3 text-right font-medium">{star}</span>
                  <FiStar size={11} className="text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[10px] text-zinc-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Submission Form & Review Feed */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Write a Review Box */}
          <form onSubmit={handleSubmit} className="glass p-6 rounded-3xl border border-white/8 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FiAward className="text-fuchsia-400" /> Write a Component Review
            </h3>

            {/* Star Selector */}
            <div>
              <label className="block text-xs text-[#8b7fb5] mb-2 font-medium">Select Rating:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition transform active:scale-95 hover:scale-110 focus:outline-none"
                  >
                    <FiStar
                      size={24}
                      className={
                        star <= (hoverRating || ratingInput)
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          : "text-zinc-600"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-amber-400 ml-2">
                  {hoverRating || ratingInput} / 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs text-[#8b7fb5] mb-2 font-medium">Detailed Feedback (Optional):</label>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="How was the UI design, code structure, and responsive performance?"
                rows={3}
                className="w-full bg-[#0d0c1d] text-white text-xs rounded-2xl border border-white/10 p-3.5 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none placeholder:text-zinc-600"
              />
            </div>

            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
            {successMsg && <p className="text-xs text-emerald-400">{successMsg}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50 shadow-glow-sm"
            >
              <FiSend size={13} />
              {submitting ? 'Publishing...' : 'Submit Review'}
            </button>
          </form>

          {/* List of Reviews */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-zinc-500 py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 glass rounded-2xl border border-white/5 text-xs text-[#8b7fb5]">
                Be the first to leave a review for this component!
              </div>
            ) : (
              <AnimatePresence>
                {reviews.map((rev) => (
                  <motion.div
                    key={rev._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-5 rounded-2xl border border-white/8 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xs">
                          {rev.userId?.name ? rev.userId.name.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {rev.userId?.name || 'Anonymous User'}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      {rev.isVerifiedPurchase && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                          <FiCheckCircle size={11} /> Verified Buyer
                        </div>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={13}
                          className={star <= rev.rating ? "text-amber-400 fill-amber-400" : "text-zinc-600"}
                        />
                      ))}
                    </div>

                    {/* Comment text */}
                    {rev.comment && (
                      <p className="text-xs text-zinc-300 leading-relaxed font-light pt-1">
                        "{rev.comment}"
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
