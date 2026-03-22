import { BookOpen, MessageSquare, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Help = () => {
  const helpResources = [
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials for all platform features',
      link: '/blog'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed help via email within 24 hours',
      link: 'mailto:support@srkuniversity.com'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Real-time support for urgent issues',
      link: '#'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call our team during business hours',
      link: 'tel:+977976922301'
    },
  ];

  const commonIssues = [
    {
      question: 'I forgot my password',
      answer: 'Click the "Forgot Password" link on the login page and follow the instructions sent to your email.'
    },
    {
      question: 'How do I access my courses?',
      answer: 'After enrollment, go to your dashboard and click "My Courses" to access all course materials.'
    },
    {
      question: 'How do I download certificates?',
      answer: 'Once you complete a course, your certificate is available in your dashboard under "My Certificates".'
    },
    {
      question: 'Can I change my course selection?',
      answer: 'Contact support within 7 days of enrollment to request a course change or upgrade.'
    },
    {
      question: 'How do payments work?',
      answer: 'We accept cards, digital wallets, and bank transfers. All transactions are secure and encrypted.'
    },
    {
      question: 'What if I have technical issues?',
      answer: 'Clear your browser cache, try a different browser, or contact technical support immediately.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-orange-100">
            We're here to help you succeed
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Support Channels */}
        <h2 className="text-3xl font-bold mb-8">Get Support</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {helpResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.link}
                target={resource.link.startsWith('mailto:') || resource.link.startsWith('tel:') ? '_self' : undefined}
                className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-6 hover:border-orange-400/50 hover:bg-slate-700/70 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-400 text-sm">{resource.description}</p>
              </a>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-400/30 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Direct Contact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest font-bold">Phone</p>
              <a href="tel:+977976922301" className="text-orange-400 font-bold text-2xl hover:text-orange-300 transition-colors">
                +977 976-9223013
              </a>
              <p className="text-gray-500 text-sm mt-2">Available Monday-Sunday, 9 AM - 9 PM</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest font-bold">Email</p>
              <a href="mailto:support@srkuniversity.com" className="text-orange-400 font-bold text-2xl hover:text-orange-300 transition-colors">
                support@srkuniversity.com
              </a>
              <p className="text-gray-500 text-sm mt-2">Response within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <h2 className="text-3xl font-bold mb-8">Common Issues & Solutions</h2>
        <div className="space-y-4 mb-16">
          {commonIssues.map((issue, index) => (
            <div
              key={index}
              className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-6 hover:border-orange-400/50 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">{issue.question}</h3>
              <p className="text-gray-300">{issue.answer}</p>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            to="/faq"
            className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-8 hover:border-orange-400/50 transition-colors text-center"
          >
            <span className="text-4xl block mb-4" role="img" aria-label="FAQ">❓</span>
            <h3 className="text-xl font-bold mb-2">FAQs</h3>
            <p className="text-gray-400">Browse our frequently asked questions</p>
          </Link>

          <Link
            to="/blog"
            className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-8 hover:border-orange-400/50 transition-colors text-center"
          >
            <span className="text-4xl block mb-4" role="img" aria-label="Blog">📚</span>
            <h3 className="text-xl font-bold mb-2">Blog</h3>
            <p className="text-gray-400">Read helpful tips and guides</p>
          </Link>

          <Link
            to="/getting-started"
            className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-8 hover:border-orange-400/50 transition-colors text-center"
          >
            <span className="text-4xl block mb-4" role="img" aria-label="Getting Started">🚀</span>
            <h3 className="text-xl font-bold mb-2">Getting Started</h3>
            <p className="text-gray-400">Learn the basics quickly</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
