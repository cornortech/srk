import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
}

export const Help = () => {
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'How to Maximize Your Earnings on SRK Task',
      excerpt: 'Learn proven strategies to increase your task completion rate and unlock premium earning opportunities.',
      category: 'Tips & Tricks',
      date: 'March 15, 2026',
      readTime: '5 min read',
      content: `Maximizing your earnings on SRK Task requires strategy, consistency, and quality work. Here are the proven methods used by top earners to increase their income significantly.

First, focus on building your profile rating. Every honest task completion improves your rating, which unlocks better-paying premium tasks. Top-rated users earn 3-4 times more than new users. The key is consistency - complete every task thoroughly and submit clear proof.

Second, specialize in high-demand task types. Different tasks have different payment rates. Social media engagement tasks might pay $1-3, while content creation tasks can pay $10-50+. Identify which tasks pay best and focus on those while maintaining quality.

Third, check your dashboard frequently. Premium tasks fill up within minutes. Set reminders to check for new tasks and be ready to accept them immediately when they become available.

Fourth, invest time in your profile quality. A complete profile with a professional photo and compelling bio attracts more task opportunities. Task creators prefer working with users who appear professional and committed.

Fifth, manage your time wisely. Calculate your hourly rate for different tasks. Focus on tasks with the best hourly rates while balancing variety to prevent burnout.

Finally, be patient with growth. Your first month might bring lower earnings, but as your rating increases and you build reputation, opportunities and payments grow exponentially.`,
    },
    {
      id: '2',
      title: 'Understanding Task Verification: What Gets Approved?',
      excerpt: 'Detailed guide on task submission, verification process, and what makes submissions get approved quickly.',
      category: 'Platform Guide',
      date: 'March 12, 2026',
      readTime: '7 min read',
      content: `The verification process is crucial to getting paid for your work. Understanding what gets approved and why will dramatically improve your success rate.

Our AI-powered verification system checks each submission against specific criteria. First, it verifies that you actually completed the task - if you were asked to like a video, we verify that you did. Second, it checks for authentic activity - we detect bot-like patterns and reject them.

When submitting proof, clarity is essential. Screenshots must be legible and show the required action clearly. For social media tasks, we need to see your username, the target content, and the action taken (like, comment, share, etc.).

Submission timing matters too. Submit proof within the time limit specified in the task instructions. Some tasks require completion within specific timeframes. Delayed submissions are more likely to be questioned.

The verification timeline typically ranges from 1-24 hours. Straightforward submissions verify faster, while complex submissions involving multiple accounts or unusual activity patterns take longer for manual review.

To avoid rejection, always read instructions carefully, take clear screenshots, and submit immediately after task completion. Never attempt to trick the system with edited images or false claims. Our AI catches these attempts consistently.

Common rejection reasons include: low-quality proof, timing violations, bot-like patterns, or incomplete task requirements. If rejected, contact support for detailed feedback and try again with corrections.`,
    },
    {
      id: '3',
      title: 'Beginner\'s Guide: Your First Week on SRK Task',
      excerpt: 'Everything you need to know to succeed in your first week and build the foundation for long-term earnings.',
      category: 'Getting Started',
      date: 'March 10, 2026',
      readTime: '8 min read',
      content: `Your first week on SRK Task sets the foundation for your entire earning journey. Here's how to make it count.

Day 1-2: Complete Your Profile
Don't rush into tasks immediately. Spend your first day setting up a complete, professional profile. Upload a clear headshot, write a compelling bio, and select your interests. Creators prefer working with completed profiles.

Day 3-4: Explore the Platform
Familiarize yourself with the dashboard. Explore different task categories, read instructions carefully, and understand payment structures. Don't accept tasks yet - just observe and learn.

Day 5-7: Accept Your First Tasks
Start with "Easy" difficulty tasks. These are usually simple engagement tasks worth $0.50-$2. Complete them meticulously, maintaining 100% accuracy. Your goal is perfecting the process, not maximizing earnings yet.

First Week Goals:
- Complete at least 5-10 tasks
- Maintain 100% quality in submissions
- Build initial rating (target 4.5+ stars)
- Learn the verification process
- Understand payment timelines

Common Beginner Mistakes to Avoid:
1. Rushing through tasks - take your time and do quality work
2. Low-quality proof - take clear, detailed screenshots
3. Ignoring instructions - read every word of task requirements
4. Multiple accounts - one account per person only
5. Unrealistic expectations - it takes time to level up

By the end of your first week, you should have completed several tasks, developed a workflow, and positioned yourself for higher-paying opportunities in week two and beyond. Remember, your early performance determines your future earning potential.`,
    },
    {
      id: '4',
      title: 'Safety Tips: Protecting Your Account and Earnings',
      excerpt: 'Essential security practices to keep your account safe and protect your hard-earned money.',
      category: 'Security',
      date: 'March 8, 2026',
      readTime: '6 min read',
      content: `Your account security is critical to protecting your earnings. Follow these essential practices.

Password Security:
Create a strong password with at least 12 characters mixing uppercase, lowercase, numbers, and special characters. Never share your password with anyone. Use a password manager to securely store your credentials.

Enable Two-Factor Authentication:
This adds an extra security layer requiring a code from your phone to log in. Even if someone gets your password, they can't access your account without your phone.

Verify Communications:
Official SRK Task communications only come from @srktask.com email addresses or the official app. Be wary of suspicious emails asking for personal information or passwords. SRK support will never ask for your full password - legitimate support only needs your email and limited verification details.

Safe Task Completion:
Never click suspicious links in task instructions. Before completing social media tasks, ensure you're on the legitimate platform. Report tasks with suspicious requirements.

Wallet Security:
Don't share your wallet information with anyone except during legitimate withdrawals. Double-check withdrawal addresses - scammers sometimes try to redirect payments.

Suspicious Activity Response:
If you notice unauthorized logins or unfamiliar activity, change your password immediately and contact support. We can review unusual activity and take protective action.

Email Verification:
Keep your email updated and regularly review connected accounts. Disconnect any unfamiliar devices from your account.

Remember: SRK Task security team works 24/7 to protect members. Always report suspicious activity immediately.`,
    },
    {
      id: '5',
      title: 'Task Categories Explained: Find Your Best Fit',
      excerpt: 'Understanding different task types, payment ranges, and which categories suit different users best.',
      category: 'Platform Guide',
      date: 'March 5, 2026',
      readTime: '7 min read',
      content: `SRK Task offers diverse task categories. Understanding each helps you find your perfect fit.

Social Media Engagement ($0.50-$5):
Like, comment, share, or follow on social media platforms. These are easiest to complete but pay less. Perfect for beginners building ratings or people with flexible schedules.

Content Creation ($5-$50):
Create and post original content - stories, videos, or posts. Requires more effort and creativity but pays significantly more. Ideal for skilled content creators.

Follower Growth ($2-$20):
Grow account followers for creators through various methods. Medium difficulty with good pay rates. Popular with experienced users.

Brand Collaboration ($10-$100+):
Work with actual brands on specialized tasks - product reviews, unboxing, or promotional content. Premium tasks requiring high ratings.

Survey & Research ($3-$15):
Fill surveys or participate in research studies. Fast and easy, good for quick earnings. Usually takes 5-15 minutes.

Video Tasks ($5-$50):
Create, edit, or curate videos based on creator specifications. Requires technical skills but high pay. Best for video enthusiasts.

Coaching & Consultation ($20-$200):
Share expertise in your field. Highest-paying category but requires proven expertise and high ratings to unlock.

Finding Your Best Category:
Consider your skills, available time, and interest level. Beginners should start with engagement tasks to build ratings. As you progress, explore higher-paying categories matching your skills. Top earners typically focus on 2-3 categories where they excel.

Payment rates vary by task complexity, creator demand, and your rating level. Higher-rated users earn more in every category.`,
    },
    {
      id: '6',
      title: 'Withdrawal Methods & Payment Guide',
      excerpt: 'Everything about withdrawing your earnings - methods, timelines, fees, and troubleshooting.',
      category: 'Payments',
      date: 'March 1, 2026',
      readTime: '6 min read',
      content: `Understanding your withdrawal options ensures you can access your earnings easily.

Available Withdrawal Methods:

Bank Transfer:
The most common method. Transfers typically process within 2-5 business days. Fees are usually low (0.5-1%). International transfers may take 5-10 business days.

Digital Wallets (eSewa, Khalti):
For Nepal-based members. Instant or same-day transfers with minimal fees. Most convenient for local users.

Mobile Money:
Available in specific regions. Typically processes within 24 hours with minimal fees.

Cryptocurrency (Beta):
For tech-savvy users. Instant transfers but slightly higher volatility. Subject to additional verification.

Withdrawal Process:
1. Access your wallet dashboard
2. Click "Request Withdrawal"
3. Enter your withdrawal amount (check minimum balance)
4. Select your preferred payment method
5. Enter payment details (bank account, wallet ID, etc.)
6. Verify one-time password
7. Confirm and submit

Minimum Withdrawal Amounts:
- Bank Transfer: $10 (or local equivalent)
- Digital Wallets: $5
- Cryptocurrency: $20

Common Questions:

Why is my withdrawal pending?
Most withdrawals process within 2-5 business days. Bank delays, verification requirements, or system checks can extend this. Contact support if it exceeds 7 days.

Are there fees?
Yes, minimal fees apply (0.5-2% depending on method). Fees are deducted from your withdrawal amount.

Can I withdraw partial earnings?
Yes, as long as you meet the minimum withdrawal amount.

What if I made a mistake entering bank details?
Contact support immediately. They can stop the transfer if it hasn't been processed.

Is my money secure?
Yes, all transactions use 256-bit encryption. Your financial information is protected securely.`,
    },
  ];

  const categories = Array.from(new Set(posts.map(post => post.category)));

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
              Help Center & <span className="text-[#e1ba73]">Blog</span>
            </h1>
            <p className="text-xl text-gray-400">
              Expert tips, guides, and insights to help you succeed on SRK Task. 
              Learn from our community and maximize your earning potential.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-8 hover:border-[#e1ba73]/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#e1ba73] text-black px-3 py-1 rounded-full text-sm font-bold">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar size={16} />
                    {post.date}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{post.readTime}</span>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#e1ba73] transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="text-gray-400 text-sm line-clamp-3 mb-6 bg-white/[0.02] p-4 rounded-lg">
                {post.content.slice(0, 200)}...
              </div>

              <div className="flex items-center gap-2 text-[#e1ba73] font-bold group-hover:gap-3 transition-all">
                <span>Read More</span>
                <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="border-t border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Browse by <span className="text-[#e1ba73]">Category</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const categoryPosts = posts.filter(post => post.category === category);
              const categoryIcons: Record<string, string> = {
                'Tips & Tricks': '💡',
                'Platform Guide': '📘',
                'Getting Started': '🚀',
                'Security': '🔐',
                'Payments': '💳',
              };

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-[#e1ba73]/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{categoryIcons[category] || '📄'}</span>
                    <h3 className="text-xl font-bold">{category}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'}
                  </p>
                  <button className="text-[#e1ba73] text-sm font-bold hover:gap-2 transition-all">
                    Explore →
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
            <BookOpen className="text-[#e1ba73]" />
            Need More Help?
          </h2>
          <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
            Explore our comprehensive resources to find answers and maximize your SRK Task experience.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/faq"
              className="inline-block bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all duration-300"
            >
              View FAQ
            </Link>
            <Link
              to="/getting-started"
              className="inline-block bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-lg hover:border-[#e1ba73]/50 transition-all duration-300"
            >
              Getting Started
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-lg hover:border-[#e1ba73]/50 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};
