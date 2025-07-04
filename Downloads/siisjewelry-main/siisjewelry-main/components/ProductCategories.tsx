import React from 'react';
import { INTERACTIVE_EXPERIENCES } from '../constants';

const ProductCategories: React.FC = () => {
  return (
    <section className="py-16 bg-neutral/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">互動水晶體驗</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">不只是購物，我們提供有趣的互動體驗，讓您更深入地探索水晶的奇妙世界。</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INTERACTIVE_EXPERIENCES.map((exp, index) => (
            <div key={index} className="group relative rounded-xl overflow-hidden shadow-lg h-96 flex flex-col justify-end text-white text-center p-6 bg-cover bg-center transition-all duration-500 hover:scale-105" style={{ backgroundImage: `url(${exp.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10 flex flex-col items-center h-full">
                  <div className="flex-grow"></div>
                  <h3 className="text-2xl font-bold mb-2 text-shadow">{exp.title}</h3>
                  <p className="mb-4 text-shadow-sm">{exp.description}</p>
                  <a 
                    href={exp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-colors"
                  >
                    開始體驗
                  </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;