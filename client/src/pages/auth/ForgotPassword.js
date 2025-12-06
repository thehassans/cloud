import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Check, KeyRound, Shield, Sparkles } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-xl py-4 pl-16 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all";

  return (
    <>
      <Helmet>
        <title>Forgot Password - Magnetic Clouds</title>
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-dark-900 to-primary-900" />
          
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          />

          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />

          <div className="relative z-10 flex flex-col justify-center p-12 xl:p-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Link to="/" className="inline-flex items-center gap-3 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-white font-bold text-2xl">MC</span>
                </div>
                <div>
                  <span className="text-white text-2xl font-display font-bold">Magnetic</span>
                  <span className="text-amber-400 text-2xl font-display font-bold ml-1">Clouds</span>
                </div>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
              <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4">
                Secure Account
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Recovery
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-md">
                Don't worry, it happens to the best of us. We'll help you get back into your account.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
              {[
                { icon: Mail, text: 'Secure email verification' },
                { icon: KeyRound, text: 'Create a new password' },
                { icon: Shield, text: 'Enhanced account protection' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <item.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-gray-300 text-lg">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MC</span>
                </div>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl opacity-70" />
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Check Your Email</h2>
                    <p className="text-gray-400 mb-6">
                      We've sent a password reset link to<br />
                      <span className="text-white font-medium">{email}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                      Didn't receive the email? Check your spam folder or request a new link.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3.5 px-8 rounded-xl hover:opacity-90 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Login
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4"
                      >
                        <KeyRound className="w-8 h-8 text-amber-400" />
                      </motion.div>
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                        Forgot Password?
                      </h2>
                      <p className="text-gray-400">
                        No worries, we'll send you reset instructions.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-amber-400" />
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

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Reset Link</span>
                              <Sparkles className="w-5 h-5" />
                            </>
                          )}
                        </div>
                      </motion.button>
                    </form>

                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 mt-8 text-gray-400 hover:text-white transition-colors group"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Back to Login
                    </Link>

                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>Your account is protected by enterprise security</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
