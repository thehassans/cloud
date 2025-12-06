import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Globe, Award, Zap, Shield, Clock, Heart, Target } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '50K+', label: 'Websites Hosted' },
    { value: '24/7', label: 'Expert Support' },
  ];

  const values = [
    { icon: Heart, title: 'Customer First', desc: 'Our customers are at the heart of everything we do.' },
    { icon: Shield, title: 'Reliability', desc: 'We guarantee maximum uptime and performance.' },
    { icon: Zap, title: 'Innovation', desc: 'Constantly improving our technology and services.' },
    { icon: Target, title: 'Excellence', desc: 'Striving for the highest standards in everything.' },
  ];

  const team = [
    { name: 'Rahul Ahmed', role: 'CEO & Founder', image: '/team/ceo.jpg' },
    { name: 'Sarah Khan', role: 'CTO', image: '/team/cto.jpg' },
    { name: 'Karim Hassan', role: 'Head of Support', image: '/team/support.jpg' },
    { name: 'Fatima Ali', role: 'Marketing Director', image: '/team/marketing.jpg' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Magnetic Clouds</title>
        <meta name="description" content="Learn about Magnetic Clouds, Bangladesh's leading web hosting provider. Our mission, values, and the team behind our success." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              About <span className="gradient-text">Magnetic Clouds</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We're on a mission to make web hosting accessible, reliable, and affordable for businesses of all sizes in Bangladesh and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <p className="text-4xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-400">
                <p>Founded in 2020, Magnetic Clouds started with a simple vision: to provide world-class hosting services to businesses in Bangladesh at affordable prices.</p>
                <p>What began as a small team of passionate tech enthusiasts has grown into one of the region's most trusted hosting providers, serving thousands of customers across the globe.</p>
                <p>Today, we operate multiple datacenters worldwide and continue to innovate, bringing the latest technologies and best practices to our customers.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8">
              <Globe className="w-16 h-16 text-primary-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Global Reach, Local Touch</h3>
              <p className="text-gray-400">While we've grown globally, we never forget our roots. Our Dhaka-based support team understands local business needs and provides personalized service to every customer.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">Join thousands of satisfied customers and experience the Magnetic Clouds difference.</p>
          <a href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-block">Create Your Account</a>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
