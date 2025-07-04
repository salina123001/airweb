import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductCategories from './components/ProductCategories';
import ProductShowcase from './components/ProductShowcase';
import ProductList from './components/ProductList';
import About from './components/About';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import CheckoutPage from './components/CheckoutPage';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';

import { Product, CartItem, User } from './types';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 首頁滾動行為處理
  useEffect(() => {
    if (location.state?.scrollTo) {
      const selector = location.state.scrollTo;
      const targetElement = document.querySelector(`section${selector}`);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      }
    }
  }, [location]);

  // 以下保留原有狀態與邏輯...
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '用戶'
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      return existingItem
        ? prevItems.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        : [...prevItems, item];
    });
    setSelectedProduct(null);
    setToastMessage(`${item.name} 已成功加入購物車！`);
    setIsCartOpen(true);
  }, []);

  const handleViewProductDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleCartClick = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleCartClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => item.id === id ? { ...item, quantity } : item)
      );
    }
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== id)
    );
  }, []);

  const handleCheckout = useCallback(() => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  }, [currentUser, navigate]);

  const handleUserClick = useCallback(() => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    }
  }, [currentUser]);

  const handleLogin = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleRegister = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      setToastMessage('已成功登出');
      setCartItems([]);
      setIsCartOpen(false);
    } catch {
      setToastMessage('登出失敗，請稍後再試');
    }
  }, []);

  const handleAuthModalClose = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    try {
      setCartItems([]);
      setToastMessage('訂單提交成功！');
      navigate('/');
    } catch {
      setToastMessage('訂單提交失敗，請稍後再試');
    }
  }, [navigate]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        cartCount={cartItemCount}
        currentUser={currentUser}
        onCartClick={handleCartClick}
        onUserClick={handleUserClick}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={
          <>
            <main>
              <Hero />
              <Features />
              <ProductCategories />
              <ProductShowcase 
                onProductSelect={handleViewProductDetails}  
                onAddToCart={handleAddToCart}
              />
              <About />
              <AiAssistant />
            </main>
            <Footer />
          </>
        } />

        <Route path="/products" element={
          <>
            <div className="pt-20">
              <ProductList onAddToCart={handleAddToCart} />
            </div>
            <Footer />
          </>
        } />

        <Route path="/category/:categoryName" element={
          <>
            <div className="pt-20">
              <ProductList onAddToCart={handleAddToCart} />
            </div>
            <Footer />
          </>
        } />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/checkout" element={
          <PrivateRoute user={currentUser}>
            <CheckoutPage
              user={currentUser}
              cartItems={cartItems}
              onPlaceOrder={handlePlaceOrder}
              onClose={() => navigate('/')}
            />
          </PrivateRoute>
        } />

        <Route path="/about" element={
          <>
            <div className="pt-20">
              <About />
            </div>
            <Footer />
          </>
        } />

        <Route path="/cart" element={
          <>
            <div className="pt-20 min-h-screen bg-gray-50">
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">購物車</h1>
                {/* 可加入購物車內容... */}
              </div>
            </div>
            <Footer />
          </>
        } />

        <Route path="*" element={
          <>
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">頁面不存在</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  回到首頁
                </button>
              </div>
            </div>
            <Footer />
          </>
        } />
      </Routes>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={handleCartClose}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {isAuthModalOpen && (
        <AuthModal
          onClose={handleAuthModalClose}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
