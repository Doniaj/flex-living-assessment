import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, maxStars = 5, size = 'sm' }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const starSize = sizeClasses[size] || sizeClasses.sm;
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star
                key={`full-${i}`}
                className={`${starSize} fill-yellow-400 text-yellow-400`}
            />
        );
    }
    if (hasHalfStar && stars.length < maxStars) {
        stars.push(
            <Star
                key="half"
                className={`${starSize} fill-yellow-200 text-yellow-400`}
            />
        );
    }
    const emptyStars = maxStars - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <Star
                key={`empty-${i}`}
                className={`${starSize} text-gray-300`}
            />
        );
    }

    return (
        <div className="flex gap-1 items-center">
            {stars}
        </div>
    );
};

export default StarRating;