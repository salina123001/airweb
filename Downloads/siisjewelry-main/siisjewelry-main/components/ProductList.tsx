// src/components/ProductList.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { productService } from '../services/firebaseService';
import { Product, CartItem } from '../types';

interface ProductListProps {
  onAddToCart: (item: CartItem) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 使用 useCallback 包裝載入函數
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 ProductList: 開始載入產品...');
      
      // ✅ 使用 Firebase 服務而不是 API
      const productsData = await productService.getActiveProducts();
      console.log('📦 ProductList: 從 Firebase 取得產品:', productsData);
      
      setProducts(productsData);
    } catch (error) {
      console.error('❌ ProductList: 載入產品失敗:', error);
      setError('載入產品失敗，請稍後再試');
      
      // ✅ 錯誤時不使用測試資料，保持空狀態
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 只在組件首次掛載時執行
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ 處理查看詳情
  const handleViewDetails = useCallback((product: Product) => {
    console.log('👀 ProductList: 開啟產品詳情:', product);
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  // ✅ 關閉彈窗
  const handleCloseModal = useCallback(() => {
    console.log('❌ ProductList: 關閉產品詳情');
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // ✅ 處理加入購物車（從 ProductCard 快速加入）
  const handleQuickAddToCart = useCallback((product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    
    console.log('🛒 ProductList: 快速加入購物車:', cartItem);
    onAddToCart(cartItem);
  }, [onAddToCart]);

  // ✅ 使用 useMemo 優化渲染條件
  const shouldShowLoading = useMemo(() => loading, [loading]);
  const shouldShowError = useMemo(() => error !== null, [error]);
  const shouldShowEmpty = useMemo(() => 
    !loading && !error && products.length === 0, 
    [loading, error, products.length]
  );

  // ✅ 載入中狀態
  if (shouldShowLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="ml-4 text-lg text-gray-600">載入產品中...</div>
        </div>
      </div>
    );
  }

  // ✅ 錯誤狀態
  if (shouldShowError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">❌ {error}</div>
          <button 
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  // ✅ 空狀態
  if (shouldShowEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">目前沒有產品</div>
          <p className="text-sm text-gray-400 mb-4">
            請檢查 Firebase 資料或聯絡管理員
          </p>
          <button 
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 產品列表標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">產品列表</h1>
        <p className="text-gray-600">共 {products.length} 項產品</p>
      </div>

      {/* 產品網格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={handleViewDetails}
            onAddToCart={handleQuickAddToCart}
          />
        ))}
      </div>

      {/* 產品詳情彈窗 */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default ProductList;
