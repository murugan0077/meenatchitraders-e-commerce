import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { productService } from './AdminPage';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">All Products</h1>
        <p className="mt-4 text-lg text-gray-600">Browse our complete collection of cleaning and household supplies.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-5 py-3 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-dark focus:border-transparent transition-shadow"
          aria-label="Search products"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-xl text-gray-600">Loading products...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
          <p className="mt-2 text-gray-500">
            We couldn't find any products matching "{searchTerm}". Try a different search.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;