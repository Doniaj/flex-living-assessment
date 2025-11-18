import React from 'react';
import { Star, CheckCircle, Eye, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';

const ReviewCard = ({ review, onToggleApproval }) => {
    const getBadgeStyle = () => {
        if (review.source === 'google') {
            return 'bg-red-100 text-red-700';
        }
        if (review.channel === 'Airbnb') {
            return 'bg-pink-100 text-pink-700';
        }
        if (review.channel === 'Booking.com') {
            return 'bg-blue-100 text-blue-700';
        }
        return 'bg-gray-100 text-gray-700';
    };
    const getSourceLabel = () => {
        if (review.source === 'google') return 'Google';
        return review.channel || 'Hostaway';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    {/* Source Badge and Rating */}
                    <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle()}`}>
              {getSourceLabel()}
            </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">
                {typeof review.overallRating === 'number'
                    ? review.overallRating.toFixed(1)
                    : review.rating?.toFixed(1) || 'N/A'}
              </span>
                        </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {review.guestName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{review.listingName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            {formatDate(review.submittedAt)}
                        </div>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                        {review.publicReview || 'No review text provided'}
                    </p>
                    {review.reviewCategory && review.reviewCategory.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {review.reviewCategory.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                                >
                  {cat.category.replace(/_/g, ' ')}: {cat.rating}/10
                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => onToggleApproval(review.id)}
                    className={`ml-4 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 flex-shrink-0 ${
                        review.approved
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {review.approved ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Approved
                        </>
                    ) : (
                        <>
                            <Eye className="w-5 h-5" />
                            Approve
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;