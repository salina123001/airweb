import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase'; // 你等下會有這個檔
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLoginView && !name)) {
      setError('所有欄位皆為必填');
      return;
    }

    try {
      if (isLoginView) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        onLogin({ id: user.uid, name: user.displayName || '使用者', email: user.email || '' });
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        onRegister({ id: user.uid, name, email: user.email || '' });
      }
    } catch (err: any) {
      setError(err.message || '登入/註冊發生錯誤');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-20">
          <i className="fa-solid fa-times text-xl"></i>
        </button>

        <div className="p-8">
          <div className="flex border-b mb-6">
            <button onClick={() => setIsLoginView(true)} className={`flex-1 py-3 text-lg font-semibold transition-colors ${isLoginView ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
              登入
            </button>
            <button onClick={() => setIsLoginView(false)} className={`flex-1 py-3 text-lg font-semibold transition-colors ${!isLoginView ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
              註冊
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">{isLoginView ? '歡迎回來' : '創建您的帳戶'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">您的姓名</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" className="w-full mt-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold text-lg">
              {isLoginView ? '登入' : '註冊'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
