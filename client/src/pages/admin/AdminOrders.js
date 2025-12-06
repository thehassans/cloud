import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Eye, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadOrders(); }, [filter]);

  const loadOrders = async () => {
    try {
      const { data } = await adminAPI.getOrders({ status: filter !== 'all' ? filter : undefined });
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  const getStatusColor = (status) => {
    const colors = { completed: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-blue-500/20 text-blue-400', cancelled: 'bg-red-500/20 text-red-400' };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <>
      <Helmet><title>Orders - Admin - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === status ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <motion.tr key={order.order_number} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5">
                      <td className="px-6 py-4"><span className="text-white font-medium">#{order.order_number}</span></td>
                      <td className="px-6 py-4">
                        <p className="text-white">{order.user_name}</p>
                        <p className="text-gray-500 text-sm">{order.user_email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{order.items_count} item(s)</td>
                      <td className="px-6 py-4 text-white font-semibold">{formatPrice(order.total_amount)}</td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Eye className="w-4 h-4" /></button>
                          {order.status === 'pending' && <button className="p-2 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all"><Check className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
