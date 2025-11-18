export function formatDate(date, format = 'short') {
    if (!date) return 'Unknown date';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

        case 'long':
            return dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

        case 'relative':
            return getRelativeTime(dateObj);

        case 'monthYear':
            return dateObj.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });

        default:
            return dateObj.toLocaleDateString();
    }
}

export function getRelativeTime(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
}

export function isWithinDays(date, days) {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInMs = now - dateObj;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= days;
}

export function getMonthName(date) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'long' });
}

export function getYear(date) {
    return new Date(date).getFullYear();
}

export function sortDates(dates, order = 'desc') {
    return dates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
}

export function groupByDatePeriod(items, dateKey = 'createdAt', period = 'month') {
    const grouped = {};

    items.forEach(item => {
        const date = new Date(item[dateKey]);
        let key;

        switch (period) {
            case 'day':
                key = date.toLocaleDateString();
                break;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toLocaleDateString();
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                key = date.getFullYear().toString();
                break;
            default:
                key = date.toLocaleDateString();
        }

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    });

    return grouped;
}

export default {
    formatDate,
    getRelativeTime,
    isWithinDays,
    getMonthName,
    getYear,
    sortDates,
    groupByDatePeriod
};