import React from 'react';
import { Filter } from 'lucide-react';

const Filters = ({ filters, onFilterChange, properties, channels }) => {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.property}
                    onChange={(e) => handleChange('property', e.target.value)}
                >
                    <option value="all">All Properties</option>
                    {properties.map(prop => (
                        <option key={prop} value={prop}>{prop}</option>
                    ))}
                </select>

                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.rating}
                    onChange={(e) => handleChange('rating', e.target.value)}
                >
                    <option value="all">All Ratings</option>
                    <option value="9">9+ Stars</option>
                    <option value="8">8+ Stars</option>
                    <option value="7">7+ Stars</option>
                    <option value="6">6+ Stars</option>
                </select>

                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.channel}
                    onChange={(e) => handleChange('channel', e.target.value)}
                >
                    <option value="all">All Channels</option>
                    {channels.map(ch => (
                        <option key={ch} value={ch}>{ch}</option>
                    ))}
                </select>

                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                </select>

                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.sortBy}
                    onChange={(e) => handleChange('sortBy', e.target.value)}
                >
                    <option value="date">Sort by Date</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="property">Sort by Property</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;