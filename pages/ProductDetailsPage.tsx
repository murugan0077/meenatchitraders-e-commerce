import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { productService } from './AdminPage';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER, COMPANY_NAME } from '../constants';

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { dispatch } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            const allProducts = await productService.getProducts();
            const foundProduct = allProducts.find(p => p.id === id);
            setProduct(foundProduct || null);
            setIsLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch({ type: 'ADD_ITEM', payload: product });
            // Optional: Show a toast or notification
            alert('Added to cart!');
        }
    };

    const handleOrderViaWhatsApp = () => {
        if (product) {
            const message = `Hello ${COMPANY_NAME}, I'm interested in ordering this product:\n\n*Product:* ${product.name}\n*Price:* ₹${product.price}\n\nPlease let me know how to proceed.`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-xl font-serif text-luxury-blue">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-3xl font-serif text-luxury-black mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/products')} className="btn-luxury">
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 text-luxury-blue hover:text-luxury-gold transition-colors flex items-center gap-2 font-medium"
            >
                ← Back
            </button>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="h-96 md:h-auto relative bg-gray-50 flex items-center justify-center p-8">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="p-10 md:p-12 flex flex-col justify-center bg-white">
                        <div className="mb-6">
                            <span className="inline-block bg-luxury-gold-light text-luxury-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-blue mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-light text-luxury-gold mb-6">
                                ₹{product.price.toFixed(2)}
                            </p>
                            <div className="prose prose-lg text-gray-600 mb-8">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 bg-luxury-blue text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button
                                onClick={handleOrderViaWhatsApp}
                                className="flex-1 bg-brand-green text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-brand-green-dark transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.288 1.902 6.043l-1.465 5.352 5.25-1.372z" />
                                </svg>
                                Order via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
