import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock } from 'lucide-react';
import { useEffect } from 'react';

interface BlogPostType {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  content: string;
}

const blogPostsData: BlogPostType[] = [
  {
    id: '1',
    slug: 'online-learning-future-education',
    title: 'The Future of Online Learning: Trends Shaping Education',
    excerpt: 'Discover how online education is revolutionizing the learning landscape.',
    category: 'Education Trends',
    date: 'March 20, 2026',
    author: 'SRK University Team',
    readTime: '8 min',
    image: '📚',
    content: `Online learning has transformed how we acquire knowledge and skills. What started as a supplementary option has become a primary choice for millions of learners worldwide.

## The Evolution of Online Learning

Over the past decade, online education has evolved from simple video lectures to comprehensive, interactive learning ecosystems. Today's platforms offer:

- Real-time interaction with instructors and peers
- Personalized learning paths based on individual needs
- Gamification and micro-credentials
- AI-powered adaptive learning systems
- Live webinars and group projects
- Industry-recognized certifications

## Key Trends in 2026

### 1. Hybrid Learning Models
Combining online and offline experiences provides flexibility with personal interaction.

### 2. AI-Powered Personalization
Artificial intelligence adapts content delivery to individual learning styles and pace.

### 3. Micro-credentials and Stackable Certificates
Instead of lengthy degrees, learners earn bite-sized credentials that stack into larger qualifications.

### 4. Community-Driven Learning
Peer learning and community support have become central to online education success.

### 5. Skills-Based Education
Focus has shifted from degrees to specific, industry-relevant skills.

## Why Online Learning is Here to Stay

The flexibility, affordability, and accessibility of online learning make it an essential part of the educational landscape. Whether you're looking to upskill, change careers, or pursue a passion, online education offers unprecedented opportunities.

At SRK University, we've built our platform on these principles, combining expert instruction with community support and career advancement opportunities.`,
  },
  {
    id: '2',
    slug: 'digital-marketing-skills-2026',
    title: 'Essential Digital Marketing Skills You Need in 2026',
    excerpt: 'Master the digital marketing skills that employers want.',
    category: 'Career Development',
    date: 'March 18, 2026',
    author: 'Marketing Expert',
    readTime: '10 min',
    image: '📊',
    content: `In 2026, digital marketing skills are more valuable than ever. The landscape continues to evolve, and staying current is critical for career success.

## Core Digital Marketing Skills

### 1. SEO and Content Marketing
Search engine optimization remains fundamental. Understanding keyword research, on-page optimization, and content strategy is essential.

### 2. Social Media Strategy
Different platforms require different approaches. Mastery across multiple channels is increasingly important.

### 3. Data Analytics
Making data-driven decisions separates successful marketers from the rest. Learn to interpret metrics and optimize campaigns accordingly.

### 4. Email Marketing
Despite its age, email remains one of the highest-ROI marketing channels when done correctly.

### 5. Video Marketing
Video content dominates online platforms. Creating engaging videos is now essential.

### 6. Paid Advertising
Mastering platforms like Google Ads and Facebook Ads is crucial for generating immediate results.

## Emerging Skills for 2026

- AI in marketing automation
- Marketing analytics and attribution modeling
- Voice search optimization
- Marketing technology stack management
- Content personalization

## How to Build These Skills

The best way to develop digital marketing skills is through hands-on practice and continuous learning. Join our comprehensive digital marketing course to start building expertise today.`,
  },
  {
    id: '3',
    slug: 'entrepreneurship-startup-guide',
    title: 'From Idea to Launch: Your Complete Startup Guide',
    excerpt: 'Learn the practical steps to turn your business idea into a successful startup.',
    category: 'Entrepreneurship',
    date: 'March 16, 2026',
    author: 'Business Mentor',
    readTime: '12 min',
    image: '🚀',
    content: `Starting a business is challenging but rewarding. This guide walks you through each stage of the journey.

## Stage 1: Validation
Before investing time and money, validate your idea:
- Talk to potential customers
- Research your market
- Identify your competition
- Understand the demand

## Stage 2: Planning
Create a solid business plan:
- Define your value proposition
- Outline your business model
- Project your financials
- Identify risks and mitigation strategies

## Stage 3: Building
Start with a minimum viable product (MVP):
- Focus on core features
- Get to market quickly
- Gather customer feedback
- Iterate based on learning

## Stage 4: Launching
Go live with confidence:
- Build initial customer base
- Perfect your go-to-market strategy
- Establish brand identity
- Create marketing momentum

## Stage 5: Growing
Scale what works:
- Refine your offering based on feedback
- Build your team
- Expand your customer base
- Optimize your operations

## Key Resources You'll Need

- Capital (personal savings, loans, or investors)
- Time and commitment
- Supportive network
- Continuous learning mindset

Remember, every successful founder started exactly where you are now. The key is taking action and learning from experience.`,
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
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      return (
        <p key={index} className="text-gray-300 mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-orange-400/20 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-600 to-orange-500 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-4xl mb-6">{post.image}</div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-orange-700 text-orange-100 px-3 py-1 rounded-full text-xs font-bold">
              {post.category}
            </span>
            <span className="text-orange-100 text-sm">{post.date}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-orange-100 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-invert max-w-none">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-400/30 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Learn More?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of students learning at SRK University.
          </p>
          <Link
            to="/packages"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
