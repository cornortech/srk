import { useState } from 'react';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
}

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const blogPosts: BlogPostType[] = [
    {
      id: '1',
      slug: 'online-learning-future-education',
      title: 'The Future of Online Learning: Trends Shaping Education',
      excerpt: 'Discover how online education is revolutionizing the learning landscape and what it means for students and educators worldwide.',
      category: 'Education Trends',
      date: 'March 20, 2026',
      author: 'SRK University Team',
      readTime: '8 min',
      image: '📚'
    },
    {
      id: '2',
      slug: 'digital-marketing-skills-2026',
      title: 'Essential Digital Marketing Skills You Need in 2026',
      excerpt: 'Master the digital marketing skills that employers want, from social media strategy to data analytics.',
      category: 'Career Development',
      date: 'March 18, 2026',
      author: 'Marketing Expert',
      readTime: '10 min',
      image: '📊'
    },
    {
      id: '3',
      slug: 'entrepreneurship-startup-guide',
      title: 'From Idea to Launch: Your Complete Startup Guide',
      excerpt: 'Learn the practical steps to turn your business idea into a successful startup from day one.',
      category: 'Entrepreneurship',
      date: 'March 16, 2026',
      author: 'Business Mentor',
      readTime: '12 min',
      image: '🚀'
    },
    {
      id: '4',
      slug: 'web-development-career-path',
      title: 'The Complete Web Development Career Path for 2026',
      excerpt: 'Everything you need to know about becoming a professional web developer and landing your first job.',
      category: 'Technology',
      date: 'March 14, 2026',
      author: 'Tech Lead',
      readTime: '11 min',
      image: '💻'
    },
    {
      id: '5',
      slug: 'affiliate-marketing-success',
      title: 'How to Build a Profitable Affiliate Marketing Business',
      excerpt: 'Proven strategies used by successful affiliates to generate consistent experience through referrals.',
      category: 'Affiliate Marketing',
      date: 'March 12, 2026',
      author: 'Affiliate Manager',
      readTime: '9 min',
      image: '💰'
    }
  ];

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">SRK University Blog</h1>
          <p className="text-xl text-orange-100">
            Expert insights, industry trends, and learning tips to accelerate your success
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 text-orange-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-orange-400/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {filteredPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-slate-700/50 border border-orange-400/20 rounded-lg overflow-hidden hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{post.image}</div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <span>{post.readTime} read</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-orange-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Read More</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No articles found matching your search. Try different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
