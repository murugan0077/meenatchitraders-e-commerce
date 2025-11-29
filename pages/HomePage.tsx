import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_SUGGESTIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { productService } from '../services/productService';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const allProducts = await productService.getProducts();
      setFeaturedProducts(allProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);


  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <div className="flex flex-col w-full">
        {/* Banner Image */}
        <div className="w-full">
          <img
            src="/banner.png"
            alt="MeenatchiTraders Banner"
            className="w-full h-auto object-cover max-h-[60vh]"
          />
        </div>

        {/* Text Content */}
        <section className="bg-luxury-black text-white py-16 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold mb-6 leading-tight">
              Quality Cleaning Supplies for a Sparkling Home
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              From industrial strength cleaners to everyday household essentials, MeenatchiTraders has you covered.
            </p>
            <Link
              to="/products"
              className="inline-block bg-luxury-gold text-luxury-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 shadow-lg"
            >
              Shop All Products
            </Link>
          </div>
        </section>
      </div>

      {/* All Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">All Products</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-luxury-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Suggestions Section */}
      <section className="bg-gray-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Find What You Need</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Explore our wide range of specialized products.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {PRODUCT_SUGGESTIONS.map((suggestion, index) => (
              <Link
                key={index}
                to={`/products?search=${encodeURIComponent(suggestion)}`}
                className="bg-white text-brand-blue font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-brand-blue hover:text-white transition-colors duration-300"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;