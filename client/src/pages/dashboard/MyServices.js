import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Server, Globe, Shield, Mail, Database, Clock, Settings, ExternalLink } from 'lucide-react';
import { userAPI } from '../../services/api';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await userAPI.getServices();
        setServices(data.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const getIcon = (type) => {
    const icons = { hosting: Server, domain: Globe, ssl: Shield, email: Mail, backup: Database, vps: Server, cloud: Server, dedicated: Server };
    return icons[type] || Server;
  };

  const getStatusColor = (status) => {
    const colors = { active: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400', suspended: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-gray-400' };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const filteredServices = filter === 'all' ? services : services.filter(s => s.type === filter);

  const types = ['all', ...new Set(services.map(s => s.type))];

  return (
    <>
      <Helmet><title>My Services - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-700 mb-4" />
                <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const Icon = getIcon(service.type);
              return (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card-hover p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{service.domain || service.description}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Expires: {new Date(service.expires_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-outline flex-1 text-sm py-2">
                      <Settings className="w-4 h-4 mr-1" /> Manage
                    </button>
                    {service.domain && (
                      <a href={`https://${service.domain}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Server className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No Services Found</h3>
            <p className="text-gray-400 mb-6">You don't have any active services yet.</p>
            <a href="/hosting" className="btn-gradient inline-flex"><span>Browse Services</span></a>
          </div>
        )}
      </div>
    </>
  );
};

export default MyServices;
