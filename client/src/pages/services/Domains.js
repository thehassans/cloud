import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Globe, Check, X, ArrowRight, Shield, Clock, RefreshCw } from 'lucide-react';
import { domainsAPI } from '../../services/api';
import { useCartStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const Domains = () => {
  const { addItem } = useCartStore();
  const [tlds, setTlds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTLDs();
  }, []);

  const loadTLDs = async () => {
    try {
      const { data } = await domainsAPI.getTLDs();
      setTlds(data.tlds || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const { data } = await domainsAPI.search(searchQuery);
      setResults(data.results);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const features = [
    { icon: Shield, title: 'Free WHOIS Privacy', desc: 'Protect your personal information' },
    { icon: Clock, title: 'Instant Activation', desc: 'Domain ready in minutes' },
    { icon: RefreshCw, title: 'Easy Transfers', desc: 'Transfer domains seamlessly' },
    { icon: Globe, title: 'DNS Management', desc: 'Full DNS control panel' },
  ];

  return (
    <>
      <Helmet>
        <title>Domain Registration - Magnetic Clouds</title>
        <meta name="description" content="Register your perfect domain name. Search from hundreds of TLDs with free WHOIS privacy. Starting at $8.99/year." />
      </Helmet>

      {/* Hero with Search */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-6">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Domain Registration</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Find Your Perfect <span className="gradient-text">Domain</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              Search and register your domain name from hundreds of extensions. Free WHOIS privacy included.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your domain name..."
                  className="w-full px-6 py-5 pr-40 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 text-lg"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-2 top-2 bottom-2 px-8 btn-gradient flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">{searching ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      {results && (
        <section className="py-12 bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-6">Search Results</h2>
              {results.map((result) => (
                <div
                  key={result.domain}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    result.available
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {result.available ? (
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">{result.domain}</p>
                      <p className={result.available ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
                        {result.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                  {result.available && (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-bold">{formatPrice(result.price_register)}</p>
                        <p className="text-gray-500 text-sm">/year</p>
                      </div>
                      <button
                        onClick={() => {
                          addItem({
                            type: 'domain',
                            product_id: result.tld_id,
                            name: result.domain,
                            domain_name: result.domain,
                            price: result.price_register,
                            action: 'register',
                            years: 1
                          });
                          toast.success(`${result.domain} added to cart`);
                        }}
                        className="btn-gradient"
                      >
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 glass-card">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TLD Pricing */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">Domain Pricing</h2>
            <p className="text-gray-400">Choose from hundreds of domain extensions</p>
          </div>

          {loading ? (
            <div className="flex justify-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tlds.slice(0, 18).map((tld, index) => (
                <motion.div
                  key={tld.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4 text-center hover:border-primary-500/50 transition-all cursor-pointer"
                  onClick={() => setSearchQuery(tld.tld.replace('.', ''))}
                >
                  <p className="text-2xl font-bold text-white mb-2">{tld.tld}</p>
                  <p className="text-primary-400 font-semibold">{formatPrice(tld.price_register)}</p>
                  <p className="text-gray-500 text-xs">/year</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transfer CTA */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Already Own a Domain?</h2>
          <p className="text-gray-400 mb-6">Transfer your domain to Magnetic Clouds and get free 1-year extension.</p>
          <a href="/domains/transfer" className="btn-gradient inline-flex items-center gap-2">
            <span>Transfer Domain</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
};

export default Domains;
