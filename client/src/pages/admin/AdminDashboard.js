import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, ShoppingCart, DollarSign, MessageSquare, TrendingUp, Server, Globe, Clock } from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await adminAPI.getDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.total_users || 0, change: '+12%', color: 'bg-blue-500/10 text-blue-400' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats?.total_orders || 0, change: '+8%', color: 'bg-green-500/10 text-green-400' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats?.total_revenue?.toLocaleString() || 0}`, change: '+15%', color: 'bg-yellow-500/10 text-yellow-400' },
    { icon: MessageSquare, label: 'Open Tickets', value: stats?.open_tickets || 0, change: '-5%', color: 'bg-purple-500/10 text-purple-400' },
  ];

  const quickStats = [
    { icon: Server, label: 'Active Services', value: stats?.active_services || 0 },
    { icon: Globe, label: 'Domains', value: stats?.total_domains || 0 },
    { icon: Clock, label: 'Pending Orders', value: stats?.pending_orders || 0 },
    { icon: TrendingUp, label: 'Monthly Growth', value: '15%' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard - Magnetic Clouds</title></Helmet>

      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your platform statistics</p>
        </motion.div>

        {/* Main Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-700 mb-4" />
                <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
                <div className="h-8 w-16 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-gray-400 text-xs">{stat.label}</p>
                      <p className="text-white font-bold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {stats?.recent_orders?.slice(0, 5).map((order) => (
                <div key={order.order_number} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">#{order.order_number}</p>
                    <p className="text-gray-500 text-sm">{order.user_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${order.total_amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{order.status}</span>
                  </div>
                </div>
              )) || <p className="text-gray-500">No recent orders</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Tickets</h2>
            <div className="space-y-4">
              {stats?.recent_tickets?.slice(0, 5).map((ticket) => (
                <div key={ticket.ticket_number} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{ticket.subject}</p>
                    <p className="text-gray-500 text-sm">#{ticket.ticket_number}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-green-500/20 text-green-400' : ticket.status === 'answered' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{ticket.status}</span>
                </div>
              )) || <p className="text-gray-500">No recent tickets</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
