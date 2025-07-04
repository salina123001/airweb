import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', name: '儀表板', icon: '📊' },
    { path: '/admin/products', name: '產品管理', icon: '📦' },
    { path: '/admin/orders', name: '訂單管理', icon: '📋' },
    { path: '/admin/members', name: '會員管理', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-800 text-white transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
              SIIS Jewelry
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded hover:bg-gray-700"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                location.pathname === item.path ? 'bg-gray-700 text-white border-r-4 border-blue-500' : ''
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部導航欄 */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.name || '後台管理'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">管理員</span>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                登出
              </button>
            </div>
          </div>
        </header>

        {/* 頁面內容 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
