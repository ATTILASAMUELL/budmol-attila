import React from 'react';

interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-3 w-full max-w-xs">
      <div className="h-24 bg-green-100 rounded flex items-center justify-center mb-3">
        <svg
          className="w-8 h-8 text-green-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 3h18v18H3V3z" />
          <path d="M9 9h6v6H9V9z" />
        </svg>
      </div>

      <h2 className="text-lg font-bold text-gray-700">{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{description}</p>

      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors text-sm">
        Edição
      </button>
    </div>
  );
};

export default Card;
