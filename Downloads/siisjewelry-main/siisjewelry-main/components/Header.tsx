import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { User } from '../types';

interface HeaderProps {
  cartCount: number;
  currentUser: User | null;
  onCartClick: () => void;
  onUserClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, currentUser, onCartClick, onUserClick, onLogout }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // 如果當前在結帳頁面或其他非首頁路由，需要先導航到首頁
    if (location.pathname !== '/') {
      if (href === '#') {
        // 導航到首頁頂部
        navigate('/');
      } else {
        // 導航到首頁並滾動到指定區域
        navigate('/', { state: { scrollTo: href } });
      }
      return;
    }

    // 如果已經在首頁，直接滾動
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };
  
  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setMenuOpen(false);
  };

  const handleUserAction = () => {
    if (currentUser) {
      setUserMenuOpen(!isUserMenuOpen);
    } else {
      onUserClick();
    }
  };
  
  const handleLogoutClick = () => {
    onLogout();
    setUserMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-white/80'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="#" onClick={handleLogoClick} className="flex items-center space-x-2">
            <span className="text-primary text-3xl"><i className="fa-solid fa-gem"></i></span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SiiS Jewelry</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(link => (
              <a 
                key={link.label} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)} 
                className="font-medium hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setSearchOpen(!isSearchOpen)} className="text-dark hover:text-primary transition-colors">
              <i className="fa-solid fa-search text-xl"></i>
            </button>
            <button onClick={onCartClick} className="text-dark hover:text-primary transition-colors relative">
              <i className="fa-solid fa-shopping-bag text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="relative" ref={userMenuRef}>
              <button onClick={handleUserAction} className="text-dark hover:text-primary transition-colors">
                <i className="fa-solid fa-user text-xl"></i>
              </button>
              {currentUser && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-semibold">Hi, {currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">我的帳戶</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">訂單記錄</a>
                  <button onClick={handleLogoutClick} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                    登出
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setMenuOpen(!isMenuOpen)} className="md:hidden text-dark hover:text-primary transition-colors">
              <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${isSearchOpen ? 'max-h-40' : 'max-h-0'}`}>
        <div className="bg-white border-t border-gray-100 py-3 px-4">
          <div className="container mx-auto">
            <div className="relative">
              <input type="text" placeholder="搜索產品..." className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`transition-all duration-300 md:hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
        <div className="bg-white border-t border-gray-100 py-4 px-4">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map(link => (
              <a 
                key={link.label} 
                href={link.href} 
                className="font-medium hover:text-primary transition-colors py-2 cursor-pointer" 
                onClick={(e) => handleMobileNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
