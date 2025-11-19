import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_SUGGESTIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { productService } from './AdminPage';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await productService.getProducts();
      setFeaturedProducts(allProducts.slice(0, 4));
    };
    fetchProducts();
  }, []);


  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Quality Cleaning Supplies for a Sparkling Home
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            From industrial strength cleaners to everyday household essentials, MeenatchiTraders has you covered.
          </p>
          <div className="mt-8">
            <Link 
              to="/products" 
              className="inline-block bg-brand-green text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-green-dark transition-transform transform hover:scale-105"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Bestsellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
                    <span key={index} className="bg-white text-brand-blue font-semibold py-2 px-4 rounded-full shadow-sm">
                        {suggestion}
                    </span>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;