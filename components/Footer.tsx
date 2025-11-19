
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-brand-green">MeenatchiTraders</h2>
            <p className="mt-2 text-gray-400">Your trusted partner for cleaning and household products.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#/" className="text-base text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#/products" className="text-base text-gray-400 hover:text-white">Products</a></li>
                <li><a href="#/about" className="text-base text-gray-400 hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#/contact" className="text-base text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MeenatchiTraders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
