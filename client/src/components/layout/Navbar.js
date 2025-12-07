import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore, useUIStore, useSettingsStore } from '../../store/useStore';
import ThemeToggle from '../common/ThemeToggle';
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
  const { language, setLanguage, currency, setCurrency, theme } = useSettingsStore();
  const isDark = theme === 'dark';
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
      scrolled 
        ? isDark 
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-white/10' 
          : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">MC</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Magnetic</span>
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
              <button className={`flex items-center gap-1 px-4 py-2 transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}>
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-0 w-64 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ${
                      isDark ? 'bg-slate-900/95 border border-white/10' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className="p-2">
                      {services.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <item.icon className="w-5 h-5 text-primary-500" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/domains" className={`px-4 py-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              {t('nav.domains')}
            </Link>

            <Link to="/datacenters" className={`px-4 py-2 transition-colors flex items-center gap-1 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              <MapPin className="w-4 h-4" />
              {t('nav.datacenters')}
            </Link>

            <Link to="/support" className={`px-4 py-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              {t('nav.support')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`hidden sm:flex items-center gap-1 px-3 py-2 transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className={`relative p-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
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
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isDark ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100'}`}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.first_name}</span>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 transition-colors font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
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
              className={`lg:hidden p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
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
            className={`lg:hidden backdrop-blur-xl border-t ${isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-slate-200'}`}
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {/* Services */}
              <div className="space-y-2">
                <p className={`text-sm font-medium px-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Services</p>
                {services.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <item.icon className="w-5 h-5 text-primary-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Other Links */}
              <div className={`border-t pt-4 space-y-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <Link to="/datacenters" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <MapPin className="w-5 h-5 text-primary-400" />
                  {t('nav.datacenters')}
                </Link>
                <Link to="/support" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                  {t('nav.support')}
                </Link>
              </div>

              {/* Auth */}
              <div className={`border-t pt-4 space-y-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
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
                      className={`block px-4 py-3 text-center rounded-xl ${isDark ? 'text-white bg-white/5 border border-white/10' : 'text-slate-700 bg-slate-100 border border-slate-200'}`}
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
                className={`flex items-center gap-2 px-4 py-3 w-full ${isDark ? 'text-gray-300' : 'text-slate-600'}`}
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
