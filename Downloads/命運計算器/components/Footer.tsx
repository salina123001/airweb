
import React from 'react';
import { NAV_LINKS, SECTION_IDS } from '../constants';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (href: string) => {
    onNavigate(href.substring(1)); // Remove '#'
  };

  return (
    <footer className="bg-gray-900/70 backdrop-blur-sm border-t border-purple-700/50 text-gray-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-pink-400 tracking-wider uppercase">命運計算器</h3>
            <p className="mt-4 text-base text-gray-500">
              探索宇宙的奧秘，洞悉您的未來。
            </p>
          </div>
          <div className="mt-12 md:mt-0">
            <h3 className="text-sm font-semibold text-pink-400 tracking-wider uppercase">快速連結</h3>
            <ul role="list" className="mt-4 space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href);}}
                    className="text-base text-gray-500 hover:text-pink-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 md:mt-0">
            <h3 className="text-sm font-semibold text-pink-400 tracking-wider uppercase">訂閱電子報</h3>
            <p className="mt-4 text-base text-gray-500">
              獲取最新的命理資訊與獨家內容。
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">電子郵件地址</label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="appearance-none min-w-0 w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-4 text-base text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:placeholder-gray-400"
                placeholder="輸入您的電子郵件"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-all duration-300 hover:shadow-[0_0_15px_3px_rgba(236,72,153,0.5)]"
                >
                  訂閱
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-purple-700/50 pt-8">
          <p className="text-base text-gray-500 xl:text-center">&copy; {new Date().getFullYear()} 命運計算器. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
