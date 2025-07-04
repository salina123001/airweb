import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/firebaseService';
import { Product, CartItem } from '../types';
import ProductCard from './ProductCard';

interface ProductShowcaseProps {
  onProductSelect: (product: Product) => void;
  onAddToCart: (item: CartItem) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ 
  onProductSelect, 
  onAddToCart 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productService.getActiveProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('❌ 載入產品失敗:', error);
      setError('載入產品失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const shouldShowLoading = useMemo(() => loading, [loading]);
  const shouldShowError = useMemo(() => error !== null, [error]);
  const shouldShowEmpty = useMemo(() => 
    !loading && !error && products.length === 0, 
    [loading, error, products.length]
  );

  return (
    <section id="products" data-section="products">
      {shouldShowLoading && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">載入產品中...</span>
            </div>
          </div>
        </div>
      )}

      {shouldShowError && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">❌ {error}</p>
              <button
                onClick={fetchProducts}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      )}

      {shouldShowEmpty && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-gray-500">目前沒有可用的產品</p>
              <p className="text-sm text-gray-400 mt-2">
                請檢查 Firebase 資料或聯絡管理員
              </p>
              <button
                onClick={fetchProducts}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      )}

      {!shouldShowLoading && !shouldShowError && !shouldShowEmpty && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">精選商品</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                探索我們精心挑選的優質商品，為您的生活增添美好體驗
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onViewDetails={onProductSelect}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;
