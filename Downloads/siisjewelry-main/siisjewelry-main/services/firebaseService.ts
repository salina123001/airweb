// firebaseService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

// 從 firebase.ts 導入已初始化的服務
import { db, storage, auth } from './firebase';

// ✅ Base64 預設圖片
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE4My40IDEwMCAxNzAgMTEzLjQgMTcwIDEzMFMxODMuNCAxNjAgMjAwIDE2MFMyMzAgMTQ2LjYgMjMwIDEzMFMyMTYuNiAxMDAgMjAwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCAyMDBDMTMzLjQgMjAwIDEyMCAyMTMuNDAxIDEyMCAyMzBWMjcwQzEyMCAyODYuNTk5IDEzMy40IDMwMCAxNTAgMzAwSDI1MEM2Ni42IDMwMCAyODAgMjg2LjU5OSAyODAgMjcwVjIzMEMyODAgMjEzLjQwMSAyNjYuNiAyMDAgMjUwIDIwMEgxNTBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPuaaguaXoOWcluePjzwvdGV4dD4KPC9zdmc+';

// 產品介面定義
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  imageUrl: string;
  isActive: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 訂單介面定義
export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// 會員介面定義
export interface Member {
  id?: string;
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: Date;
  memberLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  orderCount: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// ✅ 修正版資料轉換函數
const transformFirebaseProduct = (docData: any, docId: string): Product => {
  const data = docData;
  
  return {
    id: docId,
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || '',
    stock: data.stock || 0,
    images: data.images || [],
    // ✅ 使用安全的預設圖片
    imageUrl: data.images?.[0] || DEFAULT_IMAGE,
    isActive: data.isActive !== undefined ? data.isActive : true,
    rating: data.rating || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date()
  };
};

// 產品服務
export const productService = {
  // 新增產品
  addProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>): Promise<string> => {
    try {
      const product = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log('✅ 產品新增成功，ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ 新增產品失敗:', error);
      throw error;
    }
  },

  // 取得所有產品
  getAll: async (): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => 
        transformFirebaseProduct(doc.data(), doc.id)
      );
      
      console.log('✅ 取得所有產品:', products.length, '個產品');
      console.log('✅ 產品資料預覽:', products.slice(0, 2));
      return products;
    } catch (error) {
      console.error('❌ 取得產品資料失敗:', error);
      return [];
    }
  },

  // 取得所有產品（包含未啟用）
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map((doc) => 
        transformFirebaseProduct(doc.data(), doc.id)
      );
      
      console.log('✅ 取得所有產品（含未啟用）:', products.length, '個');
      return products;
    } catch (error) {
      console.error('❌ 取得產品資料失敗:', error);
      return [];
    }
  },

  // 取得啟用的產品
  getActiveProducts: async (): Promise<Product[]> => {
    return productService.getAll();
  },

  // 取得單一產品
  getById: async (id: string): Promise<Product | null> => {
    try {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        console.log('❌ 產品不存在，ID:', id);
        return null;
      }
      
      const product = transformFirebaseProduct(productSnap.data(), productSnap.id);
      console.log('✅ 取得單一產品:', product);
      return product;
    } catch (error) {
      console.error('❌ 取得產品資料失敗:', error);
      return null;
    }
  },

  // 取得單一產品（舊方法名稱）
  getProduct: async (id: string): Promise<Product | null> => {
    return productService.getById(id);
  },

  // 更新產品
  updateProduct: async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'imageUrl'>>): Promise<void> => {
    try {
      const productRef = doc(db, 'products', id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      // 移除計算欄位
      delete (updateData as any).imageUrl;
      
      await updateDoc(productRef, updateData);
      console.log('✅ 產品更新成功');
    } catch (error) {
      console.error('❌ 更新產品失敗:', error);
      throw error;
    }
  },

  // 刪除產品
  deleteProduct: async (id: string): Promise<void> => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      console.log('✅ 產品刪除成功');
    } catch (error) {
      console.error('❌ 刪除產品失敗:', error);
      throw error;
    }
  },

  // 依分類取得產品
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => 
        transformFirebaseProduct(doc.data(), doc.id)
      );
      
      console.log(`✅ 取得 ${category} 分類產品:`, products.length, '個');
      return products;
    } catch (error) {
      console.error('❌ 取得分類產品失敗:', error);
      return [];
    }
  },

  // 搜尋產品
  searchProducts: async (searchTerm: string): Promise<Product[]> => {
    try {
      const products = await productService.getAll();
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`✅ 搜尋 "${searchTerm}" 結果:`, filteredProducts.length, '個');
      return filteredProducts;
    } catch (error) {
      console.error('❌ 搜尋產品失敗:', error);
      return [];
    }
  }
};

