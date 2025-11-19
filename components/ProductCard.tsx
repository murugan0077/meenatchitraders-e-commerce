
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER, COMPANY_NAME } from '../constants';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.288 1.902 6.043l-1.465 5.352 5.25-1.372z" />
  </svg>
);

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const handleOrderViaWhatsApp = () => {
    const message = `Hello ${COMPANY_NAME}, I'm interested in ordering this product:\n\n*Product:* ${product.name}\n*Price:* ₹${product.price}\n\nPlease let me know how to proceed.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden group">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-2 right-2">
          {product.stock > 0 ? (
            <span className="bg-luxury-gold-light text-luxury-black text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">In Stock</span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Out of Stock</span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 flex-grow">{product.description}</p>
        <p className="text-2xl font-bold text-gray-900 mt-4">₹{product.price.toFixed(2)}</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-brand-blue text-white py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 hover:bg-brand-blue-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleOrderViaWhatsApp}
            className="w-full bg-brand-green text-white py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 hover:bg-brand-green-dark"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
