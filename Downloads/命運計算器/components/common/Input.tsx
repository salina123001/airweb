
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string; // Allow custom styling for the input element itself
}

const Input: React.FC<InputProps> = ({ label, id, name, type = "text", value, onChange, required, placeholder, className, ...rest }) => {
  const inputId = id || name;
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-purple-300 mb-1">
        {label} {required && <span className="text-pink-400">*</span>}
      </label>
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-colors ${className || 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
