// src/components/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { productService, orderService, memberService, statsService } from '../../services/firebaseService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalMembers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await statsService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('載入儀表板資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部標題區域 - 統一風格 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
            <p className="mt-1 text-sm text-gray-600">
              歡迎來到 SIIS Jewelry 後台系統
            </p>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 統計卡片區域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 產品總數 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      產品總數
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 訂單總數 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📋</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      訂單總數
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 會員總數 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      會員總數
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalMembers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 本月營收 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      本月營收
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      NT$ {stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作區域 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              快速操作
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => window.location.href = '#/products'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ➕ 新增產品
              </button>
              <button
                onClick={() => window.location.href = '#/orders'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                📋 查看訂單
              </button>
              <button
                onClick={() => window.location.href = '#/members'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                👥 管理會員
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;