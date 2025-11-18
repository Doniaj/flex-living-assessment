import React, { useState } from 'react';
import Analytics from '../components/dashboard/Analytics';
import Filters from '../components/dashboard/Filters';
import ReviewsTable from '../components/dashboard/ReviewsTable';
import useReviews from '../hooks/useReviews';

const Dashboard = () => {
    const { reviews, loading, error, toggleApproval } = useReviews();
    const [filters, setFilters] = useState({
        property: 'all',
        rating: 'all',
        channel: 'all',
        status: 'all',
        sortBy: 'date'
    });

    const properties = [...new Set(reviews.map(r => r.listingName))];
    const channels = [...new Set(reviews.map(r => r.channel))];

    const getFilteredReviews = () => {
        let filtered = [...reviews];

        if (filters.property !== 'all') filtered = filtered.filter(r => r.listingName === filters.property);
        if (filters.rating !== 'all') {
            const threshold = parseFloat(filters.rating);
            filtered = filtered.filter(r => r.overallRating >= threshold);
        }
        if (filters.channel !== 'all') filtered = filtered.filter(r => r.channel === filters.channel);
        if (filters.status !== 'all') {
            filtered = filtered.filter(r => filters.status === 'approved' ? r.approved : !r.approved);
        }

        filtered.sort((a, b) => {
            if (filters.sortBy === 'date') return new Date(b.submittedAt) - new Date(a.submittedAt);
            if (filters.sortBy === 'rating') return b.overallRating - a.overallRating;
            if (filters.sortBy === 'property') return a.listingName.localeCompare(b.listingName);
            return 0;
        });

        return filtered;
    };

    const getStats = () => {
        const total = reviews.length;
        const approved = reviews.filter(r => r.approved).length;
        const avgRating = total > 0
            ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / total).toFixed(1)
            : '0.0';
        return { total, approved, avgRating };
    };

    const filteredReviews = getFilteredReviews();
    const stats = getStats();

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFF9E9] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
                    <p className="text-red-600 text-2xl font-bold">Error Loading Reviews</p>
                    <p className="text-gray-600 mt-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF9E9]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-[#284D4B] mb-4">Reviews Dashboard</h1>
                    <p className="text-xl text-gray-700">Manage and approve guest reviews for Flex Living properties</p>
                </div>

                <Analytics stats={stats} />

                <div className="my-10">
                    <Filters
                        filters={filters}
                        onFilterChange={setFilters}
                        properties={properties}
                        channels={channels}
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <ReviewsTable
                        reviews={filteredReviews}
                        onToggleApproval={toggleApproval}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;