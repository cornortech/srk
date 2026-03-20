import { motion } from 'framer-motion';
import { ArrowLeft, User, Share2, Clock } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';
import { useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  content: string;
  slug: string;
}

const blogPostsData: BlogPost[] = [
  {
    id: '1',
    slug: 'earn-1000-monthly-task-platform',
    title: 'How to Earn $1,000+ Monthly on Task Platforms: Complete Strategy',
    excerpt: 'Discover proven strategies used by top earners to generate consistent $1,000+ monthly income from completing verified tasks.',
    category: 'Earning Strategies',
    date: 'March 18, 2026',
    author: 'SRK Task Team',
    readTime: '12 min',
    image: '📈',
    content: `Earning $1,000 or more monthly on task platforms is entirely achievable with the right strategy and consistent effort. Many SRK Task members generate significant monthly income by understanding platform mechanics, optimizing their workflow, and scaling their operations strategically.

## Understanding the Income Potential

Task platforms like SRK Task offer diverse earning opportunities ranging from simple social media engagement tasks ($0.50-$2) to premium tasks that pay $50-$200+. The income structure is designed so that users who build higher ratings and specialize in certain task types can significantly increase their hourly rate.

## The 5-Step Strategy to $1,000+ Monthly

### Step 1: Build Your Profile Rating Fast (Week 1-2)

Your rating is everything on task platforms. It determines which tasks you can access and how much you can earn. Start by:

- Completing at least 20-30 "Easy" difficulty tasks first
- Maintaining 100% accuracy - don't rush through work
- Taking clear, high-quality proof submissions
- Reading every instruction word-for-word
- Submitting proof immediately after task completion

This foundational work builds your reputation. Users who reach 4.8+ stars in their first 2-3 weeks unlock premium tasks paying 3-4x more than beginner tasks.

### Step 2: Identify High-Paying Task Categories (Week 3-4)

Not all tasks pay equally. Analyze which categories generate the best hourly rates:

**High-Paying Categories:**
- Brand collaboration tasks: $10-$50 per task (15-30 minutes)
- Content creation: $15-$100+ per task (30-60 minutes)
- Influencer growth tasks: $5-$25 per task (10-20 minutes)
- Video creation: $20-$100+ per task (varies)

**Medium-Paying Categories:**
- Social media engagement: $2-$5 per task (5-15 minutes)
- Survey completion: $3-$15 per task (5-20 minutes)

If you're earning $2-3 per task but it takes 20 minutes, that's only $6-9 per hour. Focus instead on tasks paying $10-15 that take 15-20 minutes ($30-60 per hour).

### Step 3: Optimize Your Workflow (Week 5+)

Create a system that maximizes efficiency without compromising quality.

### Step 4: Specialize in Premium Categories (Month 2+)

Once your rating is 4.7+, you unlock access to premium tasks that pay significantly more.

### Step 5: Build Multiple Income Streams

Advanced earners don't rely on single task types. They diversify their portfolio to manage risk while maximizing income potential.

## Conclusion

Earning $1,000+ monthly on SRK Task is realistic with dedication and strategy. Most successful users reach this milestone within 2-3 months of consistent effort.`,
  },
  {
    id: '2',
    slug: 'avoid-task-rejection-complete-guide',
    title: 'Why Your Tasks Get Rejected: Complete Guide to Avoiding Rejections',
    excerpt: 'Learn the top reasons tasks get rejected and exact proven methods to ensure your submissions get approved quickly.',
    category: 'Platform Tips',
    date: 'March 16, 2026',
    author: 'SRK Task Team',
    readTime: '10 min',
    image: '❌',
    content: `Task rejections are one of the fastest ways to damage your rating and reduce your earning potential. Understanding why rejections happen and how to prevent them is critical to success on SRK Task.

## Why Task Rejections Happen

Our verification system uses strict criteria to maintain platform quality. Tasks are rejected for specific reasons that you can avoid.

### The 5-Point Rejection Prevention Checklist

Before submitting ANY task, verify these critical points to ensure approval.

## Recovery from Rejections

If your task IS rejected, follow these steps to understand why and improve next time.

## Conclusion

Focus on rejection-free completion. One perfect task is better than three attempted tasks with rejections.`,
  },
  {
    id: '3',
    slug: 'best-time-complete-tasks-earn-more',
    title: 'Best Times to Complete Tasks: When to Earn Maximum Money',
    excerpt: 'Strategic timing can increase your earnings by 300%. Learn when tasks pay the most and when to schedule your work.',
    category: 'Earning Strategies',
    date: 'March 14, 2026',
    author: 'SRK Task Team',
    readTime: '8 min',
    image: '⏰',
    content: `Timing isn't just about meeting deadlines - it's about maximizing earnings. Strategic task scheduling can increase your hourly rate by up to 300%.

## The Task Supply and Demand Cycle

Task availability and pay rates follow predictable patterns based on creator activity, social media peak hours, marketing campaigns, and seasonal trends.

## Optimal Times to Complete Tasks

### Peak Earning Hours (Best Rates)

Tuesday-Thursday, 10 AM - 2 PM (IST) typically offers the best premium tasks with 20-50% higher rates.

### High-Volume Hours (More Opportunities)

Evening 6-10 PM offers maximum task volume for those who prefer quantity over premium rates.

## Days Matter More Than You Think

The day of the week significantly impacts both task availability and payment rates.

## Your Action Plan

Implement strategic timing to see measurable improvements in your earnings within one week.`,
  },
  {
    id: '4',
    slug: 'building-social-media-presence-tasks',
    title: 'How to Build a Powerful Social Media Presence for Premium Tasks',
    excerpt: 'Premium tasks require strong social media presence. Learn how to build accounts that unlock high-paying opportunities.',
    category: 'Platform Tips',
    date: 'March 12, 2026',
    author: 'SRK Task Team',
    readTime: '11 min',
    image: '📱',
    content: `Your social media presence directly determines which premium tasks you can access and how much you earn. Accounts with strong engagement, genuine followers, and active presence unlock deals paying 5-10x more than basic tasks.

## Why Social Presence Matters on SRK Task

Premium task creators check:
1. Account age (must be 6+ months old)
2. Follower count (500+ preferred)
3. Engagement rate
4. Follower quality
5. Post frequency
6. Niche fit

The difference is dramatic:
- New account with 200 followers: Limited to $2-5 tasks
- Established account with 5,000+ followers: Access to $25-100+ tasks

## Building Your Account the Right Way

### Phase 1: Foundation (Month 1)
Set up your account with compelling bio, professional photo, and consistent posting schedule.

### Phase 2: Growth (Month 2-3)
Focus on creating engaging content and building genuine audience connections.

### Phase 3: Optimization (Month 4+)
Achieve premium account status with 3,000-5,000+ followers and consistent engagement.

## Your Action Plan

By month 4-6, you can start earning $500-2,000+ monthly from premium brand tasks exclusively.`,
  },
  {
    id: '5',
    slug: 'security-tips-protect-account',
    title: 'Ultimate Security Guide: Protect Your SRK Task Account From Hackers',
    excerpt: 'Comprehensive security guide to protect your account, earnings, and personal information from threats.',
    category: 'Security & Safety',
    date: 'March 10, 2026',
    author: 'SRK Task Team',
    readTime: '9 min',
    image: '🔒',
    content: `Your SRK Task account holds real earnings and personal information. A security breach doesn't just compromise your account - it can result in financial loss and identity theft.

## The Real Risks

On platforms where money exists, hackers are active. Common attack vectors include phishing, weak passwords, shared credentials, public WiFi access, and social engineering.

## Your Security Action Plan

### 1. Password Security (Most Important)

Create an unbreakable password with:
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, and special characters
- No dictionary words or personal information
- Unique for every account

### 2. Two-Factor Authentication (2FA)

Enable 2FA immediately - this stops 99.99% of account attacks.

### 3. Phishing Email Protection

Learn to identify phishing attempts and never click email links for account actions.

### 4. Device and Network Security

Keep your devices updated and use VPN on public networks.

## Security Checklist

Complete these actions today to protect your account and earnings.`,
  },
];

