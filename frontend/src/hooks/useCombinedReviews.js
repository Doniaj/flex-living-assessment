import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';
import { fetchGoogleReviews, getIntegrationStatus } from '../services/googleReviewsApi';

const useCombinedReviews = (includeGoogle = true) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [integrationStatus, setIntegrationStatus] = useState({});

    useEffect(() => {
        fetchAllReviews();
        fetchIntegrationStatus();
    }, [includeGoogle]);

    const fetchIntegrationStatus = async () => {
        try {
            const status = await getIntegrationStatus();
            setIntegrationStatus(status);
        } catch (err) {
            console.error('Failed to fetch integration status:', err);
        }
    };

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const hostawayResponse = await reviewsApi.getAll();
            const hostawayReviews = hostawayResponse.data.data || [];

            let allReviews = [...hostawayReviews];
            if (includeGoogle) {
                const uniqueProperties = [...new Set(hostawayReviews.map(r => r.listingId))];

                const googleReviewsPromises = uniqueProperties.map(async (listingId) => {
                    try {
                        return await fetchGoogleReviews(listingId);
                    } catch (err) {
                        console.error(`Failed to fetch Google reviews for ${listingId}:`, err);
                        return [];
                    }
                });

                const googleReviewsArrays = await Promise.all(googleReviewsPromises);
                const googleReviews = googleReviewsArrays.flat();

                allReviews = [...hostawayReviews, ...googleReviews];

                console.log(`✅ Combined reviews: ${hostawayReviews.length} Hostaway + ${googleReviews.length} Google`);
            }
            allReviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

            setReviews(allReviews);

        } catch (err) {
            console.error('❌ Error fetching reviews:', err);
            setError(err.message);
            setReviews(getMockReviews());
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (reviewId) => {
        try {
            const review = reviews.find(r => r.id === reviewId);
            if (!review) return;

            const newApprovalStatus = !review.approved;
            setReviews(reviews.map(r =>
                r.id === reviewId ? { ...r, approved: newApprovalStatus } : r
            ));
            if (review.source !== 'google') {
                await reviewsApi.approve(reviewId, newApprovalStatus);
            }

            console.log(`✅ Review ${reviewId} ${newApprovalStatus ? 'approved' : 'disapproved'}`);
        } catch (err) {
            console.error('❌ Error updating approval:', err);
            fetchAllReviews();
        }
    };

    const getMockReviews = () => {
        return [
            {
                id: 'mock_1',
                overallRating: 9.5,
                publicReview: "Amazing property! The location was perfect.",
                guestName: "Sarah Martinez",
                listingName: "2B N1 A - 29 Shoreditch Heights",
                channel: "Airbnb",
                submittedAt: "2024-11-15 14:30:22",
                approved: false,
                reviewCategory: [
                    { category: "cleanliness", rating: 10 },
                    { category: "communication", rating: 9 }
                ]
            }
        ];
    };

    return {
        reviews,
        loading,
        error,
        toggleApproval,
        refetch: fetchAllReviews,
        integrationStatus
    };
};

export default useCombinedReviews;