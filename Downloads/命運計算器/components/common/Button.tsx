
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out ${className || 'px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
