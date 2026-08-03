import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { PrimaryButton } from '../components/ReusableComponents';

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
    content: `I made a decision 3 years ago that changed my trajectory. Instead of spending six figures on a traditional degree, I enrolled in an online course. Cost me $500. By the end, I had three job offers.

That's not an exaggeration or a lucky story. That's becoming the norm now.

The traditional education path is broken for most people. Four years, massive debt, and no guarantee the skills are current when you graduate? Online learning obliterated that model.

## Why This Shift Actually Matters

My niece just told me she's learning digital marketing online while working at a startup. She's applying what she learns immediately. Three months in, she's already hired as a junior marketer because she actually knows what she's doing.

Compare that to her cousin who graduated with a business degree last year. Still looking for entry-level positions. The difference? One learned skills that were immediately relevant. One learned theory.

Online education forced a reckoning: Either teach practical, applicable skills or nobody enrolls.

## What's Happening in 2026

The online platforms that survived figured something out - people don't want lectures. They want guided paths with real projects, community feedback, and verifiable credentials.

I watched my neighbor struggle for a month trying to learn UI design. Kept doing tutorial after tutorial. Then someone told her about project-based learning. Purchase a course, spend 8 weeks building actual client-ready projects, get feedback from working designers.

She's freelancing now. Making more than her 9-to-5 job offered.

The micro-credential explosion is real too. Instead of one massive degree, people now earn stacked credentials. Finish a React course, get a certificate. Finish state management, get another. Stack those certificates and suddenly you're employable as a developer.

Companies actually prefer this now. Specific skills > general degree.

## The Community Factor (The Part Everyone Misses)

Here's something that surprised me - the learning community became the actual value.

I spent two years learning in isolation (online tutorials, books, etc.). Then I joined an online cohort-based program. The difference? Having 30 people learning the same thing simultaneously, facing the same struggles, sharing solutions?

That community accountability changed everything. People actually finish courses now.

One student told me she was about to drop out halfway through a course. Struggling with a concept. Posted in the course community at 2 AM. Had three answers before morning. Persisted. Got a job six months later partly because of connections she made in that community.

## The Real Future

The future isn't about digital vs. traditional. It's about learning that actually works.

That means:
- Projects over lectures
- Practice over memorization
- Immediate application over theoretical preparation
- Community over isolation
- Flexible scheduling so you don't have to quit your job

I'm not saying traditional education is dead. But the online model forced higher standards on everyone.

If you're considering online learning, the bar is actually pretty high now. Most surviving platforms are genuinely good. They had to be.`,
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
    content: `I interviewed someone last month who was asked by her manager "why aren't our ads converting?" She had no idea how to analyze it. Spent days creating reports nobody could interpret.

Week later, she completed a digital marketing course focused on analytics. Same question came up. Different result - she diagnosed the problem in 10 minutes. Recommended three changes. All of them worked.

That's what changed in digital marketing. It's not enough to create nice posts anymore.

## The Skills That Actually Get You Hired

**Analytics First:** Every good marketer I know obsesses over numbers. They don't guess. They check the data.

I watched someone spend weeks optimizing content that wasn't converting. Had beautiful writing, great graphics, zero engagement. Someone looked at the analytics, realized the audience was mobile-only, redesigned for mobile.

Traffic tripled.

Analytics isn't optional anymore. Employers literally ask about it in interviews now.

**SEO Still Wins:** Everyone thinks SEO is dead. It's not. It's just evolved.

My friend worked at a coffee e-com startup. Tried paid ads. Expensive, competitive, margins terrible. Started investing in SEO - keyword research, content that actually answered questions, technical optimization.

Year later? 60% of their traffic is organic. Paid ads feel like waste now.

The people making money in digital marketing understand one truth: SEO builds assets. Ads spend money. Build assets first.

**Social Strategy (Not Just Posting):** There's a difference between having a social account and having a social strategy.

I see people post constantly. No followers. No engagement. No business results.

Then I see accounts posting twice a week with massive engagement. Difference? Strategy. They understand their audience. They're solving a problem. They build community.

One TikTok creator I know focuses on one specific topic within fitness. Hyper-niche. No algorithm was going to favor her. But her 20,000 followers become customers regularly. Her engagement is 30x higher than generic fitness accounts with 500K followers.

Strategy beats volume.

**The Skill Everyone Overlooks - Data Storytelling:** You can have perfect analytics. Means nothing if you can't communicate it.

I watched a junior marketer lose a promotion because she couldn't translate data into decisions. Had all the right numbers. Couldn't tell a compelling story that led to action.

Her colleague with fewer analytical skills but better storytelling? Got the promotion. Numbers showed what happened. Story showed why it mattered.

## What Changed Since Last Year

AI tools exploded. Now you can:
- Generate initial content (then edit it heavily)
- Automate routine tasks
- Analyze competitor strategies faster
- Segment audiences automatically

But this created a new problem - everyone has access to the same tools. So the people winning are those who combine AI tools with actual strategic thinking.

I know someone using ChatGPT to generate 50 social media post ideas. All average. Watched someone manually research their audience deeply, then use AI as a writing assistant to refine one post. That post gets 10x engagement.

Tools amplify existing skill. They don't replace strategy.

## The Honest Truth

If you're learning digital marketing hoping it's easy - it's not. But if you're willing to understand your audience, test constantly, and learn from data?

This is one of the highest-ROI skill investments you can make right now. Businesses desperately need people who can move the needle on revenue.

Marketers who combine analytics, strategy, and communication are basically writing their own paychecks.`,
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
    content: `I want to start with the honest part. Half the startups I knew last year don't exist anymore. Some pivoted. Some died. Some are thriving.

The difference wasn't the idea. It was execution and founder mentality.

## The Graveyard of Bad Ideas (That Were Actually Good)

I met someone with a killer idea 2 years ago. She spent 8 months perfecting a product nobody asked for.

Spent $50K. Built something beautiful. Exactly zero customers.

Month later, I met someone else with a mediocre-sounding idea. Spent $2K. Launched in 2 weeks. Had 100 paying customers in month one.

What's the difference? The second person talked to customers first. Built something real people wanted. Launched imperfectly instead of perfectly.

## The Actual Path (Not the Startup Myth)

**Start With Validation, Not Perfection**

Before you spend a dollar, solve this: Do people actually want this?

Don't survey random people online. Literally talk to humans who would buy from you. I mean really talk to them. Buy them coffee. Ask what they struggle with. Listen to understand, not to pitch.

One founder told me she talked to 40 potential customers before building anything. Learned that the problem she wanted to solve wasn't the actual problem. The actual bottleneck was different.

She pivoted before spending development money. That single insight probably saved her 6 months and $50K.

**Build the Minimum Viable Product**

Here's where I see people get it wrong. MVP doesn't mean ugly or unfinished. It means "what's the smallest version that solves the core problem?"

I watched someone spend 6 months building a social platform with messaging, notifications, recommendations, groups, etc. Nobody wanted it.

Someone else built a basic version (single feature, solved one specific problem) in 2 weeks. Had 50 users testing it week one.

The second one learned more in 4 weeks than the first one learned in 6 months. Some things they learned forced a complete pivot.

The first person wasted months on features nobody needed. The second person was agile.

**Talk to Your Customers Constantly**

This is less a step and more a mindset shift.

One founder I know still handles customer support even though she has a team now. She's learning constantly what bothers people, what they wish existed, what they misunderstand.

Competition can't see that. Competitors look at feature parity. This founder is learning actual human frustrations.

Her product evolves based on real problems. Not guesses.

## The Numbers Matter (But Not How You Think)

Everyone wants to talk revenue projections. Nobody cares about your spreadsheet. Focus on unit economics.

Can you acquire one customer profitably? If Yes, you have a business. Scale it.
If No, fix it before scaling.

One founder I know was obsessed with growth. Adding features, spending on ads, hiring. Revenue was going up. Profitability per customer was going down.

Got worse until she hit a wall. Couldn't hire more people without losing money.

She stepped back. When she finally looked at customer acquisition cost vs. lifetime value?

She was spending $200 to acquire customers generating $50.

She refocused. Cut back features. Optimized for high-value customers. Reduced ad spend but got profitable. Now growing profitably.

## The Founder Mentality

The best founders I know share something: They're not married to their original idea. They're married to solving the problem.

When data disagreed with their assumption, they shifted. Sometimes dramatically.

One founder's original idea was a B2B software product. After talking to customers, realized they'd be better served as an agency first, then productize later.

Different path than planned. Better outcome.

## Real Timeline Expectations

If you're building right, this takes time:
- Month 1: Talk to customers, validate problem
- Month 2: Build MVP, show 10 people
- Month 3-4: Launch, get 50 real users
- Month 5-6: Understand their actual pain points, iterate
- Month 7+: Reality about scalability hits

That's if you're moving fast and learning constantly.

Slow it down? Add 6 months easily.

The people launching in 2 weeks? They built on shaky foundations. Many fail.
The people waiting 18 months for perfection? Almost all fail from the start.

## The Uncomfortable Truth

Most startups fail. Not because the idea was bad. Not because the execution was lazy.

They failed because the founder couldn't sell, couldn't adapt, or couldn't persist through the hard parts.

The good news? You can control all of those.

Having the skill to talk to customers and get them to pay? That's more valuable than the idea.`,
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
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-primary">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-textPrimary/70">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      return (
        <p key={index} className="text-textPrimary/70 mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary">
      {/* Header */}
      <div className="sticky top-0 bg-bgPrimary/90 backdrop-blur border-b border-primary/20 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-bgSecondary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-4xl mb-6">{post.image}</div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {post.category}
            </span>
            <span className="text-textPrimary/50 text-sm">{post.date}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-textPrimary">{post.title}</h1>
          <div className="flex items-center gap-6 text-textPrimary/60 text-sm">
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
        <Card className="bg-bgSecondary text-textPrimary mt-16 p-4">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">Ready to Learn More?</h2>
            <p className="text-textPrimary/70 mb-6">
              Join thousands of students learning at SRK University.
            </p>
            <Link to="/packages" className="mx-auto">
              <PrimaryButton label="Browse Courses" />
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;
