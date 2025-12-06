import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const services = [
    { label: t('nav.hosting'), path: '/hosting' },
    { label: t('nav.vps'), path: '/vps' },
    { label: t('nav.cloud'), path: '/cloud' },
    { label: t('nav.dedicated'), path: '/dedicated' },
    { label: t('nav.domains'), path: '/domains' },
    { label: t('nav.ssl'), path: '/ssl' },
    { label: t('nav.email'), path: '/email' },
    { label: t('nav.backup'), path: '/backup' },
  ];

  const company = [
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
    { label: t('nav.datacenters'), path: '/datacenters' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
  ];

  const support = [
    { label: t('nav.support'), path: '/support' },
    { label: 'Knowledge Base', path: '/kb' },
    { label: 'System Status', path: '/status' },
    { label: 'Report Abuse', path: '/abuse' },
  ];

  const legal = [
    { label: t('footer.terms'), path: '/terms' },
    { label: t('footer.privacy'), path: '/privacy' },
    { label: t('footer.refund'), path: '/refund' },
    { label: 'SLA', path: '/sla' },
  ];

  const socials = [
    { icon: Facebook, href: 'https://facebook.com/magneticclouds', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/magneticclouds', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/magneticclouds', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/magneticclouds', label: 'Instagram' },
  ];

  return (
    <footer className="bg-slate-900 border-t border-white/10">
      {/* Features Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Free SSL</p>
                <p className="text-gray-400 text-sm">All domains</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">24/7 Support</p>
                <p className="text-gray-400 text-sm">Always available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-semibold">45-Day Guarantee</p>
                <p className="text-gray-400 text-sm">Money back</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Global Network</p>
                <p className="text-gray-400 text-sm">9+ locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white">Magnetic</span>
                <span className="font-display font-bold text-xl gradient-text ml-1">Clouds</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:support@magneticclouds.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@magneticclouds.com</span>
              </a>
              <a href="tel:+8801234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>+880 1234-567890</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/30 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t('footer.copyright').replace('2024', currentYear)}
            </p>
            <div className="flex items-center gap-4">
              <img src="/payment/visa.svg" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
              <img src="/payment/mastercard.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
              <img src="/payment/paypal.svg" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
              <img src="/payment/stripe.svg" alt="Stripe" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
