// src/components/admin/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { productService, Product } from '../../services/firebaseService';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  // 新增/編輯產品的表單狀態
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    rating: 5,
    reviews: 0,
    stock: 0,
    isActive: true,
    createdAt: new Date() as any
  });

  // 圖片上傳相關狀態
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('載入產品失敗:', error);
      alert('載入產品失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  // 處理圖片選擇
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // 限制最多3張圖片
    if (files.length > 3) {
      alert('最多只能上傳3張圖片');
      return;
    }

    // 檢查檔案類型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('請選擇有效的圖片格式 (JPG, PNG, WEBP)');
      return;
    }

    // 檢查檔案大小 (5MB)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('圖片大小不能超過 5MB');
      return;
    }

    setSelectedFiles(files);

    // 產生預覽圖
    const previews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === files.length) {
          setPreviewImages(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 上傳圖片到 Firebase Storage
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });

    return Promise.all(uploadPromises);
  };

  // 刪除舊圖片
  const deleteOldImages = async (imageUrls: string[]) => {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        // 從 URL 提取檔案路徑
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        const filePath = `products/${fileName}`;
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('刪除舊圖片失敗:', error);
      }
    });

    await Promise.all(deletePromises);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);

      // 驗證必填欄位
      if (!formData.name || !formData.category || formData.price <= 0) {
        alert('請填寫所有必填欄位');
        return;
      }

      let imageUrls: string[] = [];

      // 如果有選擇圖片，先上傳
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
      }

      const productData = {
        ...formData,
        images: imageUrls
      };

      await productService.addProduct(productData);
      alert('產品新增成功！');
      setShowAddForm(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('新增產品失敗:', error);
      alert('新增產品失敗，請重試');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.id) return;

    try {
      setUploading(true);

      let imageUrls = formData.images;

      // 如果有新選擇的圖片
      if (selectedFiles.length > 0) {
        // 先刪除舊圖片
        if (formData.images.length > 0) {
          await deleteOldImages(formData.images);
        }
        // 上傳新圖片
        imageUrls = await uploadImages(selectedFiles);
      }

      const updatedData = {
        ...formData,
        images: imageUrls
      };

      await productService.updateProduct(editingProduct.id, updatedData);
      alert('產品更新成功！');
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('更新產品失敗:', error);
      alert('更新產品失敗，請重試');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string, images: string[]) => {
    if (window.confirm(`確定要刪除產品「${name}」嗎？此操作無法復原。`)) {
      try {
        // 先刪除圖片
        if (images.length > 0) {
          await deleteOldImages(images);
        }
        
        await productService.deleteProduct(id);
        alert('產品刪除成功！');
        loadProducts();
      } catch (error) {
        console.error('刪除產品失敗:', error);
        alert('刪除產品失敗，請重試');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      rating: 5,
      reviews: 0,
      stock: 0,
      isActive: true,
      createdAt: new Date() as any
    });
    setSelectedFiles([]);
    setPreviewImages([]);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt
    });
    setSelectedFiles([]);
    setPreviewImages([]);
    setShowAddForm(true);
  };

  // 移除預覽圖片
  const removePreviewImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  // 移除現有圖片
  const removeExistingImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部標題區域 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">產品管理</h1>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                ➕ 新增產品
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 統計區域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">總產品數</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isActive).length}
              </div>
              <div className="text-sm text-gray-600">上架中產品</div>
            </div>
          </div>
        </div>

        {/* 搜尋區域 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="搜尋產品名稱或類別..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 產品列表 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  圖片
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  產品名稱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  類別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  價格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  庫存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">無圖</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">NT$ {product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? '上架中' : '已下架'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id!, product.name, product.images)}
                      className="text-red-600 hover:text-red-900"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">沒有找到符合條件的產品</div>
            </div>
          )}
        </div>
      </div>

      {/* 🔧 新增/編輯產品彈窗 - 完全修正版 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? '編輯產品' : '新增產品'}
              </h3>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                
                {/* 基本資訊 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      產品名稱 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      類別 *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">請選擇類別</option>
                      <option value="紫水晶">紫水晶</option>
                      <option value="白水晶">白水晶</option>
                      <option value="粉水晶">粉水晶</option>
                      <option value="黃水晶">黃水晶</option>
                      <option value="綠幽靈">綠幽靈</option>
                      <option value="項錬">項錬</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    產品描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* 🔧 修正後的價格和庫存輸入區域 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      價格 (NT$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 text-sm">NT$</span>
                      <input
                        type="text"
                        required
                        value={formData.price || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          // 只允許數字和小數點
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setFormData({
                              ...formData, 
                              price: value === '' ? 0 : parseFloat(value) || 0
                            });
                          }
                        }}
                        onBlur={(e) => {
                          // 失去焦點時格式化價格
                          const value = parseFloat(e.target.value) || 0;
                          setFormData({...formData, price: value});
                        }}
                        placeholder="0.00"
                        className="mt-1 block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      庫存數量 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.stock || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 只允許整數
                        if (value === '' || /^\d+$/.test(value)) {
                          setFormData({
                            ...formData, 
                            stock: value === '' ? 0 : parseInt(value) || 0
                          });
                        }
                      }}
                      onBlur={(e) => {
                        // 失去焦點時格式化庫存
                        const value = parseInt(e.target.value) || 0;
                        setFormData({...formData, stock: value});
                      }}
                      placeholder="請輸入庫存數量"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 圖片上傳區域 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品圖片 (最多3張)
                  </label>
                  
                  {/* 現有圖片顯示 */}
                  {editingProduct && formData.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">目前圖片：</p>
                      <div className="flex space-x-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`產品圖片 ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 檔案選擇 */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    支援 JPG, PNG, WEBP 格式，每張圖片不超過 5MB
                  </p>

                  {/* 預覽新選擇的圖片 */}
                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">預覽圖片：</p>
                      <div className="flex space-x-2">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`預覽 ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removePreviewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">立即上架</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={uploading}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading ? '上傳中...' : (editingProduct ? '更新' : '新增')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
