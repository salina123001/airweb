import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2700); // slightly shorter than App's state reset to allow for fade-out
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div 
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 z-50 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}
    >
      <i className="fa-solid fa-check-circle mr-2 text-green-400"></i>
      {message}
    </div>
  );
};

export default Toast;
