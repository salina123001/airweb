import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// ✅ Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyBVwk6N0mRimPMZ_hnDYZZaQ5cqcPXf61M",
  authDomain: "siis-jewelry-5c370.firebaseapp.com",
  projectId: "siis-jewelry-5c370",
  storageBucket: "siis-jewelry-5c370.firebasestorage.app",
  messagingSenderId: "88460482323",
  appId: "1:88460482323:web:b6a59a4e537a6a4cf86ce6",
  measurementId: "G-NPDXXFYHBX"
};

// ✅ 初始化 Firebase
const app = initializeApp(firebaseConfig);

// ✅ 導出服務實例
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
