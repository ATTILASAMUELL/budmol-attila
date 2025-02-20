import React from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label className="block text-white mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 ${className}`}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
