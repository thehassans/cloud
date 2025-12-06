import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSettingsStore } from './store/useStore';
import { settingsAPI } from './services/api';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Guard
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Loading
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages - Lazy loaded for better performance
const Home = React.lazy(() => import('./pages/Home'));
const WebHosting = React.lazy(() => import('./pages/services/WebHosting'));
const VPSServers = React.lazy(() => import('./pages/services/VPSServers'));
const CloudServers = React.lazy(() => import('./pages/services/CloudServers'));
const DedicatedServers = React.lazy(() => import('./pages/services/DedicatedServers'));
const Domains = React.lazy(() => import('./pages/services/Domains'));
const SSLCertificates = React.lazy(() => import('./pages/services/SSLCertificates'));
const ProfessionalEmail = React.lazy(() => import('./pages/services/ProfessionalEmail'));
const WebsiteBackup = React.lazy(() => import('./pages/services/WebsiteBackup'));
const Datacenters = React.lazy(() => import('./pages/Datacenters'));

// Auth Pages
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));

// Static Pages
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const Support = React.lazy(() => import('./pages/Support'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));

// Checkout
const Cart = React.lazy(() => import('./pages/checkout/Cart'));
const Checkout = React.lazy(() => import('./pages/checkout/Checkout'));
const OrderConfirmation = React.lazy(() => import('./pages/checkout/OrderConfirmation'));

// User Dashboard
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const MyServices = React.lazy(() => import('./pages/dashboard/MyServices'));
const MyOrders = React.lazy(() => import('./pages/dashboard/MyOrders'));
const MyInvoices = React.lazy(() => import('./pages/dashboard/MyInvoices'));
const MyTickets = React.lazy(() => import('./pages/dashboard/MyTickets'));
const CreateTicket = React.lazy(() => import('./pages/dashboard/CreateTicket'));
const TicketDetails = React.lazy(() => import('./pages/dashboard/TicketDetails'));
const Profile = React.lazy(() => import('./pages/dashboard/Profile'));

// Admin Panel
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminServices = React.lazy(() => import('./pages/admin/AdminServices'));
const AdminTickets = React.lazy(() => import('./pages/admin/AdminTickets'));
const AdminPages = React.lazy(() => import('./pages/admin/AdminPages'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminCoupons = React.lazy(() => import('./pages/admin/AdminCoupons'));
const AdminMedia = React.lazy(() => import('./pages/admin/AdminMedia'));

// 404
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  const { theme, setSiteSettings } = useSettingsStore();

  useEffect(() => {
    // Load site settings on app start
    const loadSettings = async () => {
      try {
        const { data } = await settingsAPI.getPublic();
        setSiteSettings(data.settings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, [setSiteSettings]);

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Auth Routes - No Header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hosting" element={<WebHosting />} />
            <Route path="/vps" element={<VPSServers />} />
            <Route path="/cloud" element={<CloudServers />} />
            <Route path="/dedicated" element={<DedicatedServers />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/ssl" element={<SSLCertificates />} />
            <Route path="/email" element={<ProfessionalEmail />} />
            <Route path="/backup" element={<WebsiteBackup />} />
            <Route path="/datacenters" element={<Datacenters />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />

            {/* Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          </Route>

          {/* User Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/services" element={<MyServices />} />
            <Route path="/dashboard/orders" element={<MyOrders />} />
            <Route path="/dashboard/invoices" element={<MyInvoices />} />
            <Route path="/dashboard/tickets" element={<MyTickets />} />
            <Route path="/dashboard/tickets/new" element={<CreateTicket />} />
            <Route path="/dashboard/tickets/:ticketNumber" element={<TicketDetails />} />
            <Route path="/dashboard/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/pages" element={<AdminPages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/media" element={<AdminMedia />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
