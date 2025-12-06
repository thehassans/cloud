import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, HardDrive, Cpu, MemoryStick, Network, Shield, Clock } from 'lucide-react';
import { servicesAPI } from '../../services/api';
import { useCartStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const VPSServers = () => {
  const { addItem } = useCartStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data } = await servicesAPI.getVPSPlans();
      setPlans(data.plans || []);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const getPrice = (plan) => billingCycle === 'monthly' ? plan.price_monthly : plan.price_annually / 12;

  const features = [
    { icon: Cpu, title: 'Dedicated vCPU', desc: 'High-performance processors' },
    { icon: MemoryStick, title: 'DDR4 RAM', desc: 'Fast memory allocation' },
    { icon: HardDrive, title: 'NVMe SSD', desc: 'Ultra-fast storage' },
    { icon: Network, title: 'Premium Network', desc: '1Gbps port speed' },
    { icon: Shield, title: 'DDoS Protection', desc: 'Enterprise-grade security' },
    { icon: Clock, title: 'Full Root Access', desc: 'Complete server control' },
  ];

  return (
    <>
      <Helmet>
        <title>VPS Servers - Magnetic Clouds</title>
        <meta name="description" content="High-performance VPS servers with full root access, NVMe SSD storage, and DDoS protection. Starting at $9.99/month." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-6">
              <HardDrive className="w-4 h-4" />
              <span className="text-sm font-medium">VPS Servers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Powerful <span className="gradient-text">VPS Hosting</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get full root access with our high-performance virtual private servers. 
              Perfect for growing businesses and developers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">VPS Plans</h2>
            <div className="inline-flex items-center gap-4 p-1 rounded-xl bg-slate-800 border border-white/10">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'monthly' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}>Monthly</button>
              <button onClick={() => setBillingCycle('annually')} className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${billingCycle === 'annually' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                Annually
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Save 20%</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`pricing-card ${plan.is_popular ? 'popular' : ''}`}>
                  {plan.is_popular && <div className="absolute top-0 right-0 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-bl-xl rounded-tr-2xl">Popular</div>}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">{formatPrice(getPrice(plan))}</span>
                    <span className="text-gray-400 pb-1">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{plan.vcpu} vCPU Core(s)</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{plan.ram_gb}GB RAM</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{plan.storage_gb}GB NVMe SSD</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{plan.bandwidth_tb}TB Bandwidth</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>Full Root Access</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>DDoS Protection</span></li>
                  </ul>
                  <button onClick={() => { addItem({ type: 'vps', product_id: plan.id, name: plan.name, price: billingCycle === 'monthly' ? plan.price_monthly : plan.price_annually, billing_cycle: billingCycle }); toast.success(`${plan.name} added to cart`); }} className={plan.is_popular ? 'btn-gradient w-full' : 'btn-outline w-full'}><span>Get Started</span></button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VPSServers;
