import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10 my-8 space-y-6">
      <div className="relative">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-pink-500 opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 opacity-60"
              style={{ animationDelay: '-0.075s' }}
            ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl text-purple-300 animate-pulse">
          🔮
        </div>
      </div>
      <p className="text-xl text-purple-200 tracking-wider">
        AI 正在推算您的命運
        <span 
          className="inline-block ml-1" 
          style={{ animation: 'bounce_custom 1.4s infinite ease-in-out both' }}
        >.</span>
        <span 
          className="inline-block ml-1" 
          style={{ animation: 'bounce_custom 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}
        >.</span>
        <span 
          className="inline-block ml-1" 
          style={{ animation: 'bounce_custom 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}
        >.</span>
      </p>
    </div>
  );
};

export default LoadingSpinner;