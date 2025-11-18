import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropertyDetails from '../components/public/PropertyDetails';
import ReviewsSection from '../components/public/ReviewsSection';
import Loader from '../components/common/Loader';
import { reviewsApi, propertiesApi } from '../services/api';

const PropertyPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [propRes, revRes] = await Promise.all([
                    propertiesApi.getById(id),
                    reviewsApi.getPublic(id)
                ]);

                const baseProperty = propRes.data.data;
                const approvedReviews = revRes.data.data || [];

                // RECALCULATE RATING & COUNT BASED ON APPROVED REVIEWS ONLY
                const totalApproved = approvedReviews.length;
                const avgRating = totalApproved > 0
                    ? (approvedReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalApproved).toFixed(1)
                    : 0;

                setProperty({
                    ...baseProperty,
                    rating: parseFloat(avgRating) || 0,
                    totalReviews: totalApproved
                });

                setReviews(approvedReviews);
            } catch (err) {
                console.error(err);
                const mock = getMockProperty();
                setProperty(mock);
                setReviews(getMockReviews());
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const getMockProperty = () => ({
        id,
        name: "2B N1 A - 29 Shoreditch Heights",
        location: "Shoreditch, London",
        price: 175,
        bedrooms: 2,
        guests: 4,
        rating: 9.5,     // ← This will be recalculated from approved reviews
        totalReviews: 1, // ← Only approved count
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200"
        ],
        description: "Modern 2-bedroom apartment in the heart of Shoreditch. Perfect for business or leisure.",
        amenities: ["WiFi", "Workspace", "Smart TV", "Air Conditioning", "Self Check-in"]
    });

    const getMockReviews = () => [
        {
            id: 7453,
            overallRating: 9.5,
            publicReview: "Amazing property! The location was perfect, right in the heart of Shoreditch.",
            guestName: "Sarah M.",
            submittedAt: "2024-11-15",
            approved: true,
            reviewCategory: [{ category: "cleanliness", rating: 10 }]
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF9E9] flex items-center justify-center">
                <Loader text="Loading property..." size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF9E9]">
            <PropertyDetails property={property} />
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-white rounded-3xl shadow-2xl p-12">
                    <ReviewsSection reviews={reviews} rating={property.rating} />
                </div>
            </div>
        </div>
    );
};

export default PropertyPage;