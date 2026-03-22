import { CheckCircle, Users, Award, Zap, Shield, TrendingUp } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Award,
      title: 'Industry-Recognized Certificates',
      description: 'Earn certificates valued by employers across industries, demonstrating your verified skills and knowledge.'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of practical experience in their fields.'
    },
    {
      icon: Zap,
      title: 'Learn at Your Pace',
      description: 'Access courses anytime, anywhere with lifetime access to all materials and content updates.'
    },
    {
      icon: TrendingUp,
      title: 'Career Advancement',
      description: 'Grow your skills and career opportunities with our comprehensive course offerings and support.'
    },
    {
      icon: Shield,
      title: 'Secure & Verified Learning',
      description: 'All courses and credentials are verified, maintaining the highest standards of educational integrity.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with fellow learners, share experiences, and grow together in our active community.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Why Choose SRK University?</h1>
          <p className="text-xl text-orange-100">
            Discover the features that make us the premier choice for online learning
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-slate-700/50 border border-orange-400/20 rounded-lg p-8 hover:border-orange-400/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-slate-700/50 border border-orange-400/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Additional Benefits</h2>
          
          <div className="space-y-4">
            {[
              '24/7 customer support via email, chat, and phone',
              'Flexible payment options for all budgets',
              'No hidden fees - transparent pricing',
              'Live webinars and interactive Q&A sessions',
              'Downloadable course materials for offline access',
              'Detailed progress tracking and analytics',
              'Affiliate program with attractive commissions',
              'Regular updates to course content and materials',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-orange-400 flex-shrink-0" size={20} />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of students taking their learning to the next level
          </p>
          <a
            href="/packages"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Explore Our Courses
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;
