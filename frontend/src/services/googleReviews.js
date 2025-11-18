import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchGoogleReviews(propertyName) {
    try {
        console.log(`🔍 Fetching Google reviews for: ${propertyName}`);

        const response = await axios.get(`${API_BASE}/api/reviews/google`, {
            params: {
                property: propertyName
            }
        });

        console.log(`✅ Fetched ${response.data.count} Google reviews`);
        return response.data.data || [];

    } catch (error) {
        console.error('❌ Failed to load Google reviews:', error);
        return [];
    }
}

export async function fetchCombinedReviews(listingId) {
    try {
        const response = await axios.get(`${API_BASE}/api/reviews/combined/${listingId}`);

        console.log(`✅ Fetched combined reviews:`, response.data.sources);
        return response.data.data || [];

    } catch (error) {
        console.error('❌ Failed to load combined reviews:', error);
        return [];
    }
}

export async function getIntegrationStatus() {
    try {
        const response = await axios.get(`${API_BASE}/api/reviews/status`);
        return response.data.integrations || {};
    } catch (error) {
        console.error('❌ Failed to get integration status:', error);
        return {};
    }
}

export default {
    fetchGoogleReviews,
    fetchCombinedReviews,
    getIntegrationStatus
};