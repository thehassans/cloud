import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Server,
  Cloud,
  HardDrive,
  Globe,
  Shield,
  Mail,
  Database,
  Zap,
  Clock,
  Headphones,
  RefreshCw,
  Check,
  ArrowRight,
  Star,
  ChevronRight,
  Search
} from 'lucide-react';
import { servicesAPI, domainsAPI } from '../services/api';
import { useCartStore } from '../store/useStore';
import toast from 'react-hot-toast';

const Home = () => {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const [hostingPlans, setHostingPlans] = useState([]);
  const [popularTLDs, setPopularTLDs] = useState([]);
  const [domainSearch, setDomainSearch] = useState('');
  const [domainResults, setDomainResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hostingRes, tldsRes] = await Promise.all([
        servicesAPI.getHostingPlans(),
        domainsAPI.getPopularTLDs()
      ]);
      setHostingPlans(hostingRes.data.plans || []);
      setPopularTLDs(tldsRes.data.tlds || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const searchDomain = async (e) => {
    e.preventDefault();
    if (!domainSearch.trim()) return;

    setSearching(true);
    try {
      const { data } = await domainsAPI.search(domainSearch);
      setDomainResults(data.results);
    } catch (err) {
      toast.error('Domain search failed');
    } finally {
      setSearching(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const services = [
    { icon: Server, title: t('services.web_hosting'), desc: t('services.web_hosting_desc'), path: '/hosting', color: 'from-blue-500 to-cyan-500' },
    { icon: HardDrive, title: t('services.vps'), desc: t('services.vps_desc'), path: '/vps', color: 'from-purple-500 to-pink-500' },
    { icon: Cloud, title: t('services.cloud'), desc: t('services.cloud_desc'), path: '/cloud', color: 'from-orange-500 to-red-500' },
    { icon: Server, title: t('services.dedicated'), desc: t('services.dedicated_desc'), path: '/dedicated', color: 'from-green-500 to-emerald-500' },
    { icon: Globe, title: t('services.domains'), desc: t('services.domains_desc'), path: '/domains', color: 'from-indigo-500 to-purple-500' },
    { icon: Shield, title: t('services.ssl'), desc: t('services.ssl_desc'), path: '/ssl', color: 'from-yellow-500 to-orange-500' },
    { icon: Mail, title: t('services.email'), desc: t('services.email_desc'), path: '/email', color: 'from-pink-500 to-rose-500' },
    { icon: Database, title: t('services.backup'), desc: t('services.backup_desc'), path: '/backup', color: 'from-teal-500 to-cyan-500' },
  ];

  const features = [
    { icon: Zap, title: t('features.speed'), desc: t('features.speed_desc') },
    { icon: Clock, title: t('features.uptime'), desc: t('features.uptime_desc') },
    { icon: Headphones, title: t('features.support'), desc: t('features.support_desc') },
    { icon: Shield, title: t('features.security'), desc: t('features.security_desc') },
    { icon: RefreshCw, title: t('features.money_back'), desc: t('features.money_back_desc') },
    { icon: Shield, title: t('features.free_ssl'), desc: t('features.free_ssl_desc') },
  ];

  return (
    <>
      <Helmet>
        <title>Magnetic Clouds - Premium Web Hosting & Domain Provider from Bangladesh</title>
        <meta name="description" content="Bangladesh's leading web hosting provider. Get blazing fast web hosting, VPS, cloud servers, dedicated servers, domain registration with 24/7 support." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 mb-8">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              {t('hero.title').split(' ').map((word, i) => (
                <span key={i} className={i === 0 || i === 1 ? 'gradient-text' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              {t('hero.subtitle')}
            </p>

            {/* Domain Search */}
            <form onSubmit={searchDomain} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  placeholder={t('domain.placeholder')}
                  className="w-full px-6 py-5 pr-36 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 text-lg transition-all"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-2 top-2 bottom-2 px-6 btn-gradient flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">{searching ? 'Searching...' : t('domain.search')}</span>
                </button>
              </div>
            </form>

            {/* Domain Results */}
            {domainResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto mb-8 glass-card p-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {domainResults.slice(0, 6).map((result) => (
                    <div
                      key={result.domain}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        result.available ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      <div>
                        <p className="text-white font-medium text-sm truncate">{result.domain}</p>
                        <p className={result.available ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                          {result.available ? formatPrice(result.price_register) : 'Taken'}
                        </p>
                      </div>
                      {result.available && (
                        <button
                          onClick={() => {
                            addItem({
                              type: 'domain',
                              product_id: 1,
                              name: result.domain,
                              domain_name: result.domain,
                              price: result.price_register,
                              action: 'register'
                            });
                            toast.success(`${result.domain} added to cart`);
                          }}
                          className="p-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Popular TLDs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {popularTLDs.slice(0, 6).map((tld) => (
                <div key={tld.tld} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white font-semibold">{tld.tld}</span>
                  <span className="text-primary-400 font-bold">{formatPrice(tld.price_register)}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/hosting" className="btn-gradient text-lg px-8 py-4">
                <span>{t('hero.cta')}</span>
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/pricing" className="btn-outline text-lg px-8 py-4">
                {t('hero.secondary_cta')}
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="text-gray-500 text-sm mt-10">
              {t('hero.trusted')}
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-white/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to establish your online presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={service.path}
                  className="block glass-card-hover p-6 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400">{service.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary-400 group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">{t('common.learn_more')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`pricing-card ${plan.is_popular ? 'popular' : ''}`}
              >
                {plan.is_popular && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-bl-xl rounded-tr-2xl">
                    {t('pricing.popular')}
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{formatPrice(plan.price_monthly)}</span>
                  <span className="text-gray-400 pb-1">{t('pricing.per_month')}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {(typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || []).slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-primary-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    addItem({
                      type: 'hosting',
                      product_id: plan.id,
                      name: plan.name,
                      price: plan.price_monthly,
                      billing_cycle: 'monthly'
                    });
                    toast.success(`${plan.name} plan added to cart`);
                  }}
                  className={plan.is_popular ? 'btn-gradient w-full' : 'btn-outline w-full'}
                >
                  <span>{t('pricing.get_started')}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and take your business online today. 
              45-day money-back guarantee, no questions asked.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Create Free Account
              </Link>
              <Link to="/contact" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
