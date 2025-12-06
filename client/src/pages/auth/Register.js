import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, ArrowRight, Check, Shield, Zap, Gift, Rocket } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const benefits = [
  { icon: Gift, title: 'Free Domain', desc: 'Get a free .com domain with annual plans' },
  { icon: Shield, title: 'Free SSL', desc: 'Secure your site with free SSL certificates' },
  { icon: Zap, title: 'Instant Setup', desc: 'Your account is ready in seconds' },
];

const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!terms) {
      toast.error('Please accept the terms of service');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company: company || null,
        password,
      });

      login(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-xl py-3.5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm";

  return (
    <>
      <Helmet>
        <title>Create Account - Magnetic Clouds</title>
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-dark-900 to-primary-900" />
          
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"
          />

          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />

          <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Link to="/" className="inline-flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 via-purple-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white font-bold text-xl">MC</span>
                </div>
                <div>
                  <span className="text-white text-xl font-display font-bold">Magnetic</span>
                  <span className="text-secondary-400 text-xl font-display font-bold ml-1">Clouds</span>
                </div>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
              <h1 className="text-3xl xl:text-4xl font-display font-bold text-white leading-tight mb-4">
                Start Your
                <span className="block bg-gradient-to-r from-secondary-400 via-purple-400 to-primary-400 bg-clip-text text-transparent">
                  Cloud Journey
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-sm">
                Join thousands of businesses powered by our premium cloud infrastructure.
              </p>
            </motion.div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-0.5">{benefit.title}</h3>
                    <p className="text-sm text-slate-400">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-medium text-white">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Join 50,000+ users</p>
                  <p className="text-xs text-slate-500">who trust Magnetic Clouds</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-lg my-8"
          >
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MC</span>
                </div>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 via-purple-500/20 to-primary-500/20 rounded-3xl blur-xl opacity-60" />
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500/20 to-primary-500/20 border border-secondary-500/30 mb-3"
                  >
                    <Rocket className="w-7 h-7 text-secondary-400" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-white mb-1">Create Account</h2>
                  <p className="text-slate-400 text-sm">Get started with your free account today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-400" />
                        </div>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClass}
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-400" />
                        </div>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClass}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary-400" />
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

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary-400" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        placeholder="+880 1234-567890"
                        required
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company (Optional)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Building className="w-4 h-4 text-primary-400" />
                      </div>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className={inputClass}
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-12`}
                        placeholder="••••••••••"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 px-1">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                i < passwordStrength() ? strengthColors[passwordStrength() - 1] : 'bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Password strength: <span className={`font-medium ${passwordStrength() >= 3 ? 'text-emerald-400' : passwordStrength() >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>{strengthLabels[passwordStrength() - 1] || 'Too weak'}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pr-12`}
                        placeholder="••••••••••"
                        required
                      />
                      {confirmPassword && password === confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group pt-1">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${terms ? 'bg-primary-500 border-primary-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                        {terms && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-400 hover:text-primary-300 font-medium">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary-400 hover:text-primary-300 font-medium">Privacy Policy</Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative w-full group mt-2"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-500 via-purple-500 to-primary-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-secondary-600 to-primary-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-slate-500 bg-slate-900">Already have an account?</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="block w-full text-center py-3.5 px-6 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  Sign In Instead
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Shield className="w-4 h-4" />
                  <span>Your data is encrypted and secure</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;
