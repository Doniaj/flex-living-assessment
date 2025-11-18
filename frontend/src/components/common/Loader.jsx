import React from 'react';

const Loader = ({ text = 'Loading...', size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8 border-2',
        md: 'h-12 w-12 border-2',
        lg: 'h-16 w-16 border-4'
    };

    const spinnerSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div
                className={`animate-spin rounded-full ${spinnerSize} border-blue-600 border-t-transparent`}
            />
            {text && (
                <p className="mt-4 text-gray-600 font-medium">{text}</p>
            )}
        </div>
    );
};

export default Loader;