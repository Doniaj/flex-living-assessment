import React from 'react';
import { TrendingUp, CheckCircle, Star } from 'lucide-react';

const Analytics = ({ stats }) => {
    const cards = [
        {
            title: 'Total Reviews',
            value: stats.total,
            icon: TrendingUp,
            color: 'blue',
            borderColor: 'border-blue-500'
        },
        {
            title: 'Approved',
            value: stats.approved,
            icon: CheckCircle,
            color: 'green',
            borderColor: 'border-green-500'
        },
        {
            title: 'Avg Rating',
            value: stats.avgRating,
            icon: Star,
            color: 'yellow',
            borderColor: 'border-yellow-500'
        }
    ];

    const colorMap = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        yellow: 'text-yellow-500'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${card.borderColor} hover:shadow-xl transition`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </div>
                            <Icon className={`w-12 h-12 ${colorMap[card.color]} opacity-80`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Analytics;