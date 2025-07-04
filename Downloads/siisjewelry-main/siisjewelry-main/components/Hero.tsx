import React from 'react';

const Hero: React.FC = () => {
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

  // 🔧 新增：滾動到產品展示區域
  const handleProductsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // 滾動到 ProductShowcase 組件
    const productSection = document.querySelector('[data-section="products"]') || 
                          document.querySelector('.product-showcase') ||
                          document.getElementById('product-showcase');
    
    if (productSection) {
      productSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4 text-shadow">
              發現<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">水晶</span>的力量
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
              SiiS Jewelry 精選世界各地高品質水晶，為您帶來平衡、療癒與美麗。每一件飾品都經過精心挑選，賦予您獨特的能量體驗。
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {/* 🔧 修改這個按鈕 */}
              <a href="#products" onClick={handleProductsClick} className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center">
                <span>瀏覽產品</span>
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </a>
              <a href="#ai-chat" onClick={handleNavClick} className="px-8 py-3 bg-white text-primary border border-primary rounded-full hover:bg-primary/5 transition-colors flex items-center">
                <i className="fa-solid fa-comments mr-2"></i>
                <span>諮詢AI助手</span>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="https://picsum.photos/id/152/800/600" alt="精美的水晶飾品" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
