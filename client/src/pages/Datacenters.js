import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Server, Shield, Zap, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { servicesAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Datacenters = () => {
  const [datacenters, setDatacenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDC, setSelectedDC] = useState(null);

  useEffect(() => {
    const loadDatacenters = async () => {
      try {
        const { data } = await servicesAPI.getDatacenters();
        setDatacenters(data.datacenters || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDatacenters();
  }, []);

  const features = [
    { icon: Server, title: 'Tier 4 Data Centers', desc: 'Enterprise-grade facilities with redundant systems' },
    { icon: Shield, title: 'Physical Security', desc: '24/7 security, biometric access, CCTV monitoring' },
    { icon: Zap, title: 'Redundant Power', desc: 'N+1 power redundancy with UPS and generators' },
    { icon: Globe, title: 'Global Network', desc: 'Low latency connections worldwide' },
  ];

  return (
    <>
      <Helmet>
        <title>Global Datacenters - Magnetic Clouds</title>
        <meta name="description" content="Our global network of Tier 4 datacenters ensures maximum uptime and low latency for your applications." />
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-6">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Global Infrastructure</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Our Global <span className="gradient-text">Datacenters</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Strategically located datacenters around the world to ensure low latency and maximum performance for your applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card overflow-hidden" style={{ height: '500px' }}>
            {!loading && datacenters.length > 0 && (
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {datacenters.map((dc) => (
                  <Marker
                    key={dc.id}
                    position={[dc.latitude, dc.longitude]}
                    eventHandlers={{
                      click: () => setSelectedDC(dc),
                    }}
                  >
                    <Popup>
                      <div className="text-slate-900 p-2">
                        <h3 className="font-bold">{dc.name}</h3>
                        <p className="text-sm">{dc.city}, {dc.country}</p>
                        <p className="text-xs text-gray-500 mt-1">{dc.tier}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Datacenter List */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {datacenters.map((dc, index) => (
              <motion.div
                key={dc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-6 cursor-pointer transition-all ${selectedDC?.id === dc.id ? 'border-primary-500/50' : ''}`}
                onClick={() => setSelectedDC(dc)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{dc.name}</h3>
                    <p className="text-gray-400 text-sm">{dc.city}, {dc.country}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">{dc.tier}</span>
                      <span className="text-xs text-gray-500">Code: {dc.code}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Infrastructure Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Datacenters;
