import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';
import { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Our support team responds within 24 hours',
      contact: 'support@srktask.com',
      label: 'Send an email',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Available 24/7 for urgent inquiries',
      contact: 'Chat with us',
      label: 'Start a conversation',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Talk directly with our support team',
      contact: '+977 1-XXXX-XXXX',
      label: 'Call us',
    },
    {
      icon: Clock,
      title: 'Support Hours',
      description: 'Most support requests handled within 24 hours',
      contact: '24/7 Availability',
      label: 'Always here to help',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0705] via-transparent to-black opacity-50" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Get in <span className="text-[#e1ba73]">Touch</span>
            </h1>
            <p className="text-xl text-gray-400">
              We're here to help! Whether you have questions, need support, or just want to say hello, 
              our team is ready to assist you. Contact us through any of our available channels below.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-[#e1ba73]/50 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-xl blur opacity-0 group-hover:opacity-60 transition-all duration-300" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center">
                    <Icon className="text-black" size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{method.description}</p>
                <p className="text-[#e1ba73] font-semibold text-sm">{method.contact}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Contact Form and Info */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e1ba73] transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e1ba73] transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e1ba73] transition-colors"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e1ba73] transition-colors resize-none"
                  placeholder="Tell us everything..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all duration-300"
              >
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Support Team</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                At SRK Task, we pride ourselves on exceptional customer support. Our dedicated team is committed to 
                resolving your issues quickly and efficiently. Whether you have questions about tasks, payments, or 
                account management, we're here to help.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We typically respond to all inquiries within 24 hours. For urgent matters, please use our live chat 
                feature available 24/7 to get immediate assistance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#e1ba73]/10 to-[#b68938]/5 border border-[#e1ba73]/20 rounded-xl p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-[#e1ba73]" />
                Location
              </h4>
              <p className="text-gray-400 text-sm">
                Based in Kathmandu, Nepal<br />
                Part of SRK Industries Digital Ecosystem
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#e1ba73]/10 to-[#b68938]/5 border border-[#e1ba73]/20 rounded-xl p-6">
              <h4 className="font-bold mb-3">Common Questions?</h4>
              <p className="text-gray-400 text-sm mb-4">
                Check out our FAQ section for quick answers to commonly asked questions about tasks, earnings, and more.
              </p>
              <Link
                to="/faq"
                className="inline-block bg-[#e1ba73] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#b68938] transition-colors"
              >
                View FAQ →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
