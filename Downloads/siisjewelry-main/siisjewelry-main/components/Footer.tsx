import React from 'react';

const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (!targetId) return;

    if (targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer id="contact" className="bg-dark text-neutral/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
             <a href="#" onClick={handleNavClick} className="flex items-center space-x-2 mb-4">
                <span className="text-primary text-3xl"><i className="fa-solid fa-gem"></i></span>
                <span className="text-xl font-bold text-white">SiiS Jewelry</span>
            </a>
            <p className="text-sm">發現水晶的力量，點亮您的生活。</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li><a href="#products" onClick={handleNavClick} className="hover:text-white transition-colors">產品</a></li>
              <li><a href="#about" onClick={handleNavClick} className="hover:text-white transition-colors">關於我們</a></li>
              <li><a href="#ai-chat" onClick={handleNavClick} className="hover:text-white transition-colors">AI 顧問</a></li>
              <li><a href="#" onClick={handleNavClick} className="hover:text-white transition-colors">常見問題</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">聯繫我們</h3>
            <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><i className="fa-solid fa-envelope w-4 text-center"></i> contact@siisjewelry.com</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-phone w-4 text-center"></i> +886 2 1234 5678</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-location-dot w-4 text-center mt-1"></i> 台灣台北市信義區</li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-4">關注我們</h3>
            <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-neutral/60">
          <p>&copy; {new Date().getFullYear()} SiiS Jewelry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;