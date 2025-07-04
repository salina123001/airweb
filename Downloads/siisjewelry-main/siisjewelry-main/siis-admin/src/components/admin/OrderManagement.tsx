// components/admin/OrderManagement.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  notes?: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const orderStatuses = [
    { value: 'pending', label: '待付款', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: '已付款', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: '處理中', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: '已出貨', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: '已送達', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: '已完成', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: '已取消', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });
      
      ordersData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error('載入訂單失敗:', error);
      alert('載入訂單失敗，請重新整理頁面');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updatedAt: Timestamp.now() } : order
      ));
      
      alert('訂單狀態更新成功！');
    } catch (error) {
      console.error('更新訂單狀態失敗:', error);
      alert('更新訂單狀態失敗，請重試');
    }
  };

  const getStatusStyle = (status: string) => {
    const statusInfo = orderStatuses.find(s => s.value === status);
    return statusInfo ? statusInfo.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusInfo = orderStatuses.find(s => s.value === status);
    return statusInfo ? statusInfo.label : status;
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">載入中...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">訂單管理</h1>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部狀態</option>
            {orderStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重新整理
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">總訂單數</div>
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">待處理</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => ['pending', 'paid'].includes(o.status)).length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">已完成</div>
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">總營收</div>
          <div className="text-2xl font-bold text-blue-600">
            NT$ {orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">訂單編號</th>
              <th className="p-4 text-left">客戶資訊</th>
              <th className="p-4 text-right">金額</th>
              <th className="p-4 text-center">狀態</th>
              <th className="p-4 text-left">訂單日期</th>
              <th className="p-4 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  {statusFilter === 'all' ? '目前沒有訂單資料' : `沒有${getStatusLabel(statusFilter)}的訂單`}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">
                      {order.items?.length || 0} 件商品
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-medium">NT$ {order.total?.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-sm rounded ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {order.createdAt?.toDate().toLocaleString() || '—'}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => viewOrderDetail(order)}
                      className="text-blue-600 hover:underline"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
