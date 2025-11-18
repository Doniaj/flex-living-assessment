import axios from 'axios';

const OUTSCRAPER_API_KEY = process.env.OUTSCRAPER_API_KEY;
const OUTSCRAPER_API_URL = 'https://api.app.outscraper.com/maps/reviews-v3';


const propertySearchQueries = {
    '2b-n1-a-29-shoreditch-heights': 'Shoreditch Heights, 29 Shoreditch High Street, London',
    '1b-w2-c-westminster-tower': 'Westminster Tower, Westminster Bridge Road, London',
    'studio-ec1-b-angel-loft': 'Angel Loft, Islington High Street, London',
    '3b-sw1-a-chelsea-garden-flat': 'Chelsea Garden Flat, Kings Road, London'
};


export async function fetchGoogleReviewsViaOutscraper(propertyQuery) {
    if (!OUTSCRAPER_API_KEY) {
        console.log('⚠️  OUTSCRAPER_API_KEY not set → returning mock Google reviews');
        return getMockGoogleReviews(propertyQuery);
    }

    try {
        console.log(`🔍 Fetching Google reviews for: ${propertyQuery}`);
        const searchQuery = propertySearchQueries[propertyQuery] || `${propertyQuery}, London, UK`;

        const response = await axios.get(OUTSCRAPER_API_URL, {
            params: {
                query: searchQuery,
                reviewsLimit: 10,
                language: 'en',
                async: false
            },
            headers: {
                'X-API-KEY': OUTSCRAPER_API_KEY
            },
            timeout: 30000 // 30 second timeout
        });

        const placeData = response.data?.data?.[0];

        if (!placeData) {
            console.log('ℹ️  No Google place data found for query');
            return getMockGoogleReviews(propertyQuery);
        }

        const reviews = placeData.reviews_data || [];
        console.log(`✅ Fetched ${reviews.length} Google reviews`);

        return reviews.map(review => normalizeOutscraperReview(review, placeData, propertyQuery));

    } catch (error) {
        console.error('❌ Outscraper API error:', error.response?.data || error.message);
        return getMockGoogleReviews(propertyQuery);
    }
}

function normalizeOutscraperReview(review, placeData, propertyQuery) {
    const rating = review.review_rating ? review.review_rating * 2 : 0;

    return {
        id: `google_${review.review_id || Date.now()}_${Math.random()}`,
        type: 'guest-to-host',
        status: 'published',
        rating: rating,
        overallRating: rating,
        publicReview: review.review_text || 'No review text provided',
        reviewCategory: [
            {
                category: 'overall',
                rating: rating
            }
        ],
        submittedAt: review.review_datetime_utc || new Date().toISOString(),
        guestName: review.author_title || 'Google User',
        listingName: placeData.name || propertyQuery,
        listingId: propertyQuery,
        channel: 'Google',
        source: 'google',
        approved: false,
        relativeTime: review.review_timestamp || '',
        profilePhoto: review.author_image || null,
        reviewLink: review.review_link || null,
        likes: review.review_likes || 0
    };
}

function getMockGoogleReviews(propertyQuery) {
    const mockReviews = [
        {
            id: 'google_mock_1',
            type: 'guest-to-host',
            status: 'published',
            rating: 9.0,
            overallRating: 9.0,
            publicReview: 'Great location in the heart of London. Clean and modern apartment with excellent amenities. Host was very responsive and helpful throughout our stay.',
            reviewCategory: [{ category: 'overall', rating: 9.0 }],
            submittedAt: '2024-11-10T14:30:00Z',
            guestName: 'John Smith',
            listingName: propertyQuery,
            listingId: propertyQuery,
            channel: 'Google',
            source: 'google',
            approved: false,
            relativeTime: '1 week ago',
            profilePhoto: null
        },
        {
            id: 'google_mock_2',
            type: 'guest-to-host',
            status: 'published',
            rating: 8.0,
            overallRating: 8.0,
            publicReview: 'Nice property with good transport links. The apartment was as described in the photos. Would recommend for business travelers.',
            reviewCategory: [{ category: 'overall', rating: 8.0 }],
            submittedAt: '2024-11-05T10:15:00Z',
            guestName: 'Emma Wilson',
            listingName: propertyQuery,
            listingId: propertyQuery,
            channel: 'Google',
            source: 'google',
            approved: false,
            relativeTime: '2 weeks ago',
            profilePhoto: null
        },
        {
            id: 'google_mock_3',
            type: 'guest-to-host',
            status: 'published',
            rating: 10.0,
            overallRating: 10.0,
            publicReview: 'Outstanding experience! The property exceeded our expectations. Modern, clean, and perfectly located. Will definitely book again.',
            reviewCategory: [{ category: 'overall', rating: 10.0 }],
            submittedAt: '2024-10-28T16:45:00Z',
            guestName: 'David Chen',
            listingName: propertyQuery,
            listingId: propertyQuery,
            channel: 'Google',
            source: 'google',
            approved: false,
            relativeTime: '3 weeks ago',
            profilePhoto: null
        }
    ];

    return mockReviews;
}

export function isOutscraperEnabled() {
    return !!OUTSCRAPER_API_KEY;
}

export async function getOutscraperStatus() {
    if (!OUTSCRAPER_API_KEY) {
        return {
            enabled: false,
            message: 'Outscraper API key not configured'
        };
    }

    try {
        await axios.get('https://api.app.outscraper.com/profile', {
            headers: {
                'X-API-KEY': OUTSCRAPER_API_KEY
            }
        });

        return {
            enabled: true,
            message: 'Outscraper API connected successfully'
        };
    } catch (error) {
        return {
            enabled: false,
            message: `Outscraper API error: ${error.message}`
        };
    }
}