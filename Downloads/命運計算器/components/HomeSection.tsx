
import React from 'react';
import Button from './common/Button';

interface HomeSectionProps {
  onNavigateToCalculator: () => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ onNavigateToCalculator }) => {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Subtle background animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <div 
              className="absolute bg-purple-500 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
            ></div>
            <div 
              className="absolute bg-pink-500 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 80 + 40}px`,
                height: `${Math.random() * 80 + 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 6 + 6}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
            ></div>
          </React.Fragment>
        ))}
      </div>
      
      <div className="text-center z-10 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            命運計算器
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
          探索宇宙賦予您的獨特印記。透過生肖、星座與生命靈數，<br className="hidden md:inline" />揭開您愛情的謎團、指引事業的方向、照亮個人的成長之路。
        </p>
        <Button
          onClick={onNavigateToCalculator}
          className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover-glowing-shadow-pink"
        >
          開始您的命運測算
        </Button>
      </div>
    </section>
  );
};

export default HomeSection;
