import React from 'react';

export default function Skeleton() {
    return (
        <div className=" rounded-lg p-4 animate-pulse w-full max-w-md">
            <div className="h-5 w-1/3 bg-gray-300 rounded mb-3"></div>
            <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-end mt-3 space-x-3">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}
