import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-600 p-4 mt-8">
      <div className="container mx-auto text-center text-white">
        &copy; {new Date().getFullYear()} OpenFileConverter. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;