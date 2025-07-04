
import React from 'react';

const About: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (!targetId) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="about" className="py-16 bg-neutral/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/id/165/800/600" alt="品牌故事" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-6">我們的品牌故事</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              SiiS Jewelry 始於2015年，由一群熱愛水晶能量與美學的專業人士創立。我們深信每一塊水晶都蘊含著獨特的能量和故事，希望透過我們的作品，將這份自然的禮物傳遞給更多人。
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              我們的使命是提供高品質、純天然的水晶產品，同時傳遞水晶療癒的知識和理念。每一件產品都經過嚴格挑選和能量淨化，確保為您帶來最佳的使用體驗。
            </p>
            <a href="#contact" onClick={handleNavClick} className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              了解更多
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;