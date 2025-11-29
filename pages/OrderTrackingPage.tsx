import React, { useState } from 'react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

const OrderTrackingPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const foundOrders = await orderService.getOrdersByPhone(phone);
            setOrders(foundOrders);
            if (foundOrders.length === 0) {
                setError('No orders found for this phone number.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh]">
            <h1 className="text-3xl font-serif font-bold text-center mb-8">Track Your Order</h1>
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>

            {orders.length > 0 && (
                <div className="mt-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-bold text-lg">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500">Placed on: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-2">Items:</h3>
                                    <ul className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between text-sm">
                                                <span>{item.name} x {item.quantity}</span>
                                                <span>₹{item.price * item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                    {order.trackingNumber && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded">
                                            <p className="text-sm font-medium text-gray-700">Tracking Number:</p>
                                            <p className="text-lg font-mono">{order.trackingNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTrackingPage;
