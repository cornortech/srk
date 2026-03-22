import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks = () => {
  const mainSteps = [
    {
      number: 1,
      title: 'Register & Verify',
      description: 'Create your account, complete KYC verification, and join our verified learner community.',
      details: [
        'Simple registration process',
        'Email verification required',
        'KYC verification for security',
        'Secure password setup'
      ]
    },
    {
      number: 2,
      title: 'Choose Your Path',
      description: 'Browse our course catalog and select packages that align with your goals and interests.',
      details: [
        'Explore 50+ courses',
        'Multiple learning paths',
        'Flexible package options',
        'View course previews'
      ]
    },
    {
      number: 3,
      title: 'Enroll & Pay',
      description: 'Select your preferred course, choose a payment method, and complete secure checkout.',
      details: [
        'Multiple payment options',
        '100% secure payment',
        'Instant confirmation',
        'Flexible payment plans'
      ]
    },
    {
      number: 4,
      title: 'Learn at Your Pace',
      description: 'Access all course materials immediately and learn whenever it\'s convenient for you.',
      details: [
        'Lifetime access to content',
        'Offline download option',
        'Self-paced learning',
        'Lifetime updates included'
      ]
    },
    {
      number: 5,
      title: 'Engage & Grow',
      description: 'Participate in webinars, connect with peers, and get support from instructors.',
      details: [
        'Live group sessions',
        'Community forums',
        'Peer learning',
        'Q&A with instructors'
      ]
    },
    {
      number: 6,
      title: 'Complete & Earn',
      description: 'Finish assignments, pass assessments, and earn your industry-recognized certificate.',
      details: [
        'Track completion progress',
        'Pass final assessment',
        'Earn certificate',
        'Add to professional profile'
      ]
    },
  ];

  const features = [
    {
      title: 'Flexible Learning',
      description: 'Study whenever and wherever you want, around your schedule.',
      icon: '⏰'
    },
    {
      title: 'Expert Instruction',
      description: 'Learn from industry professionals with real-world experience.',
      icon: '👨‍🏫'
    },
    {
      title: 'Community Support',
      description: 'Connect with thousands of learners pursuing similar goals.',
      icon: '👥'
    },
    {
      title: 'Verified Certificates',
      description: 'Earn recognized credentials that boost your professional profile.',
      icon: '🏅'
    },
    {
      title: 'Career Growth',
      description: 'Develop skills that advance your career opportunities.',
      icon: '📈'
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it from our dedicated support team.',
      icon: '💬'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">How SRK University Works</h1>
          <p className="text-xl text-orange-100">
            Your complete journey from student to certified professional
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Main Steps */}
        <h2 className="text-3xl font-bold mb-12 text-center">The 6-Step Learning Journey</h2>
        
        <div className="space-y-8 mb-20">
          {mainSteps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-8 items-start"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center font-bold text-2xl">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow bg-slate-700/50 border border-orange-400/20 rounded-lg p-8 hover:border-orange-400/50 transition-colors">
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300 mb-6">{step.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ChevronRight className="text-orange-400 flex-shrink-0" size={16} />
                      <span className="text-gray-400">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              {index < mainSteps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 translate-y-64">
                  <div className="text-3xl text-orange-400">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <h2 className="text-3xl font-bold mb-12 text-center">Why Students Choose Us</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-8 hover:border-orange-400/50 transition-colors text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Process Infographic */}
        <div className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-12 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">The Complete Process</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            {[
              { step: 'Sign Up', time: 'Day 1' },
              { step: 'Enroll', time: 'Week 1' },
              { step: 'Learn', time: 'Ongoing' },
              { step: 'Achieve', time: 'Completion' },
            ].map((item, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="text-center w-full">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-2 font-bold">
                    {index + 1}
                  </div>
                  <p className="font-bold">{item.step}</p>
                  <p className="text-sm text-gray-400">{item.time}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block text-2xl text-orange-400 mx-4">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              Average completion time: 4-12 weeks depending on course intensity
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of successful learners who have completed courses and advanced their careers with SRK University.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/packages"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              to="/getting-started"
              className="inline-block bg-slate-700 border border-orange-400/30 hover:border-orange-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Getting Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
