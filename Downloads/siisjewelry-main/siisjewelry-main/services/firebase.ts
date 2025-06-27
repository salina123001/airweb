// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDJv-tGxJWO-lXh4m0E0KOqKdMDfFQ60Pw',
  authDomain: 'siis-jewelry.firebaseapp.com',
  projectId: 'siis-jewelry',
  storageBucket: 'siis-jewelry.appspot.com',
  messagingSenderId: '301795449698',
  appId: '1:301795449698:web:d8d1f3eab5fb57a8ce2a3b',
  measurementId: 'G-G2J4KKPDK3',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
