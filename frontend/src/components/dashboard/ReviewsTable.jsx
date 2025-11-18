import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewsTable = ({ reviews, onToggleApproval, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">No reviews match your filters</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map(review => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    onToggleApproval={onToggleApproval}
                />
            ))}
        </div>
    );
};

export default ReviewsTable;