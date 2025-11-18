import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const reviewsApi = {
    getAll: () => api.get('/reviews/hostaway'),
    getByListing: (listingId) => api.get(`/reviews/hostaway/${listingId}`),
    approve: (reviewId, approved) => api.post('/reviews/approve', { reviewId, approved }),
    getPublic: (listingId) => api.get(`/reviews/public/${listingId}`),
    getAnalytics: () => api.get('/reviews/analytics'),
    getGoogle: (propertyName) =>
        api.get(`/reviews/google?property=${encodeURIComponent(propertyName)}`)
};

export const propertiesApi = {
    getAll: () => api.get('/properties'),
    getById: (id) => api.get(`/properties/${id}`),
    getAvailability: (id, checkIn, checkOut) => api.get(`/properties/${id}/availability`, { params: { checkIn, checkOut } })
};

export default api;