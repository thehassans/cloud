import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Clock } from 'lucide-react';
import { userAPI } from '../../services/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const { data } = await userAPI.getTickets();
        setTickets(data.tickets || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

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
      <Helmet><title>Support Tickets - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Support Tickets</h2>
          <Link to="/dashboard/tickets/new" className="btn-gradient"><Plus className="w-4 h-4 mr-2" /><span>New Ticket</span></Link>
        </div>

        {loading ? (
          <div className="glass-card overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-white/10 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-700" />
                    <div><div className="h-4 w-32 bg-gray-700 rounded mb-2" /><div className="h-3 w-24 bg-gray-700 rounded" /></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-white/5 text-gray-400 text-sm font-medium">
              <span>Subject</span>
              <span>Department</span>
              <span>Priority</span>
              <span>Last Update</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-white/10">
              {tickets.map((ticket, index) => (
                <motion.div key={ticket.ticket_number} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={`/dashboard/tickets/${ticket.ticket_number}`} className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 hover:bg-white/5 transition-colors items-center">
                    <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <span className="text-white font-medium block">{ticket.subject}</span>
                        <span className="text-gray-500 text-xs">#{ticket.ticket_number}</span>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm hidden md:block capitalize">{ticket.department}</div>
                    <div className={`text-sm hidden md:block capitalize font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</div>
                    <div className="text-gray-400 text-sm hidden md:flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </div>
                    <div><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No Tickets</h3>
            <p className="text-gray-400 mb-6">You haven't opened any support tickets yet.</p>
            <Link to="/dashboard/tickets/new" className="btn-gradient inline-flex"><Plus className="w-4 h-4 mr-2" /><span>Open New Ticket</span></Link>
          </div>
        )}
      </div>
    </>
  );
};

export default MyTickets;
