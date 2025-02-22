import React from 'react';

interface InputFieldProps {
  label: string;
  labelColor?: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelColor = 'text-white',
  type,
  value,
  onChange,
  placeholder,
  required = false,
  multiline = false,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label className={`block font-semibold mb-1 ${labelColor}`}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800 ${className}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800 ${className}`}
        />
      )}
    </div>
  );
};

export default InputField;
