import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ✅ 會員型別
export interface Member {
  id?: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  birthday?: string;
  memberLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent?: number;
  orderCount?: number;
  lastLoginAt?: Timestamp;
  createdAt?: Timestamp;
}

// ✅ 商品型別
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  isActive: boolean;
  tag?: {
    text: string;
    color: string;
  };
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ✅ 訂單項目型別
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// ✅ 訂單型別
export interface Order {
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // 🔧 改為聯合型別
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'; // 🔧 改為聯合型別
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ✅ 會員服務
export const memberService = {
  // 取得所有會員
  getAllMembers: async (): Promise<Member[]> => {
    try {
      const membersRef = collection(db, 'members');
      const q = query(membersRef, orderBy('createdAt', 'desc')); // 🔧 加入排序
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Member, 'id'>)
      }));
    } catch (error) {
      console.error('取得會員失敗:', error);
      throw error;
    }
  },

  // 取得單個會員
  getMember: async (id: string): Promise<Member | null> => {
    try {
      const memberRef = doc(db, 'members', id);
      const docSnap = await getDoc(memberRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Member;
      }
      return null;
    } catch (error) {
      console.error('取得會員失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：根據 email 查找會員
  getMemberByEmail: async (email: string): Promise<Member | null> => {
    try {
      const q = query(collection(db, 'members'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Member;
      }
      return null;
    } catch (error) {
      console.error('根據 email 取得會員失敗:', error);
      throw error;
    }
  },

  // 新增會員
  addMember: async (member: Omit<Member, 'id'>): Promise<string> => {
    try {
      const membersRef = collection(db, 'members');
      const docRef = await addDoc(membersRef, {
        ...member,
        totalSpent: member.totalSpent || 0, // 🔧 設定預設值
        orderCount: member.orderCount || 0, // 🔧 設定預設值
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('新增會員失敗:', error);
      throw error;
    }
  },

  // 更新會員
  updateMember: async (memberId: string, updates: Partial<Member>) => {
    try {
      const memberRef = doc(db, 'members', memberId);
      await updateDoc(memberRef, {
        ...updates,
        updatedAt: Timestamp.now() // 🔧 加入更新時間
      });
    } catch (error) {
      console.error('更新會員失敗:', error);
      throw error;
    }
  },

  // 刪除會員
  deleteMember: async (memberId: string) => {
    try {
      const memberRef = doc(db, 'members', memberId);
      await deleteDoc(memberRef);
    } catch (error) {
      console.error('刪除會員失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：取得活躍會員
  getActiveMembers: async (): Promise<Member[]> => {
    try {
      const q = query(
        collection(db, 'members'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Member, 'id'>)
      }));
    } catch (error) {
      console.error('取得活躍會員失敗:', error);
      throw error;
    }
  }
};

// ✅ 商品服務
export const productService = {
  // 新增商品
  addProduct: async (product: Omit<Product, 'id'>): Promise<string> => {
    try {
      const productRef = collection(db, 'products');
      const docRef = await addDoc(productRef, {
        ...product,
        rating: product.rating || 5, // 🔧 設定預設值
        reviews: product.reviews || 0, // 🔧 設定預設值
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('新增商品失敗:', error);
      throw error;
    }
  },

  // 取得所有商品
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const productRef = collection(db, 'products');
      const q = query(productRef, orderBy('createdAt', 'desc')); // 🔧 加入排序
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }));
    } catch (error) {
      console.error('取得商品失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：取得活躍商品
  getActiveProducts: async (): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }));
    } catch (error) {
      console.error('取得活躍商品失敗:', error);
      throw error;
    }
  },

  // 取得單個商品
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const productRef = doc(db, 'products', id);
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('取得商品失敗:', error);
      throw error;
    }
  },

  // 更新商品
  updateProduct: async (id: string, updatedData: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('更新商品失敗:', error);
      throw error;
    }
  },

  // 刪除商品
  deleteProduct: async (id: string) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('刪除商品失敗:', error);
      throw error;
    }
  },

  // 依類別取得商品
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc') // 🔧 加入排序
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }));
    } catch (error) {
      console.error('依類別取得商品失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：取得低庫存商品
  getLowStockProducts: async (threshold: number = 5): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, 'products'),
        where('stock', '<=', threshold),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }));
    } catch (error) {
      console.error('取得低庫存商品失敗:', error);
      throw error;
    }
  }
};

// ✅ 訂單服務
export const orderService = {
  // 取得所有訂單
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>)
      }));
    } catch (error) {
      console.error('取得訂單失敗:', error);
      throw error;
    }
  },

  // 取得單個訂單
  getOrder: async (id: string): Promise<Order | null> => {
    try {
      const orderRef = doc(db, 'orders', id);
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('取得訂單失敗:', error);
      throw error;
    }
  },

  // 新增訂單
  addOrder: async (order: Omit<Order, 'id'>): Promise<string> => {
    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('新增訂單失敗:', error);
      throw error;
    }
  },

  // 更新訂單
  updateOrder: async (id: string, updates: Partial<Order>) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('更新訂單失敗:', error);
      throw error;
    }
  },

  // 🔧 完成被截斷的刪除訂單函數
  deleteOrder: async (id: string) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error('刪除訂單失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：根據狀態取得訂單
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>)
      }));
    } catch (error) {
      console.error('根據狀態取得訂單失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：取得最近訂單
  getRecentOrders: async (limitCount: number = 10): Promise<Order[]> => {
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>)
      }));
    } catch (error) {
      console.error('取得最近訂單失敗:', error);
      throw error;
    }
  },

  // 🔧 新增：根據客戶 email 取得訂單
  getOrdersByCustomer: async (customerEmail: string): Promise<Order[]> => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerEmail', '==', customerEmail),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>)
      }));
    } catch (error) {
      console.error('根據客戶取得訂單失敗:', error);
      throw error;
    }
  }
};

// 🔧 新增：統計服務
export const statsService = {
  // 取得儀表板統計資料
  getDashboardStats: async () => {
    try {
      const [products, orders, members] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders(),
        memberService.getAllMembers()
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const lowStockProducts = products.filter(product => product.stock <= 5).length;
      const activeMembers = members.filter(member => member.isActive).length;

      return {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalMembers: members.length,
        activeMembers,
        totalRevenue,
        pendingOrders,
        lowStockProducts
      };
    } catch (error) {
      console.error('取得統計資料失敗:', error);
      throw error;
    }
  }
};
