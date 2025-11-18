import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';

const useReviews = (source = 'hostaway', propertyName = null) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            let data = [];

            if (source === 'google' && propertyName) {
                const res = await reviewsApi.getGoogle(propertyName);
                data = res.data.result || [];
                console.log('Fetched Google Reviews:', data.length);
            } else {
                const res = await reviewsApi.getAll();
                data = res.data.data || res.data.result || [];
                console.log('Fetched Hostaway Reviews:', data.length);
            }

            setReviews(data.map(r => ({
                ...r,
                source: source === 'google' ? 'google' : 'hostaway',
                channel: r.channel || (source === 'google' ? 'Google' : r.channel || 'Unknown')
            })));
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setReviews(getMockReviews(source));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [source, propertyName]);


    const toggleApproval = async (reviewId) => {
        try {
            const review = reviews.find(r => r.id === reviewId);
            if (!review) return;

            const newApprovalStatus = !review.approved;
            setReviews(reviews.map(r =>
                r.id === reviewId ? { ...r, approved: newApprovalStatus } : r
            ));
            await reviewsApi.approve(reviewId, newApprovalStatus);

            console.log(`✅ Review ${reviewId} ${newApprovalStatus ? 'approved' : 'disapproved'}`);
        } catch (err) {
            console.error('❌ Error updating approval:', err);
            fetchReviews();
        }
    };

    const getMockReviews = () => {
        return [
            {
                id: 7453,
                overallRating: 9.5,
                publicReview: "Amazing property! The location was perfect, right in the heart of Shoreditch. Modern amenities and spotlessly clean.",
                guestName: "Sarah Martinez",
                listingName: "2B N1 A - 29 Shoreditch Heights",
                channel: "Airbnb",
                submittedAt: "2024-11-15 14:30:22",
                approved: false,
                reviewCategory: [
                    { category: "cleanliness", rating: 10 },
                    { category: "communication", rating: 9 },
                    { category: "location", rating: 10 }
                ]
            },
            {
                id: 7454,
                overallRating: 8.8,
                publicReview: "Great stay overall. The apartment was as described and check-in was seamless.",
                guestName: "Michael Chen",
                listingName: "1B W2 C - Westminster Tower",
                channel: "Booking.com",
                submittedAt: "2024-11-14 09:15:11",
                approved: true,
                reviewCategory: [
                    { category: "cleanliness", rating: 9 },
                    { category: "check_in", rating: 10 }
                ]
            },
            {
                id: 7455,
                overallRating: 10,
                publicReview: "Exceptional experience from start to finish! The property manager was incredibly responsive.",
                guestName: "Emily Johnson",
                listingName: "Studio EC1 B - Angel Loft",
                channel: "Airbnb",
                submittedAt: "2024-11-13 18:45:33",
                approved: true,
                reviewCategory: [
                    { category: "cleanliness", rating: 10 },
                    { category: "communication", rating: 10 }
                ]
            }
        ];
    };

    return {
        reviews,
        loading,
        error,
        toggleApproval,
        refetch: fetchReviews
    };
};

export default useReviews;