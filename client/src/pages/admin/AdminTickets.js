import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, Eye, Check, Clock } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadTickets(); }, [filter]);

  const loadTickets = async () => {
    try {
      const { data } = await adminAPI.getTickets({ status: filter !== 'all' ? filter : undefined });
      setTickets(data.tickets || []);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { open: 'bg-green-500/20 text-green-400', answered: 'bg-blue-500/20 text-blue-400', customer_reply: 'bg-yellow-500/20 text-yellow-400', closed: 'bg-gray-500/20 text-gray-400' };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = { high: 'text-red-400', medium: 'text-yellow-400', low: 'text-green-400' };
    return colors[priority] || 'text-gray-400';
  };

  return (
    <>
      <Helmet><title>Support Tickets - Admin - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
          <div className="flex gap-2">
            {['all', 'open', 'answered', 'customer_reply', 'closed'].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === status ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
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
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ticket</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Updated</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tickets.map((ticket) => (
                    <motion.tr key={ticket.ticket_number} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{ticket.subject}</p>
                        <p className="text-gray-500 text-sm">#{ticket.ticket_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{ticket.user_name}</p>
                        <p className="text-gray-500 text-sm">{ticket.user_email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 capitalize">{ticket.department}</td>
                      <td className="px-6 py-4"><span className={`font-medium capitalize ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span></td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span></td>
                      <td className="px-6 py-4 text-gray-400 text-sm flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.updated_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Eye className="w-4 h-4" /></button>
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

export default AdminTickets;
