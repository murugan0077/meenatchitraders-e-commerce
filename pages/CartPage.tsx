import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER, COMPANY_NAME } from '../constants';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const { items } = state;
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Free shipping

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleOrderViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const productDetails = items.map(item => `- ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    const shippingDetails = `
*Shipping Information:*
Name: ${shippingInfo.firstName} ${shippingInfo.lastName}
Phone: ${shippingInfo.phone}
Email: ${shippingInfo.email}
Address: ${shippingInfo.address1}, ${shippingInfo.address2 ? shippingInfo.address2 + ', ' : ''}${shippingInfo.city}, Tamil Nadu, ${shippingInfo.postalCode}
    `.trim();

    const message = `
Hello ${COMPANY_NAME}, I would like to place an order.
---------------------------
*Order Summary:*
${productDetails}
---------------------------
*Total Amount: ₹${total.toFixed(2)}*
---------------------------
${shippingDetails}
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    dispatch({ type: 'CLEAR_CART' });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products"
          className="mt-6 inline-block bg-brand-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-green-dark transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      <form onSubmit={handleOrderViaWhatsApp} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items & Shipping Form */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b">
                        <div className="flex items-center space-x-4">
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-medium text-lg">{item.quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                    className="w-8 h-8 flex items-center justify-center font-bold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                            <p className="font-semibold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => handleRemoveItem(item.id)} type="button" className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none">&times;</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="firstName" placeholder="First Name" onChange={handleShippingChange} required className="p-2 border rounded"/>
                    <input name="lastName" placeholder="Last Name" onChange={handleShippingChange} required className="p-2 border rounded"/>
                    <input name="email" type="email" placeholder="Email" onChange={handleShippingChange} required className="p-2 border rounded"/>
                    <input name="phone" type="tel" placeholder="Phone" onChange={handleShippingChange} required className="p-2 border rounded"/>
                    <input name="address1" placeholder="Address Line 1" onChange={handleShippingChange} required className="sm:col-span-2 p-2 border rounded"/>
                    <input name="address2" placeholder="Address Line 2 (Optional)" onChange={handleShippingChange} className="sm:col-span-2 p-2 border rounded"/>
                    <input name="city" placeholder="City" onChange={handleShippingChange} required className="p-2 border rounded"/>
                    <input name="state" value="Tamil Nadu" disabled className="p-2 border rounded bg-gray-100"/>
                    <input name="postalCode" placeholder="Postal Code" onChange={handleShippingChange} required className="p-2 border rounded"/>
                </div>
            </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
            <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
            <button type="submit" className="w-full mt-6 bg-brand-green text-white py-3 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors">
                Order via WhatsApp
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CartPage;