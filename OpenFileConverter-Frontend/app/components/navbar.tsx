import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          OpenFileConverter
        </div>
        <div className="space-x-4">
          <a href="/" className="text-white hover:text-gray-200">Convert</a>
          <a href="/update" className="text-white hover:text-gray-200">Update</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;