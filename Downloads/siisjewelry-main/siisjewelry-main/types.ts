export interface Product {
  id: string; // ✅ 改為 string（Firebase 文件 ID）
  name: string;
  price: number;
  images: string[];
  rating?: number; // ✅ 改為可選，因為 Firebase 中可能沒有
  reviews?: number; // ✅ 改為可選
  description: string;
  tag?: {
    text: string;
    color: string;
  };
  category: string;
  // ✅ 新增 Firebase 必要欄位
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}
