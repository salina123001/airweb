// src/components/Dashboard.tsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Dashboard: React.FC = () => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  const menuItems = [
    { path: '/products', name: '產品管理', icon: 'fa-box' },
    { path: '/orders', name: '訂單管理', icon: 'fa-shopping-cart' },
    { path: '/members', name: '會員管理', icon: 'fa-users' },
    { path: '/settings', name: '系統設定', icon: 'fa-cog' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">SIIS 後台</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors ${
                location.pathname === item.path ? 'bg-gray-200 border-l-4 border-blue-600' : ''
              }`}
            >
              <i className={`fas ${item.icon} mr-3`}></i>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            登出
          </button>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
