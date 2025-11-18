import express from 'express';
import {
    fetchHostawayReviews,
    getReviewsByListing,
    updateReviewApproval,
    getApprovedReviews
} from '../services/hostawayService.js';
import { fetchGoogleReviewsViaOutscraper, isOutscraperEnabled } from '../services/outscraperService.js';

const router = express.Router();

router.get('/hostaway', async (req, res, next) => {
    try {
        const reviews = await fetchHostawayReviews();
        res.json({
            status: 'success',
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
});

router.get('/hostaway/:listingId', async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const reviews = await getReviewsByListing(listingId);
        res.json({
            status: 'success',
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
});

router.get('/google', async (req, res, next) => {
    try {
        const { property } = req.query;

        if (!property) {
            return res.status(400).json({
                status: 'error',
                message: 'Property query parameter is required'
            });
        }

        const reviews = await fetchGoogleReviewsViaOutscraper(property);

        res.json({
            status: 'success',
            count: reviews.length,
            data: reviews,
            source: 'outscraper',
            apiEnabled: isOutscraperEnabled()
        });
    } catch (error) {
        next(error);
    }
});

router.get('/combined/:listingId', async (req, res, next) => {
    try {
        const { listingId } = req.params;

        const [hostawayReviews, googleReviews] = await Promise.all([
            getReviewsByListing(listingId),
            fetchGoogleReviewsViaOutscraper(listingId)
        ]);

        const allReviews = [...hostawayReviews, ...googleReviews];

        allReviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        res.json({
            status: 'success',
            count: allReviews.length,
            data: allReviews,
            sources: {
                hostaway: hostawayReviews.length,
                google: googleReviews.length
            }
        });
    } catch (error) {
        next(error);
    }
});

router.post('/approve', async (req, res, next) => {
    try {
        const { reviewId, approved } = req.body;

        if (!reviewId || typeof approved !== 'boolean') {
            return res.status(400).json({
                status: 'error',
                message: 'reviewId and approved (boolean) are required'
            });
        }

        const updatedReview = await updateReviewApproval(reviewId, approved);
        res.json({
            status: 'success',
            data: updatedReview
        });
    } catch (error) {
        next(error);
    }
});

router.get('/public/:listingId', async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const { includeGoogle } = req.query;
        let approvedReviews = await getApprovedReviews(listingId);

        if (includeGoogle === 'true') {
            const googleReviews = await fetchGoogleReviewsViaOutscraper(listingId);
            const approvedGoogleReviews = googleReviews.filter(r => r.approved);
            approvedReviews = [...approvedReviews, ...approvedGoogleReviews];
        }

        res.json({
            status: 'success',
            count: approvedReviews.length,
            data: approvedReviews
        });
    } catch (error) {
        next(error);
    }
});

router.get('/analytics', async (req, res, next) => {
    try {
        const allReviews = await fetchHostawayReviews();

        const totalReviews = allReviews.length;
        const approvedReviews = allReviews.filter(r => r.approved).length;
        const categoryRatings = {};
        allReviews.forEach(review => {
            review.reviewCategory.forEach(cat => {
                if (!categoryRatings[cat.category]) {
                    categoryRatings[cat.category] = [];
                }
                categoryRatings[cat.category].push(cat.rating);
            });
        });

        const avgRatings = {};
        Object.keys(categoryRatings).forEach(category => {
            const ratings = categoryRatings[category];
            avgRatings[category] = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        });
        const byProperty = {};
        allReviews.forEach(review => {
            if (!byProperty[review.listingName]) {
                byProperty[review.listingName] = 0;
            }
            byProperty[review.listingName]++;
        });
        const bySource = {};
        allReviews.forEach(review => {
            const source = review.source || review.channel || 'unknown';
            bySource[source] = (bySource[source] || 0) + 1;
        });

        res.json({
            status: 'success',
            data: {
                totalReviews,
                approvedReviews,
                avgRatings,
                byProperty,
                bySource
            }
        });
    } catch (error) {
        next(error);
    }
});
router.get('/status', async (req, res) => {
    res.json({
        status: 'success',
        integrations: {
            hostaway: {
                enabled: true,
                description: 'Hostaway API with mock fallback'
            },
            google: {
                enabled: isOutscraperEnabled(),
                description: isOutscraperEnabled()
                    ? 'Outscraper API configured'
                    : 'Outscraper API not configured (using mock data)'
            }
        }
    });
});

export default router;