export const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPostsData.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) {
    return null;
  }

  const otherPosts = blogPostsData.filter(p => p.slug !== slug).slice(0, 3);

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-300">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-bold text-gray-200 my-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || 
          line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ')) {
        return (
          <li key={index} className="ml-6 mb-2 list-decimal text-gray-300">
            {line.replace(/^\d\. /, '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className="text-gray-400 mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#e1ba73] text-black px-3 py-1 rounded-full text-xs font-bold">
                {post.category}
              </span>
              <span className="text-gray-400 text-sm">{post.date}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime} read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Featured Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-8"
        >
          {post.image}
        </motion.div>

        {/* Body Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Share Section */}
        <div className="border-t border-white/5 mt-16 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold mb-2">Found this helpful?</h4>
                <p className="text-gray-400">Share with others learning to maximize earnings on SRK Task</p>
              </div>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-all">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Posts */}
      {otherPosts.length > 0 && (
        <div className="border-t border-white/5 bg-gradient-to-b from-black via-[#0a0705] to-black py-20">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-12"
            >
              More Articles You'll Love
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-[#e1ba73]/50 transition-all duration-300 group flex flex-col"
                >
                  <div className="text-4xl mb-4">{relatedPost.image}</div>
                  <span className="bg-[#e1ba73] text-black px-2 py-1 rounded text-xs font-bold w-fit mb-3">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#e1ba73] transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <Link
                    to={`/blog/${relatedPost.slug}`}
                    className="text-[#e1ba73] text-sm font-bold hover:text-white transition-colors"
                  >
                    Read More →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/5 border border-[#e1ba73]/20 rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Apply These Strategies?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join SRK Task today and start earning with proven strategies shared by our top performers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/getting-started"
              className="bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-[#e1ba73]/20 transition-all"
            >
              Get Started Now
            </Link>
            <Link
              to="/blog"
              className="bg-white/10 border border-white/20 text-white font-bold px-8 py-3 rounded-lg hover:border-[#e1ba73]/50 transition-all"
            >
              Read More Articles
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};
