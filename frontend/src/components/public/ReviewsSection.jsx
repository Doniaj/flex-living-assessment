import React from 'react';
import { Star } from 'lucide-react';
import StarRating from '../common/StarRating';
import { formatDate } from '../../utils/dateHelpers';

const ReviewsSection = ({ reviews, rating }) => {
    const approvedReviews = reviews.filter(r => r.approved !== false);

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 lg:mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#284D4B]">Guest Reviews</h2>

                <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-yellow-400 text-yellow-400" />
                    <span className="text-3xl sm:text-4xl font-bold text-[#284D4B]">{rating || '—'}</span>
                    <span className="text-lg sm:text-xl text-gray-600">
            ({approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''})
          </span>
                </div>
            </div>

            {approvedReviews.length > 0 ? (
                <div className="space-y-10 lg:space-y-12">
                    {approvedReviews.map((review) => (
                        <article
                            key={review.id}
                            className="border-b border-gray-200 pb-10 last:border-0 last:pb-0"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {review.guestName}
                                    </h3>
                                    <time className="text-sm sm:text-base text-gray-500">
                                        {formatDate(review.submittedAt, 'long')}
                                    </time>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl sm:text-3xl font-bold text-[#284D4B] mb-1">
                                        {review.overallRating}
                                    </div>
                                    <StarRating rating={review.overallRating} size="lg" />
                                </div>
                            </div>

                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4">
                                {review.publicReview}
                            </p>

                            {review.reviewCategory && review.reviewCategory.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {review.reviewCategory.map((cat, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#284D4B]/10 text-[#284D4B] rounded-full text-xs sm:text-sm font-medium"
                                        >
                      {cat.category.replace(/_/g, ' ')}: {cat.rating}/10
                    </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl sm:text-2xl">No reviews yet.</p>
                    <p className="mt-3 text-base sm:text-lg">Be the first to review this property!</p>
                </div>
            )}
        </div>
    );
};

export default ReviewsSection;