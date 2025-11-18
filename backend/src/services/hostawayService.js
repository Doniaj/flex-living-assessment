import axios from 'axios';
import { mockReviews } from '../utils/mockData.js';
import { normalizeHostawayReview } from '../utils/normalizeReviews.js';

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';
const ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID;
const API_KEY = process.env.HOSTAWAY_API_KEY;

let reviewsDatabase = [];


export async function fetchHostawayReviews() {
    try {
        const response = await axios.get(`${HOSTAWAY_API_URL}/reviews`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            params: {
                accountId: ACCOUNT_ID
            },
            timeout: 5000
        });

        if (response.data?.result?.length > 0) {
            console.log(`✅ Fetched ${response.data.result.length} reviews from Hostaway API`);
            reviewsDatabase = response.data.result.map(normalizeHostawayReview);
            return reviewsDatabase;
        }

        console.log('ℹ️  Hostaway API returned no reviews');
    } catch (error) {
        console.log('⚠️  Hostaway API error, using mock data:', error.message);
    }

    if (reviewsDatabase.length === 0) {
        console.log(`📦 Using ${mockReviews.length} mock reviews`);
        reviewsDatabase = mockReviews.map(normalizeHostawayReview);
    }

    return reviewsDatabase;
}


export async function getReviewsByListing(listingId) {
    const allReviews = await fetchHostawayReviews();
    return allReviews.filter(review => review.listingId === listingId);
}

export async function updateReviewApproval(reviewId, approved) {
    const allReviews = await fetchHostawayReviews();
    const review = allReviews.find(r => r.id === parseInt(reviewId));

    if (!review) {
        throw new Error(`Review with ID ${reviewId} not found`);
    }

    review.approved = approved;
    review.approvedAt = approved ? new Date().toISOString() : null;

    console.log(`${approved ? '✅ Approved' : '❌ Disapproved'} review ${reviewId}`);

    return review;
}

export async function batchUpdateApproval(reviewIds, approved) {
    const allReviews = await fetchHostawayReviews();
    const updatedReviews = [];

    for (const reviewId of reviewIds) {
        const review = allReviews.find(r => r.id === parseInt(reviewId));
        if (review) {
            review.approved = approved;
            review.approvedAt = approved ? new Date().toISOString() : null;
            updatedReviews.push(review);
        }
    }

    console.log(`📝 Batch updated ${updatedReviews.length} reviews`);

    return updatedReviews;
}

export async function getApprovedReviews(listingId = null) {
    const allReviews = await fetchHostawayReviews();
    let approved = allReviews.filter(review => review.approved === true);

    if (listingId) {
        approved = approved.filter(review => review.listingId === listingId);
    }

    return approved;
}

export async function getFilteredReviews(filters = {}) {
    const allReviews = await fetchHostawayReviews();
    let filtered = [...allReviews];

    if (filters.listingId) {
        filtered = filtered.filter(r => r.listingId === filters.listingId);
    }

    if (filters.minRating) {
        filtered = filtered.filter(r => r.overallRating >= filters.minRating);
    }

    if (filters.channel) {
        filtered = filtered.filter(r => r.channel === filters.channel);
    }

    if (filters.approved !== undefined) {
        filtered = filtered.filter(r => r.approved === filters.approved);
    }

    if (filters.startDate) {
        filtered = filtered.filter(r => new Date(r.submittedAt) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
        filtered = filtered.filter(r => new Date(r.submittedAt) <= new Date(filters.endDate));
    }

    if (filters.sortBy) {
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'date':
                    return new Date(b.submittedAt) - new Date(a.submittedAt);
                case 'rating':
                    return b.overallRating - a.overallRating;
                case 'property':
                    return a.listingName.localeCompare(b.listingName);
                default:
                    return 0;
            }
        });
    }

    return filtered;
}

export async function getReviewStatistics(listingId = null) {
    const reviews = listingId
        ? await getReviewsByListing(listingId)
        : await fetchHostawayReviews();

    if (reviews.length === 0) {
        return {
            total: 0,
            approved: 0,
            pending: 0,
            averageRating: 0,
            categoryAverages: {},
            channelBreakdown: {}
        };
    }

    const approved = reviews.filter(r => r.approved).length;
    const pending = reviews.length - approved;

    const averageRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;

    const categoryRatings = {};
    reviews.forEach(review => {
        review.reviewCategory.forEach(cat => {
            if (!categoryRatings[cat.category]) {
                categoryRatings[cat.category] = [];
            }
            categoryRatings[cat.category].push(cat.rating);
        });
    });

    const categoryAverages = {};
    Object.keys(categoryRatings).forEach(category => {
        const ratings = categoryRatings[category];
        categoryAverages[category] = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    });

    const channelBreakdown = {};
    reviews.forEach(review => {
        channelBreakdown[review.channel] = (channelBreakdown[review.channel] || 0) + 1;
    });

    return {
        total: reviews.length,
        approved,
        pending,
        averageRating: parseFloat(averageRating.toFixed(1)),
        categoryAverages,
        channelBreakdown
    };
}

export function clearReviews() {
    reviewsDatabase = [];
    console.log('🗑️  All reviews cleared');
}