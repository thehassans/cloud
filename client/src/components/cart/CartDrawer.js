import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useUIStore } from '../../store/useStore';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

const CartDrawer = () => {
  const { isCartOpen, toggleCart } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, couponDiscount } = useCartStore();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
                  {items.length}
                </span>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mb-6">Add some services to get started</p>
                  <button
                    onClick={toggleCart}
                    className="btn-gradient"
                  >
                    <span>Browse Services</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass-card p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{item.name}</p>
                          <p className="text-gray-400 text-sm capitalize">{item.type}</p>
                          {item.domain_name && (
                            <p className="text-primary-400 text-sm">{item.domain_name}</p>
                          )}
                          {item.billing_cycle && (
                            <p className="text-gray-500 text-xs mt-1 capitalize">
                              Billed {item.billing_cycle}
                            </p>
                          )}
                        </div>
                        <p className="text-white font-semibold">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        {item.type === 'domain' ? (
                          <span className="text-gray-400 text-sm">
                            {item.years || 1} year(s)
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                              className="p-1 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                              className="p-1 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-white text-lg font-bold pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={toggleCart}
                    className="btn-gradient w-full text-center block"
                  >
                    <span>Proceed to Checkout</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={toggleCart}
                    className="btn-outline w-full text-center block"
                  >
                    View Full Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
