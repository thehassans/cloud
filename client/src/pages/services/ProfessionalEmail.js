import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, Mail, Shield, Calendar, Users, Cloud } from 'lucide-react';
import { servicesAPI } from '../../services/api';
import { useCartStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const ProfessionalEmail = () => {
  const { addItem } = useCartStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data } = await servicesAPI.getEmailPlans();
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

  const features = [
    { icon: Mail, title: 'Custom Domain', desc: 'you@yourdomain.com' },
    { icon: Shield, title: 'Spam Protection', desc: 'Advanced filtering' },
    { icon: Calendar, title: 'Calendar & Contacts', desc: 'Stay organized' },
    { icon: Cloud, title: 'Cloud Storage', desc: 'Access anywhere' },
  ];

  return (
    <>
      <Helmet>
        <title>Professional Email - Magnetic Clouds</title>
        <meta name="description" content="Business email solutions with your domain. Spam protection, calendar, and cloud storage included." />
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Professional Email</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              <span className="gradient-text">Professional Email</span> for Your Business
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Make a professional impression with email at your domain. Includes spam protection and collaboration tools.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-pink-400" />
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
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">Email Plans</h2>
          </div>

          {loading ? (
            <div className="flex justify-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`pricing-card ${plan.is_popular ? 'popular' : ''}`}>
                  {plan.is_popular && <div className="absolute top-0 right-0 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-bl-xl rounded-tr-2xl">Popular</div>}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">{formatPrice(plan.price_monthly)}</span>
                    <span className="text-gray-400 pb-1">/user/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-pink-400 flex-shrink-0" /><span>{plan.storage_gb}GB Storage</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-pink-400 flex-shrink-0" /><span>Custom Domain Email</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-pink-400 flex-shrink-0" /><span>Spam Protection</span></li>
                    <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-pink-400 flex-shrink-0" /><span>Mobile Apps</span></li>
                  </ul>
                  <button onClick={() => { addItem({ type: 'email', product_id: plan.id, name: plan.name, price: plan.price_monthly, billing_cycle: 'monthly' }); toast.success(`${plan.name} added`); }} className={plan.is_popular ? 'btn-gradient w-full' : 'btn-outline w-full'}><span>Get Started</span></button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProfessionalEmail;
