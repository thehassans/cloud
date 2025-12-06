import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, Book, Phone, Mail, HelpCircle, FileText, ExternalLink } from 'lucide-react';

const Support = () => {
  const supportOptions = [
    { icon: MessageSquare, title: 'Support Tickets', desc: 'Create a ticket for technical assistance', link: '/dashboard/tickets/new', cta: 'Open Ticket' },
    { icon: Book, title: 'Knowledge Base', desc: 'Browse our documentation and tutorials', link: '/kb', cta: 'Browse Articles' },
    { icon: Phone, title: 'Phone Support', desc: 'Call us for urgent issues', value: '+880 1234-567890', cta: 'Call Now' },
    { icon: Mail, title: 'Email Support', desc: 'Send us an email', value: 'support@magneticclouds.com', cta: 'Send Email' },
  ];

  const faqs = [
    { q: 'How do I reset my password?', a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.' },
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, PayPal, and local bank transfers for Bangladesh customers.' },
    { q: 'How long does it take to set up my hosting?', a: 'Most hosting accounts are activated instantly after payment confirmation.' },
    { q: 'Do you offer a money-back guarantee?', a: 'Yes, we offer a 45-day money-back guarantee on all hosting plans.' },
    { q: 'Can I upgrade my plan later?', a: 'Yes, you can upgrade your plan at any time from your dashboard.' },
    { q: 'How do I transfer my domain to Magnetic Clouds?', a: 'Unlock your domain at your current registrar, get the EPP code, and initiate the transfer from our domain page.' },
  ];

  return (
    <>
      <Helmet>
        <title>Support Center - Magnetic Clouds</title>
        <meta name="description" content="Get help with your Magnetic Clouds services. 24/7 support via tickets, phone, and email." />
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              How Can We <span className="gradient-text">Help?</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
          </motion.div>

          {/* Support Options */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {supportOptions.map((option, index) => (
              <motion.div key={option.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{option.desc}</p>
                {option.value && <p className="text-primary-400 font-medium mb-4">{option.value}</p>}
                <Link to={option.link || '#'} className="btn-outline text-sm py-2 inline-flex">{option.cta}</Link>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="glass-card p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                      <p className="text-gray-400 text-sm">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Support;
