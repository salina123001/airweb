// src/components/Cart.tsx
import React, { useMemo, useEffect, useState } from 'react';
import { CartItem } from '../types';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../services/firebase';

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const parsePrice = (val: any) => (typeof val === 'number' ? val : parseFloat(val) || 0);
  const parseQuantity = (val: any) => (typeof val === 'number' ? val : parseInt(val) || 1);

  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const urls: Record<string, string> = { ...imageUrls };
      let hasChanges = false;

      await Promise.all(
        items.map(async (item) => {
          if (!urls[item.id]) {
            hasChanges = true;
            try {
              console.log('📦 檢查商品數據:', {
                id: item.id,
                name: item.name,
                storagePath: item.storagePath,
                image: item.image,
                imageUrl: item.imageUrl
              });

              // 檢查多個可能的圖片路徑欄位
              let imagePath = item.storagePath || item.image || item.imageUrl || item.photo;
              
              if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
                console.warn(`❌ 商品 ${item.name} 沒有有效的圖片路徑`);
                throw new Error(`商品 ${item.name} 的圖片路徑為空`);
              }

              // 如果是完整的 URL，直接使用
              if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                urls[item.id] = imagePath;
                console.log('✅ 使用直接URL:', imagePath);
              } else {
                // 否則從 Firebase Storage 獲取
                const url = await getDownloadURL(ref(storage, imagePath));
                urls[item.id] = url;
                console.log('✅ 從 Firebase Storage 載入:', imagePath, '→', url);
              }
            } catch (err) {
              console.warn(`❌ 圖片載入失敗: ${item.name}`, {
                storagePath: item.storagePath,
                image: item.image,
                imageUrl: item.imageUrl,
                error: err
              });
              urls[item.id] = '/placeholder-image.jpg';
            }
          }
        })
      );

      if (hasChanges) {
        setImageUrls(urls);
      }
    };

    if (items.length > 0) fetchImages();
  }, [items.length, items.map(item => item.id).sort().join(',')])

  // 清理不再需要的圖片URL
  useEffect(() => {
    const currentItemIds = new Set(items.map(item => item.id));
    
    setImageUrls(prev => {
      const filtered: Record<string, string> = {};
      Object.keys(prev).forEach(id => {
        if (currentItemIds.has(id)) {
          filtered[id] = prev[id];
        }
      });
      return filtered;
    });
  }, [items.length]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + parsePrice(item.price) * parseQuantity(item.quantity);
    }, 0);
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + parseQuantity(item.quantity), 0);
  }, [items]);

  const handleIncrease = (id: string, quantity: number) => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id: string, quantity: number) => {
    onUpdateQuantity(id, Math.max(1, quantity - 1));
  };

  const handleRemove = (id: string) => {
    onRemoveItem(id);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">購物車</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500 text-center">
              <div>
                <div className="text-4xl mb-4">🛒</div>
                <p>購物車是空的</p>
                <p className="text-sm mt-2">快去選購商品吧！</p>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const quantity = parseQuantity(item.quantity);
              const price = parsePrice(item.price);
              const subtotal = price * quantity;
              const imageUrl = imageUrls[item.id] || '/placeholder-image.jpg';

              return (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/placeholder-image.jpg') {
                        target.src = '/placeholder-image.jpg';
                      }
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-800">{item.name}</h3>
                    <p className="text-blue-600 font-bold">¥{price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">小計: ¥{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border rounded-lg">
                      <button 
                        onClick={() => handleDecrease(item.id, quantity)} 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100" 
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-3 py-1 min-w-[40px] text-center font-semibold">{quantity}</span>
                      <button 
                        onClick={() => handleIncrease(item.id, quantity)} 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        ＋
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)} 
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      移除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t bg-gray-50 p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>商品數量:</span>
              <span>{totalQuantity} 件</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>總計:</span>
              <span className="text-blue-600">¥{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
          >
            前往結帳
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;