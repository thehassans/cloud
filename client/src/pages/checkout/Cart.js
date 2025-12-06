import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '../../store/useStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, couponCode, couponDiscount } = useCartStore();

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <>
      <Helmet><title>Shopping Cart - Magnetic Clouds</title></Helmet>

      <section className="relative pt-32 pb-20 min-h-screen">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-white mb-8">Shopping Cart</h1>

            {items.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Browse our services and add items to your cart</p>
                <Link to="/hosting" className="btn-gradient inline-flex"><span>Browse Services</span></Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-lg">{item.name}</p>
                          <p className="text-gray-400 text-sm capitalize">{item.type}</p>
                          {item.domain_name && <p className="text-primary-400 text-sm mt-1">{item.domain_name}</p>}
                          {item.billing_cycle && <p className="text-gray-500 text-xs mt-1 capitalize">Billed {item.billing_cycle}</p>}
                        </div>
                        <p className="text-white font-bold text-xl">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        {item.type !== 'domain' ? (
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(index, (item.quantity || 1) - 1)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium w-8 text-center">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(index, (item.quantity || 1) + 1)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">{item.years || 1} year registration</span>
                        )}
                        <button onClick={() => removeItem(index)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="glass-card p-6 sticky top-24">
                    <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatPrice(getSubtotal())}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {couponCode}</span>
                          <span>-{formatPrice(couponDiscount)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-4 flex justify-between text-white text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                    <Link to="/checkout" className="btn-gradient w-full text-center block mb-3">
                      <span className="flex items-center justify-center gap-2">Proceed to Checkout <ArrowRight className="w-5 h-5" /></span>
                    </Link>
                    <Link to="/hosting" className="btn-outline w-full text-center block">Continue Shopping</Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Cart;
