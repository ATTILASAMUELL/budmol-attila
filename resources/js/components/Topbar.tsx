import React from 'react';

const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-2">
      <div>
        <h1 className="text-xl font-bold text-gray-700">
          Hello, John Cena <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-sm text-gray-500">
          Your finances, simplified and under control.
        </p>
      </div>

      <div className="text-sm text-gray-500">
        19 November, 2024
      </div>
    </header>
  );
};

export default Topbar;
