import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase'; // ✅ 修正導入路徑

// 產品介面
interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt?: Timestamp;
}

// 訂單介面
interface Order {
  id?: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt?: Timestamp;
}

const ProductManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 新增產品表單狀態
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    isActive: true
  });

  // 🔥 載入產品資料
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });
      
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('載入產品失敗:', err);
      setError('載入產品資料失敗，請重新整理頁面');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 新增產品
  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
        alert('請填寫完整的產品資訊');
        return;
      }

      const productData = {
        ...newProduct,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      
      // 更新本地狀態
      setProducts([...products, { ...productData, id: docRef.id }]);
      
      // 重置表單
      setNewProduct({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        isActive: true
      });
      
      setShowAddModal(false);
      alert('產品新增成功！');
    } catch (err) {
      console.error('新增產品失敗:', err);
      alert('新增產品失敗，請重試');
    }
  };

  // 🔥 刪除產品
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('確定要刪除此產品嗎？')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(p => p.id !== productId));
      alert('產品刪除成功！');
    } catch (err) {
      console.error('刪除產品失敗:', err);
      alert('刪除產品失敗，請重試');
    }
  };

  // 🔥 切換產品狀態
  const toggleProductStatus = async (product: Product) => {
    try {
      if (!product.id) return;
      
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        isActive: !product.isActive
      });

      setProducts(products.map(p => 
        p.id === product.id ? { ...p, isActive: !p.isActive } : p
      ));
    } catch (err) {
      console.error('更新產品狀態失敗:', err);
      alert('更新產品狀態失敗，請重試');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-xl">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={fetchProducts}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">產品管理</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新增產品
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">產品名稱</th>
              <th className="p-4 text-left">類別</th>
              <th className="p-4 text-right">價格</th>
              <th className="p-4 text-right">庫存</th>
              <th className="p-4 text-center">狀態</th>
              <th className="p-4 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  目前沒有產品資料，請新增第一個產品
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 text-right">NT$ {product.price}</td>
                  <td className="p-4 text-right">{product.stock}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleProductStatus(product)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isActive ? '上架中' : '已下架'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        編輯
                      </button>
                      <button 
                        onClick={() => product.id && handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 新增產品 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">新增產品</h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="產品名稱"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="產品類別"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="價格"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="庫存數量"
                value={newProduct.stock || ''}
                onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newProduct.isActive}
                  onChange={(e) => setNewProduct({...newProduct, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isActive">立即上架</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  新增產品
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
