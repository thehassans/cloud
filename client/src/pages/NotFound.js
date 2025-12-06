import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - Magnetic Clouds</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="absolute inset-0 mesh-bg" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-lg"
        >
          {/* 404 Text */}
          <div className="relative mb-8">
            <h1 className="text-[150px] sm:text-[200px] font-display font-bold text-white/5 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card p-6">
                <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-primary-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-gradient w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              <span>Go Home</span>
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn-outline w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Popular Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm mb-4">Popular Pages</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/hosting" className="text-gray-400 hover:text-white transition-colors">
                Web Hosting
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/vps" className="text-gray-400 hover:text-white transition-colors">
                VPS Servers
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/domains" className="text-gray-400 hover:text-white transition-colors">
                Domains
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default NotFound;
