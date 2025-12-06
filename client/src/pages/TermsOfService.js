import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Magnetic Clouds</title>
        <meta name="description" content="Read our terms of service to understand your rights and responsibilities when using Magnetic Clouds services." />
      </Helmet>

      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-display font-bold text-white mb-8 text-center">Terms of Service</h1>
            <p className="text-gray-400 text-center mb-12">Last updated: January 2024</p>
            
            <div className="glass-card p-8 prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-400 mb-6">By accessing and using Magnetic Clouds services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

              <h2 className="text-xl font-semibold text-white mb-4">2. Services</h2>
              <p className="text-gray-400 mb-6">Magnetic Clouds provides web hosting, domain registration, VPS, cloud servers, dedicated servers, SSL certificates, email hosting, and related services. We reserve the right to modify, suspend, or discontinue any service at any time.</p>

              <h2 className="text-xl font-semibold text-white mb-4">3. Account Responsibilities</h2>
              <p className="text-gray-400 mb-6">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.</p>

              <h2 className="text-xl font-semibold text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-400 mb-4">You agree not to use our services for:</p>
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
                <li>Illegal activities or promoting illegal activities</li>
                <li>Distributing malware, viruses, or harmful code</li>
                <li>Sending spam or unsolicited communications</li>
                <li>Infringing on intellectual property rights</li>
                <li>Hosting phishing sites or fraudulent content</li>
                <li>Any activity that disrupts our services or other users</li>
              </ul>

              <h2 className="text-xl font-semibold text-white mb-4">5. Payment Terms</h2>
              <p className="text-gray-400 mb-6">All fees are due in advance. We accept major credit cards and other payment methods as displayed. Prices are subject to change with notice. You are responsible for all applicable taxes.</p>

              <h2 className="text-xl font-semibold text-white mb-4">6. Refund Policy</h2>
              <p className="text-gray-400 mb-6">We offer a 45-day money-back guarantee on hosting services. Domain registrations, SSL certificates, and dedicated servers are non-refundable. See our Refund Policy for details.</p>

              <h2 className="text-xl font-semibold text-white mb-4">7. Service Level Agreement</h2>
              <p className="text-gray-400 mb-6">We guarantee 99.9% uptime for our hosting services. If we fail to meet this guarantee, you may be eligible for service credits as outlined in our SLA.</p>

              <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-400 mb-6">Magnetic Clouds shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability is limited to the amount paid for services in the previous 12 months.</p>

              <h2 className="text-xl font-semibold text-white mb-4">9. Termination</h2>
              <p className="text-gray-400 mb-6">We may suspend or terminate your account for violation of these terms. You may cancel your services at any time through your dashboard or by contacting support.</p>

              <h2 className="text-xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p className="text-gray-400">For questions about these terms, please contact us at legal@magneticclouds.com or through our support system.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TermsOfService;
