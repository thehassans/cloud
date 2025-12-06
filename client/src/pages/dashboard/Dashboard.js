import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Server, ShoppingCart, FileText, MessageSquare, Plus, ArrowRight, Clock } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await userAPI.getDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const statCards = [
    { icon: Server, label: 'Active Services', value: stats?.active_services || 0, color: 'bg-blue-500/10 text-blue-400', link: '/dashboard/services' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats?.total_orders || 0, color: 'bg-green-500/10 text-green-400', link: '/dashboard/orders' },
    { icon: FileText, label: 'Pending Invoices', value: stats?.pending_invoices || 0, color: 'bg-yellow-500/10 text-yellow-400', link: '/dashboard/invoices' },
    { icon: MessageSquare, label: 'Open Tickets', value: stats?.open_tickets || 0, color: 'bg-purple-500/10 text-purple-400', link: '/dashboard/tickets' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Magnetic Clouds</title>
      </Helmet>

      <div className="space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.first_name}! 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your account.</p>
        </motion.div>

        {/* Stats */}
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
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Link to={stat.link} className="glass-card-hover p-6 block">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/hosting" className="glass-card p-4 flex items-center gap-4 hover:border-primary-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-medium">Order New Service</p>
                <p className="text-gray-500 text-sm">Browse our products</p>
              </div>
            </Link>
            <Link to="/dashboard/tickets/new" className="glass-card p-4 flex items-center gap-4 hover:border-primary-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Open Support Ticket</p>
                <p className="text-gray-500 text-sm">Get help from our team</p>
              </div>
            </Link>
            <Link to="/domains" className="glass-card p-4 flex items-center gap-4 hover:border-primary-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Register Domain</p>
                <p className="text-gray-500 text-sm">Find your perfect domain</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass-card overflow-hidden">
            {stats?.recent_orders?.length > 0 ? (
              <div className="divide-y divide-white/10">
                {stats.recent_orders.map((order) => (
                  <Link key={order.order_number} to={`/dashboard/orders/${order.order_number}`} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">#{order.order_number}</p>
                        <p className="text-gray-500 text-sm">{order.items_count} item(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${order.total_amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent orders</p>
                <Link to="/hosting" className="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block">
                  Browse our services
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
