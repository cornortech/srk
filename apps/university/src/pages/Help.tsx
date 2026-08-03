import { BookOpen, MessageSquare, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';

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
    <div className="min-h-screen bg-bgPrimary text-textPrimary p-4 sm:p-8">
      <div className="max-w-6xl mx-auto sm:py-10">
        <h1 className="text-4xl pt-8 pb-4 font-bold text-center text-textPrimary">
          Help Center
        </h1>
        <p className="text-center text-textPrimary/70 mb-16 text-lg">
          We're here to help you succeed
        </p>

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
                className="group"
              >
                <Card className="bg-bgSecondary text-textPrimary h-full hover:ring-1 hover:ring-primary/50 transition-all">
                  <CardBody className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-custom-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="text-black" size={24} />
                    </div>
                    <h3 className="font-bold mb-2">{resource.title}</h3>
                    <p className="text-textPrimary/60 text-sm">{resource.description}</p>
                  </CardBody>
                </Card>
              </a>
            );
          })}
        </div>

        {/* Contact Information */}
        <Card className="bg-bgSecondary text-textPrimary mb-16 p-4">
          <CardBody>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Direct Contact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-textPrimary/50 mb-2 text-sm uppercase tracking-widest font-bold">Phone</p>
                <a href="tel:+977976922301" className="text-primary font-bold text-2xl hover:text-textPrimary transition-colors">
                  +977 976-9223013
                </a>
                <p className="text-textPrimary/40 text-sm mt-2">Available Monday-Sunday, 9 AM - 9 PM</p>
              </div>
              <div className="text-center">
                <p className="text-textPrimary/50 mb-2 text-sm uppercase tracking-widest font-bold">Email</p>
                <a href="mailto:support@srkuniversity.com" className="text-primary font-bold text-2xl hover:text-textPrimary transition-colors">
                  support@srkuniversity.com
                </a>
                <p className="text-textPrimary/40 text-sm mt-2">Response within 24 hours</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Common Issues */}
        <h2 className="text-3xl font-bold mb-8">Common Issues & Solutions</h2>
        <div className="space-y-4 mb-16">
          {commonIssues.map((issue, index) => (
            <Card key={index} className="bg-bgSecondary text-textPrimary">
              <CardBody className="p-6">
                <h3 className="font-bold text-lg mb-2">{issue.question}</h3>
                <p className="text-textPrimary/70">{issue.answer}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/faq">
            <Card className="bg-bgSecondary text-textPrimary h-full hover:ring-1 hover:ring-primary/50 transition-all">
              <CardBody className="p-8 text-center">
                <span className="text-4xl block mb-4" role="img" aria-label="FAQ">❓</span>
                <h3 className="text-xl font-bold mb-2">FAQs</h3>
                <p className="text-textPrimary/60">Browse our frequently asked questions</p>
              </CardBody>
            </Card>
          </Link>

          <Link to="/blog">
            <Card className="bg-bgSecondary text-textPrimary h-full hover:ring-1 hover:ring-primary/50 transition-all">
              <CardBody className="p-8 text-center">
                <span className="text-4xl block mb-4" role="img" aria-label="Blog">📚</span>
                <h3 className="text-xl font-bold mb-2">Blog</h3>
                <p className="text-textPrimary/60">Read helpful tips and guides</p>
              </CardBody>
            </Card>
          </Link>

          <Link to="/getting-started">
            <Card className="bg-bgSecondary text-textPrimary h-full hover:ring-1 hover:ring-primary/50 transition-all">
              <CardBody className="p-8 text-center">
                <span className="text-4xl block mb-4" role="img" aria-label="Getting Started">🚀</span>
                <h3 className="text-xl font-bold mb-2">Getting Started</h3>
                <p className="text-textPrimary/60">Learn the basics quickly</p>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
