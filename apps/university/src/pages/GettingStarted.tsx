import { CheckCircle, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GettingStarted = () => {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up with your email address and verify your account. It takes less than 5 minutes.',
      icon: '📝'
    },
    {
      number: 2,
      title: 'Complete Your Profile',
      description: 'Fill in your profile information and upload a profile picture to get started.',
      icon: '👤'
    },
    {
      number: 3,
      title: 'Browse Courses',
      description: 'Explore our catalog of courses and find those that match your interests and goals.',
      icon: '🔍'
    },
    {
      number: 4,
      title: 'Choose a Package',
      description: 'Select from our flexible course packages suited to your learning needs and budget.',
      icon: '📦'
    },
    {
      number: 5,
      title: 'Complete Payment',
      description: 'Pay securely using your preferred payment method. We support multiple options.',
      icon: '💳'
    },
    {
      number: 6,
      title: 'Start Learning',
      description: 'Access all course materials immediately and begin your learning journey.',
      icon: '🎓'
    },
    {
      number: 7,
      title: 'Engage with Content',
      description: 'Watch lectures, complete assignments, and participate in live webinars.',
      icon: '📚'
    },
    {
      number: 8,
      title: 'Track Progress',
      description: 'Monitor your completion status, quiz scores, and overall learning progress.',
      icon: '📊'
    },
    {
      number: 9,
      title: 'Complete Assessments',
      description: 'Pass quizzes and final assessments to demonstrate your learning achievements.',
      icon: '✅'
    },
    {
      number: 10,
      title: 'Earn Certificate',
      description: 'Receive your industry-recognized certificate upon course completion.',
      icon: '🏆'
    },
  ];

  const tips = [
    {
      category: '✓ DO:',
      items: [
        'Set a regular learning schedule',
        'Participate in live webinars',
        'Engage with the community',
        'Take detailed notes',
        'Practice assignments',
        'Ask questions in forums'
      ]
    },
    {
      category: '✗ AVOID:',
      items: [
        'Rushing through content',
        'Skipping practice exercises',
        'Ignoring deadlines',
        'Studying passively',
        'Isolating yourself',
        'Giving up on difficult topics'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Getting Started with SRK University</h1>
          <p className="text-xl text-orange-100">
            10 simple steps to begin your learning journey
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <BookOpen className="text-orange-400" />
            Your 10-Step Learning Path
          </h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex gap-6 bg-slate-700/50 border border-orange-400/20 rounded-lg p-6 hover:border-orange-400/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-sm">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Users className="text-orange-400" />
            Best Practices for Success
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-400">{tip.category}</h3>
                <ul className="space-y-3">
                  {tip.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <CheckCircle className="text-orange-400 flex-shrink-0 mt-1" size={16} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-400/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Getting Started?</h2>
          <p className="text-gray-300 mb-6">
            Our support team is available 24/7 to help you with any questions
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/contact"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="inline-block bg-slate-700 border border-orange-400/30 hover:border-orange-400 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
