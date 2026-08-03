import { useState } from 'react';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';

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
    <div className="min-h-screen bg-bgPrimary text-textPrimary p-4 sm:p-8">
      <div className="max-w-6xl mx-auto sm:py-10">
        <h1 className="text-4xl pt-8 pb-4 font-bold text-center text-textPrimary">
          SRK University Blog
        </h1>
        <p className="text-center text-textPrimary/70 mb-12 text-lg">
          Expert insights, industry trends, and learning tips to accelerate your success
        </p>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bgSecondary border-b border-primary/40 rounded-lg pl-12 pr-4 py-3 text-textPrimary placeholder-textPrimary/40 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-custom-gradient text-black'
                  : 'bg-bgSecondary text-textPrimary/70 hover:text-textPrimary'
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
                    ? 'bg-custom-gradient text-black'
                    : 'bg-bgSecondary text-textPrimary/70 hover:text-textPrimary'
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
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <Card className="bg-bgSecondary text-textPrimary h-full hover:ring-1 hover:ring-primary/50 transition-all">
                <CardBody className="p-6">
                  <div className="text-4xl mb-4">{post.image}</div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-textPrimary/50 text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-textPrimary/60 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-textPrimary/50">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readTime} read</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight size={16} />
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-textPrimary/60 text-lg">
              No articles found matching your search. Try different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
