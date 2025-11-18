export function calculateOverallRating(categories) {
    if (!categories || categories.length === 0) return null;

    const sum = categories.reduce((acc, cat) => {
        return acc + (typeof cat.rating === 'number' ? cat.rating : 0);
    }, 0);

    return parseFloat((sum / categories.length).toFixed(1));
}

export function extractListingId(listingName) {
    if (!listingName) return 'unknown';

    return listingName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function normalizeDateFormat(date) {
    if (!date) return new Date().toISOString();

    try {
        const dateObj = new Date(date);
        return dateObj.toISOString();
    } catch (error) {
        console.error('Error normalizing date:', error);
        return new Date().toISOString();
    }
}

export function normalizeHostawayReview(review) {
    const overallRating = review.rating || calculateOverallRating(review.reviewCategory);

    return {
        id: review.id,
        type: review.type || 'guest-to-host',
        status: review.status || 'published',
        overallRating: overallRating,
        rating: overallRating,
        publicReview: review.publicReview || '',
        privateReview: review.privateReview || null,
        reviewCategory: review.reviewCategory || [],
        submittedAt: normalizeDateFormat(review.submittedAt),
        guestName: review.guestName || 'Anonymous',
        listingName: review.listingName || 'Unknown Property',
        listingId: extractListingId(review.listingName),
        channel: review.channel || 'Hostaway',
        approved: review.approved || false,
        createdAt: normalizeDateFormat(review.submittedAt),
        source: 'hostaway'
    };
}

export function normalizeGoogleReview(review, listingId = 'unknown') {
    return {
        id: `google-${review.time || Date.now()}`,
        type: 'guest-to-host',
        status: 'published',
        overallRating: review.rating || 0,
        rating: review.rating || 0,
        publicReview: review.text || '',
        privateReview: null,
        reviewCategory: [
            {
                category: 'overall',
                rating: review.rating || 0
            }
        ],
        submittedAt: normalizeDateFormat(review.time ? new Date(review.time * 1000) : new Date()),
        guestName: review.author_name || 'Google User',
        listingName: listingId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        listingId: listingId,
        channel: 'Google',
        approved: false,
        createdAt: normalizeDateFormat(review.time ? new Date(review.time * 1000) : new Date()),
        source: 'google',
        profilePhotoUrl: review.profile_photo_url || null,
        relativeTimeDescription: review.relative_time_description || null
    };
}

export function normalizeAirbnbReview(review) {
    // Airbnb-specific normalization
    const categories = [];

    if (review.cleanliness_rating) {
        categories.push({ category: 'cleanliness', rating: review.cleanliness_rating });
    }
    if (review.communication_rating) {
        categories.push({ category: 'communication', rating: review.communication_rating });
    }
    if (review.checkin_rating) {
        categories.push({ category: 'check_in', rating: review.checkin_rating });
    }
    if (review.accuracy_rating) {
        categories.push({ category: 'accuracy', rating: review.accuracy_rating });
    }
    if (review.location_rating) {
        categories.push({ category: 'location', rating: review.location_rating });
    }
    if (review.value_rating) {
        categories.push({ category: 'value', rating: review.value_rating });
    }

    return {
        id: `airbnb-${review.id}`,
        type: 'guest-to-host',
        status: 'published',
        overallRating: review.rating || calculateOverallRating(categories),
        rating: review.rating || calculateOverallRating(categories),
        publicReview: review.comments || '',
        privateReview: review.private_feedback || null,
        reviewCategory: categories,
        submittedAt: normalizeDateFormat(review.created_at),
        guestName: review.reviewer_name || 'Airbnb Guest',
        listingName: review.listing_name || 'Unknown Property',
        listingId: extractListingId(review.listing_name),
        channel: 'Airbnb',
        approved: false,
        createdAt: normalizeDateFormat(review.created_at),
        source: 'airbnb'
    };
}

export function normalizeBookingReview(review) {
    return {
        id: `booking-${review.id}`,
        type: 'guest-to-host',
        status: 'published',
        overallRating: review.average_score || review.score || 0,
        rating: review.average_score || review.score || 0,
        publicReview: [review.positive, review.negative].filter(Boolean).join(' '),
        privateReview: null,
        reviewCategory: [
            { category: 'overall', rating: review.average_score || review.score || 0 }
        ],
        submittedAt: normalizeDateFormat(review.date),
        guestName: review.guest_name || 'Booking.com Guest',
        listingName: review.property_name || 'Unknown Property',
        listingId: extractListingId(review.property_name),
        channel: 'Booking.com',
        approved: false,
        createdAt: normalizeDateFormat(review.date),
        source: 'booking',
        positiveComment: review.positive || null,
        negativeComment: review.negative || null
    };
}

export function normalizeReview(review, source = null) {
    if (!source) {
        if (review.author_name && review.time) {
            source = 'google';
        } else if (review.reviewer_name || review.cleanliness_rating) {
            source = 'airbnb';
        } else if (review.positive || review.negative) {
            source = 'booking';
        } else {
            source = 'hostaway';
        }
    }

    switch (source.toLowerCase()) {
        case 'google':
            return normalizeGoogleReview(review);
        case 'airbnb':
            return normalizeAirbnbReview(review);
        case 'booking':
        case 'booking.com':
            return normalizeBookingReview(review);
        case 'hostaway':
        default:
            return normalizeHostawayReview(review);
    }
}

export function normalizeReviews(reviews, source = null) {
    if (!Array.isArray(reviews)) {
        console.error('normalizeReviews expects an array');
        return [];
    }

    return reviews.map(review => normalizeReview(review, source));
}

export function isValidReview(review) {
    const requiredFields = [
        'id',
        'overallRating',
        'publicReview',
        'submittedAt',
        'guestName',
        'listingId',
        'channel'
    ];

    return requiredFields.every(field => {
        const value = review[field];
        return value !== null && value !== undefined && value !== '';
    });
}


export function filterValidReviews(reviews) {
    return reviews.filter(review => {
        const valid = isValidReview(review);
        if (!valid) {
            console.warn('Invalid review filtered out:', review.id);
        }
        return valid;
    });
}