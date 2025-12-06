import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CreditCard, Tag, Lock, Check } from 'lucide-react';
import { useCartStore, useAuthStore } from '../../store/useStore';
import { checkoutAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, couponCode, couponDiscount, applyCoupon, removeCoupon, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data } = await checkoutAPI.validateCoupon(couponInput, getSubtotal());
      applyCoupon(couponInput, data.discount_amount);
      toast.success(`Coupon applied! You saved ${formatPrice(data.discount_amount)}`);
      setCouponInput('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          type: item.type,
          product_id: item.product_id,
          billing_cycle: item.billing_cycle,
          quantity: item.quantity || 1,
          domain_name: item.domain_name,
          action: item.action,
          years: item.years
        })),
        coupon_code: couponCode
      };

      const { data } = await checkoutAPI.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data.order.order_number}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet><title>Checkout - Magnetic Clouds</title></Helmet>

      <section className="relative pt-32 pb-20 min-h-screen">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Order Details</h2>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start py-3 border-b border-white/10 last:border-0">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-500 text-sm capitalize">{item.type} • {item.billing_cycle}</p>
                          {item.domain_name && <p className="text-primary-400 text-sm">{item.domain_name}</p>}
                        </div>
                        <p className="text-white font-semibold">{formatPrice(item.price * (item.quantity || 1))}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Promo Code</h2>
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 text-green-400">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">{couponCode}</span>
                        <span className="text-sm">(-{formatPrice(couponDiscount)})</span>
                      </div>
                      <button onClick={removeCoupon} className="text-gray-400 hover:text-white text-sm">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Enter promo code" className="input-field flex-1" />
                      <button onClick={handleApplyCoupon} disabled={validatingCoupon} className="btn-outline">{validatingCoupon ? 'Checking...' : 'Apply'}</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <div className="glass-card p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-white mb-6">Payment Summary</h2>
                  
                  {isAuthenticated && (
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
                      <p className="text-gray-400 text-sm">Billing to:</p>
                      <p className="text-white font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  <button onClick={handleCheckout} disabled={loading} className="btn-gradient w-full justify-center mb-4">
                    {loading ? (
                      <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span>
                    ) : (
                      <span className="flex items-center gap-2"><CreditCard className="w-5 h-5" />Complete Order</span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Secure checkout powered by Stripe</span>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-primary-500/10 border border-primary-500/30">
                    <div className="flex items-center gap-2 text-primary-400 mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">45-Day Money-Back Guarantee</span>
                    </div>
                    <p className="text-gray-400 text-sm">Not satisfied? Get a full refund within 45 days, no questions asked.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