// 圖片上傳服務
export const imageService = {
  // 上傳單張圖片
  uploadImage: async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ 圖片上傳成功:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ 圖片上傳失敗:', error);
      throw error;
    }
  },

  // 上傳多張圖片
  uploadMultipleImages: async (files: File[], basePath: string): Promise<string[]> => {
    try {
      const uploadPromises = files.map((file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`;
        const path = `${basePath}/${fileName}`;
        return imageService.uploadImage(file, path);
      });
      
      const urls = await Promise.all(uploadPromises);
      console.log('✅ 多張圖片上傳成功:', urls);
      return urls;
    } catch (error) {
      console.error('❌ 多張圖片上傳失敗:', error);
      throw error;
    }
  },

  // 刪除圖片
  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log('✅ 圖片刪除成功');
    } catch (error) {
      console.error('❌ 圖片刪除失敗:', error);
      throw error;
    }
  }
};

// 會員服務
export const memberService = {
  // 註冊會員
  registerMember: async (
    email: string, 
    password: string, 
    memberData: Omit<Member, 'id' | 'uid' | 'email' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orderCount' | 'points' | 'memberLevel'>
  ): Promise<string> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const member: Omit<Member, 'id'> = {
        uid: user.uid,
        email: user.email!,
        ...memberData,
        memberLevel: 'bronze',
        totalSpent: 0,
        orderCount: 0,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      const docRef = await addDoc(collection(db, 'members'), member);
      console.log('✅ 會員註冊成功，ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ 會員註冊失敗:', error);
      throw error;
    }
  },

  // 會員登入
  loginMember: async (email: string, password: string): Promise<Member | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const member = await memberService.getMemberByUid(user.uid);
      console.log('✅ 會員登入成功');
      return member;
    } catch (error) {
      console.error('❌ 會員登入失敗:', error);
      throw error;
    }
  },

  // 會員登出
  logoutMember: async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log('✅ 會員登出成功');
    } catch (error) {
      console.error('❌ 會員登出失敗:', error);
      throw error;
    }
  },

  // 取得會員資料（依 ID）
  getMember: async (id: string): Promise<Member | null> => {
    try {
      const memberRef = doc(db, 'members', id);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        return null;
      }
      
      return {
        id: memberSnap.id,
        ...memberSnap.data(),
        createdAt: memberSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: memberSnap.data().updatedAt?.toDate() || new Date(),
        birthDate: memberSnap.data().birthDate?.toDate() || undefined
      } as Member;
    } catch (error) {
      console.error('❌ 取得會員資料失敗:', error);
      return null;
    }
  },

  // 取得會員資料（依 UID）
  getMemberByUid: async (uid: string): Promise<Member | null> => {
    try {
      const q = query(
        collection(db, 'members'),
        where('uid', '==', uid),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        birthDate: doc.data().birthDate?.toDate() || undefined
      } as Member;
    } catch (error) {
      console.error('❌ 查找會員失敗:', error);
      return null;
    }
  },

  // 更新會員資料
  updateMember: async (id: string, updates: Partial<Omit<Member, 'id' | 'uid' | 'createdAt'>>): Promise<void> => {
    try {
      const memberRef = doc(db, 'members', id);
      await updateDoc(memberRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('✅ 會員資料更新成功');
    } catch (error) {
      console.error('❌ 更新會員資料失敗:', error);
      throw error;
    }
  },

  // 取得所有會員
  getAllMembers: async (): Promise<Member[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const members = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        birthDate: doc.data().birthDate?.toDate() || undefined
      })) as Member[];
      
      return members;
    } catch (error) {
      console.error('❌ 取得會員資料失敗:', error);
      return [];
    }
  }
};

// 訂單服務
export const orderService = {
  // 新增訂單
  addOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const order: Omit<Order, 'id'> = {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), order);
      console.log('✅ 訂單新增成功，ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ 新增訂單失敗:', error);
      throw error;
    }
  },

  // 取得所有訂單
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Order[];
      
      return orders;
    } catch (error) {
      console.error('❌ 取得訂單資料失敗:', error);
      return [];
    }
  },

  // 取得單一訂單
  getOrder: async (id: string): Promise<Order | null> => {
    try {
      const orderRef = doc(db, 'orders', id);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        return null;
      }
      
      const order = {
        id: orderSnap.id,
        ...orderSnap.data(),
        createdAt: orderSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: orderSnap.data().updatedAt?.toDate() || new Date()
      } as Order;
      
      return order;
    } catch (error) {
      console.error('❌ 取得訂單資料失敗:', error);
      return null;
    }
  },

  // 更新訂單狀態
  updateOrderStatus: async (id: string, status: Order['status']): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
      console.log('✅ 訂單狀態更新成功');
    } catch (error) {
      console.error('❌ 更新訂單狀態失敗:', error);
      throw error;
    }
  }
};

// Auth 狀態監聽
export const authService = {
  // 監聽登入狀態
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // 取得當前用戶
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};
