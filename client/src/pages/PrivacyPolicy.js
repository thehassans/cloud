import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Magnetic Clouds</title>
        <meta name="description" content="Learn how Magnetic Clouds collects, uses, and protects your personal information." />
      </Helmet>

      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-display font-bold text-white mb-8 text-center">Privacy Policy</h1>
            <p className="text-gray-400 text-center mb-12">Last updated: January 2024</p>
            
            <div className="glass-card p-8 prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-400 mb-4">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
                <li>Account information (name, email, phone, address)</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Support communications</li>
                <li>Usage data and preferences</li>
              </ul>

              <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-400 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>

              <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-400 mb-6">We do not sell your personal information. We may share information with service providers who assist us in operating our services, and when required by law.</p>

              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-gray-400 mb-6">We implement appropriate security measures to protect your personal information, including encryption, secure servers, and access controls.</p>

              <h2 className="text-xl font-semibold text-white mb-4">5. Data Retention</h2>
              <p className="text-gray-400 mb-6">We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account at any time.</p>

              <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-gray-400 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>

              <h2 className="text-xl font-semibold text-white mb-4">7. Cookies</h2>
              <p className="text-gray-400 mb-6">We use cookies and similar technologies to improve user experience, analyze usage, and personalize content. You can control cookies through your browser settings.</p>

              <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p className="text-gray-400">For privacy-related inquiries, please contact us at privacy@magneticclouds.com.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
