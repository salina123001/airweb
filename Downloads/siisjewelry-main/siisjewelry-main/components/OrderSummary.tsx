import React, { useMemo } from 'react';
import { CartItem } from '../types';

interface OrderSummaryProps {
    cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
    // 使用 useMemo 來避免重複計算
    const { subtotal, shippingFee, total, processedItems } = useMemo(() => {
        const processedItems = cartItems.map(item => ({
            ...item,
            imageUrl: Array.isArray(item.images) && item.images.length > 0 
                ? item.images[0] 
                : '/default-product-image.jpg'
        }));
        
        const subtotal = processedItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const shippingFee = subtotal > 500 ? 0 : 60;
        const total = subtotal + shippingFee;
        
        return { subtotal, shippingFee, total, processedItems };
    }, [cartItems]);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4">訂單摘要</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {processedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                        <div className="relative">
                            <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-md"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== '/default-product-image.jpg') {
                                        target.src = '/default-product-image.jpg';
                                    }
                                }}
                            />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-sm">{item.name}</p>
                        </div>
                        <p className="font-semibold text-sm">¥{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 border-t pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>小計</span>
                    <span>¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>運費</span>
                    <span>{shippingFee === 0 ? '免運' : `¥${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-dark font-bold text-lg border-t pt-3 mt-3">
                    <span>總計</span>
                    <span>¥{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(OrderSummary);
