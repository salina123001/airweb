
import React from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange, required }) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-purple-300 mb-2">
        {label} {required && <span className="text-pink-400">*</span>}
      </legend>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="h-4 w-4 text-pink-500 border-gray-500 focus:ring-pink-400 bg-gray-600"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-200">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default RadioGroup;
