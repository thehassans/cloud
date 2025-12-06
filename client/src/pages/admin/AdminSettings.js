import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, Palette, Mail, CreditCard } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    site_name: 'Magnetic Clouds',
    site_description: 'Premium Hosting & Domain Provider',
    support_email: 'support@magneticclouds.com',
    support_phone: '+880 1234-567890',
    theme: 'gradient',
    default_currency: 'USD',
    default_language: 'en',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <>
      <Helmet><title>Settings - Admin - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <button onClick={handleSave} disabled={loading} className="btn-gradient">
            {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span> : <span className="flex items-center gap-2"><Save className="w-4 h-4" />Save Changes</span>}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <div className="glass-card p-2 space-y-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                    <input type="text" value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                    <textarea value={settings.site_description} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} className="input-field" rows={3} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
                      <input type="email" value={settings.support_email} onChange={(e) => setSettings({ ...settings, support_email: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Support Phone</label>
                      <input type="tel" value={settings.support_phone} onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })} className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Appearance Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Theme Style</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${settings.theme === 'gradient' ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/30'}`}>
                        <input type="radio" name="theme" value="gradient" checked={settings.theme === 'gradient'} onChange={(e) => setSettings({ ...settings, theme: e.target.value })} className="hidden" />
                        <div className="text-center">
                          <div className="w-full h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 mb-2" />
                          <span className="text-white font-medium">Gradient</span>
                        </div>
                      </label>
                      <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${settings.theme === 'solid' ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/30'}`}>
                        <input type="radio" name="theme" value="solid" checked={settings.theme === 'solid'} onChange={(e) => setSettings({ ...settings, theme: e.target.value })} className="hidden" />
                        <div className="text-center">
                          <div className="w-full h-8 rounded-lg bg-primary-500 mb-2" />
                          <span className="text-white font-medium">Solid</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Default Language</label>
                      <select value={settings.default_language} onChange={(e) => setSettings({ ...settings, default_language: e.target.value })} className="input-field">
                        <option value="en">English</option>
                        <option value="bn">বাংলা</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
                      <select value={settings.default_currency} onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })} className="input-field">
                        <option value="USD">USD ($)</option>
                        <option value="BDT">BDT (৳)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Email Settings</h2>
                  <p className="text-gray-400">Configure SMTP settings in your .env file for email functionality.</p>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Payment Settings</h2>
                  <p className="text-gray-400">Configure Stripe API keys in your .env file for payment processing.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
