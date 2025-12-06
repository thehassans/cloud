import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Clock } from 'lucide-react';
import { userAPI } from '../../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await userAPI.getOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = { completed: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-blue-500/20 text-blue-400', cancelled: 'bg-red-500/20 text-red-400', refunded: 'bg-gray-500/20 text-gray-400' };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <>
      <Helmet><title>My Orders - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        {loading ? (
          <div className="glass-card overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-white/10 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-700" />
                    <div>
                      <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
                      <div className="h-3 w-16 bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-white/5 text-gray-400 text-sm font-medium">
              <span>Order</span>
              <span>Date</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-white/10">
              {orders.map((order, index) => (
                <motion.div key={order.order_number} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={`/dashboard/orders/${order.order_number}`} className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 hover:bg-white/5 transition-colors items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary-400" />
                      </div>
                      <span className="text-white font-medium">#{order.order_number}</span>
                    </div>
                    <div className="text-gray-400 text-sm hidden md:block">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-gray-400 text-sm hidden md:block">
                      {order.items?.length || 0} item(s)
                    </div>
                    <div className="text-white font-semibold text-right md:text-left">
                      {formatPrice(order.total_amount)}
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <a href="/hosting" className="btn-gradient inline-flex"><span>Browse Services</span></a>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
