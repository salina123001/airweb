import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import OrderSummary from '../components/OrderSummary';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'credit' | 'linepay' | 'transfer';
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 使用 useMemo 來穩定數據，避免重複處理
  const { user, cartItems } = useMemo(() => {
    const user = location.state?.user || JSON.parse(localStorage.getItem('checkoutUser') || 'null');
    const rawCartItems = location.state?.cartItems || JSON.parse(localStorage.getItem('checkoutCartItems') || '[]');
    
    // 確保每個購物車項目都有有效的 images 屬性
    const cartItems = rawCartItems.map((item: CartItem) => ({
      ...item,
      images: Array.isArray(item.images) ? item.images : []
    }));

    return { user, cartItems };
  }, [location.state]);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'credit',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 如果用戶和購物車都不存在，則重定向到購物車頁面
  useEffect(() => {
    if (!user || cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [user, cartItems.length, navigate]); // 只依賴 length，避免陣列引用變化

  // 如果用戶和購物車都不存在，顯示載入中
  if (!user || cartItems.length === 0) {
    return <div className="p-5 text-center">正在載入...</div>;
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除該欄位的錯誤
    setErrors(prev => {
      if (prev[name as keyof CheckoutFormData]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof CheckoutFormData];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = '請輸入姓名';
    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件';
    }
    if (!formData.phone.trim()) newErrors.phone = '請輸入電話號碼';
    if (!formData.address.trim()) newErrors.address = '請輸入地址';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // 計算總金額和運費
    const totalAmount = cartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
    const shippingFee = totalAmount > 500 ? 0 : 60;
    
    // 模擬訂單提交
    setTimeout(() => {
      // 清除 localStorage 中的結帳數據
      localStorage.removeItem('checkoutUser');
      localStorage.removeItem('checkoutCartItems');
      
      // 導航到訂單確認頁面
      navigate('/order-confirmation', {
        state: {
          orderNumber: `ORD-${Date.now()}`,
          orderDetails: {
            items: cartItems.map((item: CartItem) => ({
              id: item.id,
              name: item.name || '未命名商品',
              price: item.price || 0,
              quantity: item.quantity || 1,
              images: Array.isArray(item.images) ? item.images : []
            })),
            total: totalAmount,
            shippingFee: shippingFee,
            customer: formData,
          }
        }
      });
      
      setIsSubmitting(false);
    }, 1500);
  }, [validateForm, cartItems, formData, navigate]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">結帳</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">訂購資訊</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">電話號碼</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">付款方式</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="credit">信用卡付款</option>
                    <option value="linepay">LINE Pay</option>
                    <option value="transfer">銀行轉帳</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold text-lg disabled:bg-gray-400"
              >
                {isSubmitting ? '處理中...' : '確認訂單'}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <OrderSummary cartItems={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
