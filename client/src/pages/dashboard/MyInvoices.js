import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Download, CreditCard } from 'lucide-react';
import { userAPI } from '../../services/api';

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const { data } = await userAPI.getInvoices();
        setInvoices(data.invoices || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, []);

  const getStatusColor = (status) => {
    const colors = { paid: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400', overdue: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-gray-400' };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <>
      <Helmet><title>My Invoices - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        {loading ? (
          <div className="glass-card overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-white/10 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-700" />
                    <div><div className="h-4 w-24 bg-gray-700 rounded mb-2" /><div className="h-3 w-16 bg-gray-700 rounded" /></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : invoices.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-white/5 text-gray-400 text-sm font-medium">
              <span>Invoice</span>
              <span>Date</span>
              <span>Due Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-white/10">
              {invoices.map((invoice, index) => (
                <motion.div key={invoice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">#{invoice.invoice_number}</span>
                  </div>
                  <div className="text-gray-400 text-sm hidden md:block">{new Date(invoice.created_at).toLocaleDateString()}</div>
                  <div className="text-gray-400 text-sm hidden md:block">{new Date(invoice.due_date).toLocaleDateString()}</div>
                  <div className="text-white font-semibold text-right md:text-left">{formatPrice(invoice.total_amount)}</div>
                  <div><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>{invoice.status}</span></div>
                  <div className="flex items-center gap-2">
                    {invoice.status === 'pending' && (
                      <button className="btn-gradient text-sm py-2 px-3"><CreditCard className="w-4 h-4 mr-1" /> Pay</button>
                    )}
                    <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No Invoices</h3>
            <p className="text-gray-400">You don't have any invoices yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyInvoices;
