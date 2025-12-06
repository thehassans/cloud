import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Server, Plus, Edit, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState('hosting');
  const tabs = ['hosting', 'vps', 'cloud', 'dedicated', 'domains', 'ssl', 'email', 'backup'];

  return (
    <>
      <Helmet><title>Services & Plans - Admin - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Services & Plans</h1>
          <button className="btn-gradient"><Plus className="w-4 h-4 mr-2" /><span>Add Plan</span></button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Plans List */}
        <div className="glass-card p-6">
          <p className="text-gray-400 text-center py-12">
            Select a category to manage {activeTab} plans.<br />
            <span className="text-sm">Plan management interface coming soon.</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminServices;
