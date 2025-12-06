import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const RefundPolicy = () => {
  const refundable = [
    'Web Hosting Plans',
    'VPS Hosting Plans',
    'Cloud Server Plans',
    'Email Hosting Plans',
    'Backup Services',
  ];

  const nonRefundable = [
    'Domain Registrations & Renewals',
    'Domain Transfers',
    'SSL Certificates',
    'Dedicated Servers',
    'Setup Fees',
    'Add-on Services',
  ];

  return (
    <>
      <Helmet>
        <title>Refund Policy - Magnetic Clouds</title>
        <meta name="description" content="Learn about our 45-day money-back guarantee and refund policy at Magnetic Clouds." />
      </Helmet>

      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-display font-bold text-white mb-8 text-center">Refund Policy</h1>
            <p className="text-gray-400 text-center mb-12">Last updated: January 2024</p>

            {/* 45-Day Guarantee Banner */}
            <div className="glass-card p-8 mb-8 text-center border-primary-500/30">
              <h2 className="text-3xl font-bold gradient-text mb-4">45-Day Money-Back Guarantee</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">We're confident you'll love our services. If you're not completely satisfied within 45 days, we'll give you a full refund – no questions asked.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Refundable */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" /> Refundable Services
                </h3>
                <ul className="space-y-3">
                  {refundable.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-400">
                      <Check className="w-4 h-4 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-Refundable */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-400" /> Non-Refundable Services
                </h3>
                <ul className="space-y-3">
                  {nonRefundable.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-400">
                      <X className="w-4 h-4 text-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card p-8 prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white mb-4">How to Request a Refund</h2>
              <ol className="list-decimal list-inside text-gray-400 mb-6 space-y-2">
                <li>Log in to your Magnetic Clouds account</li>
                <li>Open a support ticket with "Refund Request" as the subject</li>
                <li>Include your order number and reason for the refund</li>
                <li>Our team will process your request within 3-5 business days</li>
              </ol>

              <h2 className="text-xl font-semibold text-white mb-4">Refund Processing</h2>
              <p className="text-gray-400 mb-6">Approved refunds will be processed to your original payment method within 5-10 business days. The exact timing depends on your bank or payment provider.</p>

              <h2 className="text-xl font-semibold text-white mb-4">Exceptions</h2>
              <p className="text-gray-400 mb-4">Refunds may be denied if:</p>
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
                <li>Your account has violated our Terms of Service</li>
                <li>The refund request is made after the 45-day period</li>
                <li>You've previously received a refund for the same service</li>
                <li>The service was purchased with a promotional discount greater than 50%</li>
              </ul>

              <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
              <p className="text-gray-400">For refund inquiries, please contact billing@magneticclouds.com or open a support ticket.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;
