import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import MemberManagement from './components/admin/MemberManagement';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 後台路由 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="members" element={<MemberManagement />} />
        </Route>

        {/* 首頁重導向到後台 */}
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">SIIS Jewelry 管理系統</h1>
                <a
                  href="/admin"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  進入後台管理
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
