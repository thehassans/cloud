import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap, Globe, Database, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const features = [
  { icon: Shield, text: '256-bit SSL Encryption' },
  { icon: Zap, text: '99.9% Uptime Guarantee' },
  { icon: Globe, text: 'Global Infrastructure' },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [dbStatus, setDbStatus] = useState({ checking: true, connected: false, adminExists: false, error: null });

  const from = location.state?.from?.pathname || '/dashboard';

  // Check database connection on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const { data } = await authAPI.health();
        setDbStatus({
          checking: false,
          connected: data.database,
          adminExists: data.adminExists,
          adminEmail: data.adminEmail,
          totalUsers: data.totalUsers,
          error: null
        });
      } catch (err) {
        setDbStatus({
          checking: false,
          connected: false,
          adminExists: false,
          error: err.response?.data?.error || err.message || 'Connection failed'
        });
      }
    };
    checkHealth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.login({ email, password });

      login(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome back!');
      
      if (['admin', 'super_admin'].includes(data.user.role)) {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-xl py-4 pl-16 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all";

  return (
    <>
      <Helmet>
        <title>Login - Magnetic Clouds</title>
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-900 to-secondary-900" />
          
          {/* Floating Orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center p-12 xl:p-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/" className="inline-flex items-center gap-3 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <span className="text-white font-bold text-2xl">MC</span>
                </div>
                <div>
                  <span className="text-white text-2xl font-display font-bold">Magnetic</span>
                  <span className="text-primary-400 text-2xl font-display font-bold ml-1">Clouds</span>
                </div>
              </Link>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4">
                Welcome to the
                <span className="block bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400 bg-clip-text text-transparent">
                  Future of Hosting
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-md">
                Experience lightning-fast servers with enterprise-grade security and 24/7 expert support.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <feature.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <span className="text-gray-300 text-lg">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6"
            >
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl xl:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="absolute inset-0 bg-dark-900" />
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MC</span>
                </div>
              </Link>
            </div>

            {/* Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-secondary-500/20 rounded-3xl blur-xl opacity-70" />
              
              <div className="relative bg-dark-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-primary-400" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400">
                    Sign in to access your cloud dashboard
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-primary-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-14`}
                        placeholder="••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${remember ? 'bg-primary-500 border-primary-500' : 'border-gray-600 group-hover:border-gray-500'}`}>
                          {remember && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-300">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-secondary-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-xl transition-all">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-500 bg-dark-800">New to Magnetic Clouds?</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <Link
                  to="/register"
                  className="block w-full text-center py-4 px-6 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  Create an Account
                </Link>

                {/* Security Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Protected by 256-bit SSL encryption</span>
                </div>

                {/* Database Status */}
                <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 text-xs">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 font-medium">System Status:</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {dbStatus.checking ? (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Checking connection...</span>
                      </div>
                    ) : dbStatus.connected ? (
                      <>
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Database Connected</span>
                        </div>
                        {dbStatus.adminExists ? (
                          <div className="flex items-center gap-2 text-xs text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Admin: {dbStatus.adminEmail}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-amber-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>No admin user - run: npm run seed</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Total users: {dbStatus.totalUsers}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Database Error: {dbStatus.error}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
