import axios from 'axios';
import { mockGoogleReviews } from '../utils/mockData.js';

const API_KEY = process.env.OUTSCRAPER_API_KEY;

export async function fetchGoogleReviewsViaOutscraper(propertyQuery) {
    if (!API_KEY) {
        console.log('OUTSCRAPER_API_KEY not set → returning mock Google reviews');
        return mockGoogleReviews.filter(r =>
            r.listingName.toLowerCase().includes(propertyQuery.toLowerCase())
        );
    }

    try {
        const response = await axios.post(
            'https://api.outscraper.com/google/reviews',
            {
                query: `${propertyQuery}, London, UK`, // improve matching
                reviewsLimit: 10,
                languageCode: 'en',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': API_KEY,
                },
            }
        );

        const placeData = response.data[0]; // Outscraper returns array
        const reviews = placeData?.reviews || [];

        return reviews.map(review => ({
            id: `google_${review.reviewId || Date.now()}`,
            type: 'guest',
            status: 'published',
            rating: Math.round((review.stars || 0) * 2), // 1-5 → 1-10
            publicReview: review.text || '',
            reviewCategory: [],
            submittedAt: review.time ? new Date(review.time).toISOString() : new Date().toISOString(),
            guestName: review.authorTitle || 'Anonymous',
            listingName: placeData.name || propertyQuery,
            source: 'google',
            relativeTime: review.timeAgo || '',
            profilePhoto: review.authorImage || '',
        }));
    } catch (error) {
        console.error('Outscraper error:', error.response?.data || error.message);
        return [];
    }
}