import { CheckCircle, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { PrimaryButton } from '../components/ReusableComponents';

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
    <div className="min-h-screen bg-bgPrimary text-textPrimary p-4 sm:p-8">
      <div className="max-w-4xl mx-auto sm:py-10">
        <h1 className="text-4xl pt-8 pb-4 font-bold text-center text-textPrimary">
          Getting Started with SRK University
        </h1>
        <p className="text-center text-textPrimary/70 mb-16 text-lg">
          10 simple steps to begin your learning journey
        </p>

        {/* Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <BookOpen className="text-primary" />
            Your 10-Step Learning Path
          </h2>

          <div className="space-y-6">
            {steps.map((step) => (
              <Card key={step.number} className="bg-bgSecondary text-textPrimary">
                <CardBody className="flex flex-row gap-6 p-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-custom-gradient text-black font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-textPrimary/70">{step.description}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Users className="text-primary" />
            Best Practices for Success
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <Card key={index} className="bg-bgSecondary text-textPrimary">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">{tip.category}</h3>
                  <ul className="space-y-3">
                    {tip.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                        <span className="text-textPrimary/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <Card className="bg-bgSecondary text-textPrimary p-4">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">Need Help Getting Started?</h2>
            <p className="text-textPrimary/70 mb-6">
              Our support team is available 24/7 to help you with any questions
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <PrimaryButton label="Contact Support" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center bg-bgPrimary border border-primary/40 hover:border-primary text-textPrimary font-bold px-10 py-2 rounded-xl transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default GettingStarted;
