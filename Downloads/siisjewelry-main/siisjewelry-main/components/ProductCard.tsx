// src/components/ProductCard.tsx
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart
}) => {
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
  const stock = typeof product.stock === 'number' ? product.stock : parseInt(product.stock) || 0;

  // ✅ 使用第一張圖片（images[0]）
  const imageUrl = product.images?.[0] || '/placeholder-image.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 商品圖片 */}
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ¥{price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            庫存 {stock} 件
          </span>
        </div>

        {/* 按鈕組 */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            查看詳情
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={stock <= 0}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {stock <= 0 ? '缺貨' : '加入購物車'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
