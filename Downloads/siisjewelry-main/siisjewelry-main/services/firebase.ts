// src/services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBVwk6N0mRimPMZ_hnDYZZaQ5cqcPXf61M",
  authDomain: "siis-jewelry-5c370.firebaseapp.com",
  projectId: "siis-jewelry-5c370",
  storageBucket: "siis-jewelry-5c370.appspot.com",
  messagingSenderId: "88460482323",
  appId: "1:88460482323:web:b6a59a4e537a6a4cf86ce6",
  measurementId: "G-NPDXXFYHBX"
};

// ✅ 防止重複初始化
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ 提供 auth, db, storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ 為瀏覽器 Console 測試用（可選）
if (typeof window !== 'undefined') {
  (window as any).firebaseApp = app;
}
