import React from 'react';

const LoadingModal: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="relative w-24 h-24">
        <div className="animate-spin w-full h-full border-4 border-orange-500 border-t-transparent rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
