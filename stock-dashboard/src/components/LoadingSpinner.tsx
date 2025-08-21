import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-r-indigo-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Market Data</h2>
        <p className="text-gray-600">Fetching real-time stock information...</p>
      </div>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
