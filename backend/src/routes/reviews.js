import express from 'express';
import {
    fetchHostawayReviews,
    getReviewsByListing,
    updateReviewApproval,
    getApprovedReviews
} from '../services/hostawayService.js';
import {fetchGoogleReviewsViaOutscraper} from "../services/outscraperService.js";

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
        const approvedReviews = await getApprovedReviews(listingId);
        res.json({
            status: 'success',
            count: approvedReviews.length,
            data: approvedReviews
        });
    } catch (error) {
        next(error);
    }
});

router.get('/google', async (req, res) => {
    try {
        const { property } = req.query;
        if (!property) return res.status(400).json({ error: 'Property query required' });
        const reviews = await fetchGoogleReviewsViaOutscraper(property);
        const normalized = normalizeReviews(reviews); // Your utils function
        res.json({ status: 'success', result: normalized });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        res.json({
            status: 'success',
            data: {
                totalReviews,
                approvedReviews,
                avgRatings,
                byProperty
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;