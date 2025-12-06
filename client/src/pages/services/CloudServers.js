import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, Cloud, Cpu, MemoryStick, HardDrive, Network, Zap } from 'lucide-react';
import { servicesAPI } from '../../services/api';
import { useCartStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const CloudServers = () => {
  const { addItem } = useCartStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data } = await servicesAPI.getCloudPlans();
        setPlans(data.plans || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  const getPrice = (plan) => billingCycle === 'monthly' ? plan.price_monthly : plan.price_annually / 12;

  const features = [
    { icon: Zap, title: 'Auto-Scaling', desc: 'Scale resources automatically' },
    { icon: Cpu, title: 'High Performance', desc: 'Latest AMD/Intel CPUs' },
    { icon: MemoryStick, title: 'Instant Deploy', desc: 'Ready in 60 seconds' },
    { icon: HardDrive, title: 'NVMe Storage', desc: 'Ultra-fast I/O' },
    { icon: Network, title: 'Global Network', desc: 'Low latency worldwide' },
    { icon: Cloud, title: 'Load Balancing', desc: 'Distribute traffic efficiently' },
  ];

  return (
    <>
      <Helmet>
        <title>Cloud Servers - Magnetic Clouds</title>
        <meta name="description" content="Scalable cloud servers with auto-scaling, instant deployment, and global network. Starting at $19.99/month." />
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 mb-6">
              <Cloud className="w-4 h-4" />
              <span className="text-sm font-medium">Cloud Servers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Scalable <span className="gradient-text">Cloud Servers</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Deploy scalable cloud infrastructure in seconds. Auto-scale resources based on your traffic demands.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">Cloud Plans</h2>
            <div className="inline-flex items-center gap-4 p-1 rounded-xl bg-slate-800 border border-white/10">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'monthly' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}>Monthly</button>
              <button onClick={() => setBillingCycle('annually')} className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${billingCycle === 'annually' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}>Annually<span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Save 20%</span></button>
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
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-orange-400 flex-shrink-0" /><span>{plan.vcpu} vCPU Core(s)</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-orange-400 flex-shrink-0" /><span>{plan.ram_gb}GB RAM</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-orange-400 flex-shrink-0" /><span>{plan.storage_gb}GB NVMe SSD</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-orange-400 flex-shrink-0" /><span>{plan.bandwidth_tb}TB Bandwidth</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-orange-400 flex-shrink-0" /><span>Auto-Scaling</span></li>
                  </ul>
                  <button onClick={() => { addItem({ type: 'cloud', product_id: plan.id, name: plan.name, price: billingCycle === 'monthly' ? plan.price_monthly : plan.price_annually, billing_cycle: billingCycle }); toast.success(`${plan.name} added`); }} className={plan.is_popular ? 'btn-gradient w-full' : 'btn-outline w-full'}><span>Deploy Now</span></button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CloudServers;
