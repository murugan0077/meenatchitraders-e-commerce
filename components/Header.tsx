
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const Header: React.FC = () => {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-green-100 text-brand-green' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-4 text-base font-medium transition-colors ${isActive ? 'bg-green-100 text-brand-green' : 'text-gray-600 hover:bg-gray-100'
    }`;

  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
      <NavLink to="/products" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Products</NavLink>
      <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>About</NavLink>
      <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
      <NavLink to="/admin" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-brand-green flex items-center gap-2">
              <img src="/logo.svg" alt="MeenatchiTraders Logo" className="h-10 w-10" />
              MeenatchiTraders
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks}
            </div>
          </div>
          <div className="flex items-center">
            <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-brand-green rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingBagIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-blue text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {totalItems}
                </span>
              )}
            </NavLink>
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-green"
              >
                {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Products</NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
            <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
