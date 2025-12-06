import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, User, Clock } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const TicketDetails = () => {
  const { ticketNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTicket();
  }, [ticketNumber]);

  const loadTicket = async () => {
    try {
      const { data } = await userAPI.getTicket(ticketNumber);
      setTicket(data.ticket);
      setReplies(data.replies || []);
    } catch (err) {
      toast.error('Ticket not found');
      navigate('/dashboard/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await userAPI.replyTicket(ticketNumber, message);
      toast.success('Reply sent');
      setMessage('');
      loadTicket();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { open: 'bg-green-500/20 text-green-400', answered: 'bg-blue-500/20 text-blue-400', customer_reply: 'bg-yellow-500/20 text-yellow-400', closed: 'bg-gray-500/20 text-gray-400' };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  }

  return (
    <>
      <Helmet><title>Ticket #{ticketNumber} - Magnetic Clouds</title></Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => navigate('/dashboard/tickets')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>

        {/* Ticket Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{ticket?.subject}</h1>
              <p className="text-gray-500 text-sm">Ticket #{ticket?.ticket_number}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(ticket?.status)}`}>{ticket?.status?.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>Department: <span className="text-white capitalize">{ticket?.department}</span></span>
            <span>Priority: <span className="text-white capitalize">{ticket?.priority}</span></span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket?.created_at).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="space-y-4">
          {/* Original Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-gray-500 text-xs">{new Date(ticket?.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{ticket?.message}</p>
          </motion.div>

          {/* Replies */}
          {replies.map((reply, index) => (
            <motion.div key={reply.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (index + 1) }} className={`glass-card p-6 ${reply.is_staff ? 'border-l-4 border-primary-500' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reply.is_staff ? 'bg-primary-500/20' : 'bg-gray-500/20'}`}>
                  <User className={`w-5 h-5 ${reply.is_staff ? 'text-primary-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="text-white font-medium">{reply.user_name || 'Support Team'}</p>
                  <p className="text-gray-500 text-xs">{new Date(reply.created_at).toLocaleString()}</p>
                </div>
                {reply.is_staff && <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 ml-auto">Staff</span>}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{reply.message}</p>
            </motion.div>
          ))}
        </div>

        {/* Reply Form */}
        {ticket?.status !== 'closed' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Reply to Ticket</h3>
            <form onSubmit={handleReply} className="space-y-4">
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field min-h-[150px]" placeholder="Type your reply..." required />
              <button type="submit" disabled={sending} className="btn-gradient">
                {sending ? <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span> : <span className="flex items-center gap-2"><Send className="w-5 h-5" />Send Reply</span>}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default TicketDetails;
