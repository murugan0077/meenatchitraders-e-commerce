import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import Modal from '../components/Modal';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, User, setPersistence, browserSessionPersistence } from 'firebase/auth';

import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- AdminProductForm Component ---
interface AdminProductFormProps {
  product: Partial<Product> | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(product || { name: '', description: '', price: 0, stock: 0, imageUrl: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData(product || { name: '', description: '', price: 0, stock: 0, imageUrl: '' });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData as Product);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
        <input type="number" name="price" value={formData.price || 0} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Image</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-dark"
          />
          {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>
        <div className="mt-2">
          <label className="block text-xs text-gray-500">Or paste URL directly:</label>
          <input type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" placeholder="https://..." />
        </div>
        {formData.imageUrl && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <img src={formData.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} disabled={isSaving || isUploading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={isSaving || isUploading} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:opacity-50 flex items-center">
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save'}
        </button>
      </div>
    </form>
  );
};
// --- End AdminProductForm Component ---

// --- Main AdminPage Component ---
const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enforce session persistence (clears on tab close)
    setPersistence(auth, browserSessionPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  // Auto-logout on inactivity (2 minutes)
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // console.log("User inactive for 2 minutes, logging out...");
        signOut(auth);
        alert("Session timed out due to inactivity.");
      }, 2 * 60 * 1000); // 2 minutes
    };

    // Events to detect activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimer();
    };

    // Attach listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initial start
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AdminLoginPage />;
  }

  return <AdminDashboard onLogout={() => signOut(auth)} />;
};

// --- AdminLoginPage Component ---
const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Set persistence to SESSION (clears on tab close)
      await setPersistence(auth, browserSessionPersistence);

      // Try to sign in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      // If user not found and it matches the default admin credentials, create it (Seeding)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        if (email === 'admin@gmail.com' && password === 'admin@123') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Auto logged in after creation
            return;
          } catch (createErr: any) {
            setError('Failed to create default admin: ' + createErr.message);
          }
        } else {
          setError('Invalid credentials.');
        }
      } else {
        setError('Login failed: ' + err.message);
      }
    } finally {
      setIsLoggingIn(false);
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
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                placeholder="username"
              />
            </div>
            <div>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                placeholder="password"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- AdminDashboard Component ---
const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    } else {
      loadOrders();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    setProducts([]); // Clear current list to show loading or force refresh
    const data = await productService.getProducts();
    setProducts(data);
  };

  const loadOrders = async () => {
    setOrders([]);
    const data = await orderService.getAllOrders();
    setOrders(data);
  };

  const handleSaveProduct = async (productToSave: Product) => {
    console.log("Attempting to save product:", productToSave);
    try {
      if (productToSave.id) { // Editing existing
        console.log("Updating existing product...");
        await productService.updateProduct(productToSave);
      } else { // Adding new
        console.log("Adding new product...");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...newProductData } = productToSave;
        await productService.addProduct(newProductData);
      }
      console.log("Product saved successfully. Reloading...");
      await loadProducts();
      closeModal();
      // alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        await loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
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

  const handleSeedData = async () => {
    if (!window.confirm('This will add default products to your database. Continue?')) return;

    const defaultProducts = [
      { name: 'Phynoil', description: 'High-quality floor cleaner with a refreshing scent.', price: 150, stock: 100, imageUrl: 'https://placehold.co/400x400?text=Phynoil' },
      { name: 'Washing Powder', description: 'Powerful stain removal for your laundry.', price: 200, stock: 100, imageUrl: 'https://placehold.co/400x400?text=Washing+Powder' },
      { name: 'Cleaning Powder', description: 'Multi-purpose cleaning powder for tough stains.', price: 80, stock: 100, imageUrl: 'https://placehold.co/400x400?text=Cleaning+Powder' },
      { name: 'Dishwash Oil', description: 'Effective grease removal for sparkling dishes.', price: 120, stock: 100, imageUrl: 'https://placehold.co/400x400?text=Dishwash+Oil' },
      { name: 'Shop Oil', description: 'Industrial grade oil for shop maintenance.', price: 300, stock: 50, imageUrl: 'https://placehold.co/400x400?text=Shop+Oil' },
      { name: 'Liquid Detergent', description: 'Gentle yet effective liquid detergent for clothes.', price: 250, stock: 100, imageUrl: 'https://placehold.co/400x400?text=Liquid+Detergent' },
    ];

    try {
      for (const product of defaultProducts) {
        await productService.addProduct(product);
      }
      await loadProducts();
      alert('Default products added successfully!');
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Failed to add default products.");
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    console.log("🔍 Testing Firestore connection...");

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection test timed out after 10 seconds")), 10000)
      );

      // Create the test operation
      const testOperation = async () => {
        const testCollection = collection(db, 'test_connection');
        const docRef = await addDoc(testCollection, {
          timestamp: new Date(),
          message: "Connection test successful"
        });
        return docRef.id;
      };

      // Race between timeout and actual operation
      const docId = await Promise.race([testOperation(), timeoutPromise]);

      console.log("✅ Connection test successful! Document ID:", docId);
      setIsTestingConnection(false);
      alert("✅ SUCCESS!\n\nDatabase connection is working!\n\nTest document was created successfully.");
    } catch (error) {
      console.error("❌ Connection test failed:", error);
      setIsTestingConnection(false);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ CONNECTION FAILED!\n\nError: ${errorMessage}\n\nPossible causes:\n1. Firestore database not created in Firebase Console\n2. Internet connection issues\n3. Firestore security rules blocking access\n\nCheck browser console (F12) for more details.`);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Orders
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === 'products' && (
            <>
              <button onClick={() => { sessionStorage.clear(); loadProducts(); alert('Cache cleared!'); }} className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 text-sm">Clear Cache</button>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isTestingConnection ? 'Testing...' : 'Test Conn'}
              </button>
              <button onClick={handleSeedData} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm">Load Defaults</button>
              <button onClick={() => openModal(null)} className="bg-brand-green text-white px-3 py-2 rounded-md hover:bg-brand-green-dark text-sm">Add Product</button>
            </>
          )}
          {activeTab === 'orders' && (
            <button onClick={loadOrders} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm">Refresh Orders</button>
          )}
          <button onClick={onLogout} className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm">Logout</button>
        </div>
      </div>

      {activeTab === 'products' ? (
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
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.items.map((item, idx) => (
                      <div key={idx}>{item.name} (x{item.quantity})</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date((order.createdAt as any).seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct?.id ? 'Edit Product' : 'Add New Product'}>
        <AdminProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={closeModal} />
      </Modal>
    </div>
  );
};


export default AdminPage;