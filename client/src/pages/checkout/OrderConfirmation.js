import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Clock, CreditCard } from 'lucide-react';
import { userAPI } from '../../services/api';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await userAPI.getOrder(orderNumber);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderNumber]);

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Order Confirmed - Magnetic Clouds</title></Helmet>

      <section className="relative pt-32 pb-20 min-h-screen">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {/* Success Icon */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>

            <h1 className="text-3xl font-display font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 mb-8">Thank you for your order. We've sent a confirmation email to your inbox.</p>

            {/* Order Details */}
            <div className="glass-card p-6 text-left mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-gray-400 text-sm">Order Number</p>
                  <p className="text-white font-bold text-lg">#{orderNumber}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  order?.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  order?.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {order?.status || 'Processing'}
                </span>
              </div>

              {order?.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.product_name}</p>
                    <p className="text-gray-500 text-sm capitalize">{item.product_type}</p>
                  </div>
                  <p className="text-white">{formatPrice(item.total_price)}</p>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-white/10">
                {order?.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400 mb-2">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total Paid</span>
                  <span>{formatPrice(order?.total_amount || 0)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="glass-card p-6 text-left mb-8">
              <h3 className="text-white font-semibold mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Service Activation</p>
                    <p className="text-gray-400 text-sm">Your services will be activated within a few minutes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Invoice & Receipt</p>
                    <p className="text-gray-400 text-sm">A detailed invoice has been sent to your email.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard/services" className="btn-gradient">
                <span className="flex items-center gap-2">View My Services <ArrowRight className="w-5 h-5" /></span>
              </Link>
              <Link to="/dashboard/orders" className="btn-outline">View All Orders</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default OrderConfirmation;
