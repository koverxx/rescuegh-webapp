// src/layouts/MainLayout.jsx
import React from 'react';
import kenteBg from '../assets/kente.png';

const MainLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${kenteBg})` }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen bg-opacity-10 backdrop-blur-sm">
        {/* Ghana Flag Ribbon */}
        <div className="w-full h-3 flex">
          <div className="w-1/3 bg-red-600"></div>
          <div className="w-1/3 bg-yellow-400"></div>
          <div className="w-1/3 bg-green-600"></div>
        </div>

        {/* Main Page Content */}
        <div className="relative z-10 p-4">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
