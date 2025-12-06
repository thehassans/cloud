import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useSettingsStore } from '../store/useStore';
import ThemeToggle from '../components/common/ThemeToggle';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Server,
  MessageSquare,
  FileText,
  Settings,
  Tag,
  Image,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Globe,
  Bell,
  Search,
  Sparkles,
  Crown
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/services', icon: Server, label: 'Services & Plans' },
    { path: '/admin/tickets', icon: MessageSquare, label: 'Support Tickets' },
    { path: '/admin/pages', icon: FileText, label: 'Pages' },
    { path: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { path: '/admin/media', icon: Image, label: 'Media Library' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getPageTitle = () => {
    const item = navItems.find(item => 
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/admin'
    );
    return item?.label || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-all duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Background with Glass Effect */}
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl border-r border-white/10" />
        
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
        
        <div className="relative h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-white tracking-tight">Admin Panel</span>
                <span className="text-xs text-slate-500 font-medium">Magnetic Clouds</span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-4">
              Main Menu
            </div>
            {navItems.map((item, index) => {
              const active = isActive(item.path, item.exact);
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {/* Active Background */}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/10 to-transparent rounded-xl border border-primary-500/20"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-400 to-purple-500 rounded-r-full" />
                    )}
                    
                    <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      active 
                        ? 'bg-primary-500/20' 
                        : 'bg-slate-800/50 group-hover:bg-slate-700/50'
                    }`}>
                      <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-primary-400' : ''}`} />
                    </div>
                    <span className="relative font-medium text-[15px]">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/5 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 flex items-center justify-center transition-all">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-medium text-[15px]">View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800/50 group-hover:bg-red-500/10 flex items-center justify-center transition-all">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium text-[15px]">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 relative">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 h-20 px-6 flex items-center justify-between backdrop-blur-xl border-b ${
          isDark 
            ? 'bg-slate-900/80 border-white/5' 
            : 'bg-white/80 border-slate-200'
        }`}>
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:block">
              <h1 className={`text-xl font-display font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {getPageTitle()}
              </h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isDark 
                  ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}>
              <Bell className="w-5 h-5" />
              <span className={`absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${isDark ? 'border-slate-900' : 'border-white'}`} />
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-white/10 mx-2 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white font-bold text-base">
                    {user?.first_name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">
                    {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
