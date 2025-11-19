import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import Modal from '../components/Modal';

// --- Mock Services ---
// This simulates a backend service for products and authentication.
const PRODUCTS_STORAGE_KEY = 'admin_products';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const storedProducts = sessionStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        return JSON.parse(storedProducts);
      }
    } catch (e) {
      console.error("Corrupted product data in session storage, will reset.", e);
    }
    // If no products in storage or data is corrupt, initialize with mock data.
    await productService.saveProducts(MOCK_PRODUCTS);
    return MOCK_PRODUCTS;
  },
  saveProducts: async (products: Product[]) => {
    try {
      sessionStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
        console.error("Failed to save products to session storage", e);
    }
  },
};

const authService = {
  login: (user: string, pass: string): boolean => {
    if (user === 'admin@gmail.com' && pass === 'admin@123') {
      sessionStorage.setItem('isAdminAuth', 'true');
      return true;
    }
    return false;
  },
  logout: () => {
    sessionStorage.removeItem('isAdminAuth');
  },
  isAuthenticated: (): boolean => {
    return sessionStorage.getItem('isAdminAuth') === 'true';
  },
};
// --- End Mock Services ---


// --- AdminProductForm Component (defined in the same file for simplicity) ---
interface AdminProductFormProps {
    product: Partial<Product> | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Product>>(product || { name: '', description: '', price: 0, stock: 0, imageUrl: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Product);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input type="number" name="price" value={formData.price || 0} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark">Save</button>
            </div>
        </form>
    );
};
// --- End AdminProductForm Component ---


// --- Main AdminPage Component ---
const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  
  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
};

// --- AdminLoginPage Component ---
const AdminLoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authService.login(username, password)) {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Panel Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input value={username} onChange={e => setUsername(e.target.value)} name="username" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm" placeholder="Username (admin@gmail.com)" />
            </div>
            <div>
              <input value={password} onChange={e => setPassword(e.target.value)} name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm" placeholder="Password (admin@123)" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- AdminDashboard Component ---
const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await productService.getProducts();
        setProducts(data);
    };

    const handleSaveProduct = async (productToSave: Product) => {
        let updatedProducts;
        if (productToSave.id) { // Editing existing
            updatedProducts = products.map(p => p.id === productToSave.id ? productToSave : p);
        } else { // Adding new
            const newProduct = { ...productToSave, id: `prod_${Date.now()}` };
            updatedProducts = [...products, newProduct];
        }
        await productService.saveProducts(updatedProducts);
        setProducts(updatedProducts);
        closeModal();
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updatedProducts = products.filter(p => p.id !== productId);
            await productService.saveProducts(updatedProducts);
            setProducts(updatedProducts);
        }
    };

    const openModal = (product: Partial<Product> | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <div>
                    <button onClick={() => openModal({})} className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-brand-green-dark mr-4">Add Product</button>
                    <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(product)} className="text-brand-blue hover:text-brand-blue-dark mr-4">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct?.id ? 'Edit Product' : 'Add New Product'}>
                <AdminProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={closeModal} />
            </Modal>
        </div>
    );
};


export default AdminPage;