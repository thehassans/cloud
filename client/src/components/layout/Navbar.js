import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore, useUIStore, useSettingsStore } from '../../store/useStore';
import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  User,
  Globe,
  Server,
  Cloud,
  HardDrive,
  Globe2,
  Shield,
  Mail,
  Database,
  MapPin
} from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { toggleCart, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { language, setLanguage, currency, setCurrency } = useSettingsStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const services = [
    { path: '/hosting', icon: Server, label: t('nav.hosting') },
    { path: '/vps', icon: HardDrive, label: t('nav.vps') },
    { path: '/cloud', icon: Cloud, label: t('nav.cloud') },
    { path: '/dedicated', icon: Server, label: t('nav.dedicated') },
    { path: '/domains', icon: Globe2, label: t('nav.domains') },
    { path: '/ssl', icon: Shield, label: t('nav.ssl') },
    { path: '/email', icon: Mail, label: t('nav.email') },
    { path: '/backup', icon: Database, label: t('nav.backup') },
  ];

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">MC</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-white">Magnetic</span>
              <span className="font-display font-bold text-xl gradient-text ml-1">Clouds</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {services.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <item.icon className="w-5 h-5 text-primary-400" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/domains" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              {t('nav.domains')}
            </Link>

            <Link to="/datacenters" className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {t('nav.datacenters')}
            </Link>

            <Link to="/support" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              {t('nav.support')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                to={user?.role === 'user' ? '/dashboard' : '/admin'}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.first_name}</span>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient"
                >
                  <span>{t('nav.signup')}</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {/* Services */}
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-medium px-4">Services</p>
                {services.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <item.icon className="w-5 h-5 text-primary-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Other Links */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <Link to="/datacenters" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  {t('nav.datacenters')}
                </Link>
                <Link to="/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5">
                  {t('nav.support')}
                </Link>
              </div>

              {/* Auth */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/30"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-center rounded-xl text-white bg-white/5 border border-white/10"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-center rounded-xl btn-gradient"
                    >
                      <span>{t('nav.signup')}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Language */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-3 w-full text-gray-300"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
