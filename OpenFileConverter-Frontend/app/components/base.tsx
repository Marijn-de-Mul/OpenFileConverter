import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

const Base: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Base;