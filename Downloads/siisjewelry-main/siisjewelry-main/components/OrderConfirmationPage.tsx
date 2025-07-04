import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CartItem } from '../types';

interface OrderDetails {
  items: CartItem[];
  total: number;
  shippingFee: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
  };
}

interface OrderConfirmationState {
  orderNumber: string;
  orderDetails: OrderDetails;
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderConfirmationState | null;

  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state) {
    return <div className="p-5 text-center">正在載入...</div>;
  }

  const { orderNumber, orderDetails } = state;
  const { items, total, shippingFee, customer } = orderDetails;

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit': return '信用卡付款';
      case 'linepay': return 'LINE Pay';
      case 'transfer': return '銀行轉帳';
      default: return method;
    }
  };

  // 安全地獲取商品圖片
  const getProductImage = (item: CartItem): string => {
    // 檢查 images 是否存在且為陣列，並且有至少一個元素
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    // 返回默認圖片
    return '/default-product-image.jpg';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <i className="fa-solid fa-check text-2xl text-green-600"></i>
          </div>
          <h1 className="text-2xl font-semibold">訂單已確認</h1>
          <p className="text-gray-600 mt-2">感謝您的購買！您的訂單已成功提交。</p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">訂單資訊</h2>
          <p className="text-gray-700"><span className="font-medium">訂單編號：</span>{orderNumber}</p>
          <p className="text-gray-700"><span className="font-medium">訂單日期：</span>{new Date().toLocaleDateString('zh-TW')}</p>
          <p className="text-gray-700"><span className="font-medium">付款方式：</span>{getPaymentMethodText(customer.paymentMethod)}</p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">收件資訊</h2>
          <p className="text-gray-700"><span className="font-medium">姓名：</span>{customer.name}</p>
          <p className="text-gray-700"><span className="font-medium">電子郵件：</span>{customer.email}</p>
          <p className="text-gray-700"><span className="font-medium">電話：</span>{customer.phone}</p>
          <p className="text-gray-700"><span className="font-medium">地址：</span>{customer.address}</p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">訂單明細</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex gap-3">
                {/* 使用安全的方法獲取圖片 */}
                <img 
                  src={getProductImage(item)} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md" 
                  onError={(e) => {
                    // 圖片載入失敗時的備用方案
                    (e.target as HTMLImageElement).src = '/default-product-image.jpg';
                  }}
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">¥{item.price.toFixed(2)} x {item.quantity}</span>
                    <span className="font-semibold">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between font-medium">
            <span>小計</span>
            <span>¥{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>運費</span>
            <span>{shippingFee === 0 ? '免運' : `¥${shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
            <span>總計</span>
            <span>¥{(total + shippingFee).toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block py-3 px-6 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold">
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
