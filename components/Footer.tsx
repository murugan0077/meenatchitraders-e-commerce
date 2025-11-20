import React, { useState } from 'react';
import InfoPopup from './InfoPopup';

const Footer: React.FC = () => {
  const [popupState, setPopupState] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({
    isOpen: false,
    title: '',
    content: null,
  });

  const openPopup = (title: string, content: React.ReactNode) => {
    setPopupState({ isOpen: true, title, content });
  };

  const closePopup = () => {
    setPopupState({ ...popupState, isOpen: false });
  };

  const commonData = (
    <div className="space-y-4">
      <p>
        <strong>Welcome to MeenatchiTraders!</strong>
      </p>
      <p>
        We are dedicated to providing high-quality cleaning and household products.
        This section contains standard information applicable to all our customers.
      </p>
      <p>
        <em>Note: This is a placeholder for specific legal or informational text.
          In a real application, this would contain the full text for the selected section.</em>
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>High Quality Standards</li>
        <li>Customer Satisfaction Priority</li>
        <li>Secure Transactions</li>
      </ul>
    </div>
  );

  return (
    <footer className="bg-gray-800 text-white relative z-10">
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
                <li><a href="#/" className="text-base text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#/products" className="text-base text-gray-400 hover:text-white transition-colors">Products</a></li>
                <li><a href="#/about" className="text-base text-gray-400 hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#/contact" className="text-base text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li>
                  <button
                    onClick={() => openPopup('Frequently Asked Questions', commonData)}
                    className="text-base text-gray-400 hover:text-white transition-colors text-left"
                  >
                    FAQs
                  </button>
                </li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button
                    onClick={() => openPopup('Privacy Policy', commonData)}
                    className="text-base text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openPopup('Terms of Service', commonData)}
                    className="text-base text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MeenatchiTraders. All rights reserved.</p>
        </div>
      </div>

      <InfoPopup
        isOpen={popupState.isOpen}
        onClose={closePopup}
        title={popupState.title}
        content={popupState.content}
      />
    </footer>
  );
};

export default Footer;
