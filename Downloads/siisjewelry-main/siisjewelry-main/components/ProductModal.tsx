import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const generateVirtualRating = (productId: string) => {
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = 3.5 + (seed % 15) / 10;
    const reviews = 15 + (seed % 200);
    return { rating: Math.round(rating * 10) / 10, reviews };
  };

  const { rating, reviews } = generateVirtualRating(product.id);

  // ✅ 修復圖片顯示邏輯
  const getProductImages = (product: Product): string[] => {
    // 如果有 images 陣列，使用它
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    // 如果有單一 image 屬性，轉換為陣列
    if (product.image && typeof product.image === 'string') {
      return [product.image];
    }
    // 都沒有的話返回預設圖片
    return ['https://via.placeholder.com/400x400?text=No+Image'];
  };

  const productImages = getProductImages(product);
  const currentImage = productImages[selectedImageIndex] || productImages[0];

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0], // ✅ 使用第一張圖片作為購物車圖片
      quantity: quantity,
      category: product.category
    };
    onAddToCart(cartItem);
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">產品詳情</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 圖片區塊 */}
            <div>
              <div className="aspect-square mb-4 overflow-hidden rounded-lg border bg-gray-100">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=圖片載入失敗';
                  }}
                />
              </div>

              {/* ✅ 只有多張圖片時才顯示縮圖 */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} 圖片 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/80x80?text=載入失敗';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 商品資訊 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

              {product.description && (
                <p className="text-gray-600 mt-2 mb-4 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {rating} ({reviews} 則評價)
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  NT$ {product.price.toLocaleString()}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">庫存狀態:</span>
                  {product.stock > 0 ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">
                        現貨 {product.stock} 件
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-red-600 font-medium">暫時缺貨</span>
                    </div>
                  )}
                </div>
              </div>

              {product.stock > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">
                      選擇數量
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <span className="text-lg font-medium">-</span>
                      </button>
                      <div className="w-20 text-center">
                        <span className="text-xl font-bold">{quantity}</span>
                      </div>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={quantity >= product.stock}
                      >
                        <span className="text-lg font-medium">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">小計:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        NT$ {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    product.stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? '🛒 加入購物車' : '⚠️ 暫時缺貨'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
