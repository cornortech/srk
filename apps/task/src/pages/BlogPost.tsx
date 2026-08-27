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
    title: 'How to progress the value Monthly on Task Platforms: Complete Strategy',
    excerpt: 'Discover proven strategies used by top earners to generate consistent value monthly experience from completing verified tasks.',
    category: 'Earning Strategies',
    date: 'March 18, 2026',
    author: 'SRK Task Team',
    readTime: '12 min',
    image: '📈',
    content: `Progressing values more monthly on task platforms is entirely achievable with the right strategy and consistent effort. Many SRK Task members generate significant monthly experience by understanding platform mechanics, optimizing their workflow, and scaling their operations strategically.

## Understanding the experience Potential

Task platforms like SRK Task offer diverse learning opportunities ranging from simple social media engagement tasks (0.50-2) to premium tasks that pay 50-200+. The experience structure is designed so that users who build higher ratings and specialize in certain task types can significantly increase their hourly rate.

## The Real Path

I started out like everyone else - doing every task I could find. Thought more tasks meant more money, right? Wrong. That's actually the slowest way to earn on these platforms.

What I realized after talking to top learners is that strategy beats grind every single time.

Your first priority should be building a 4.8+ star rating. Yes, ignore the money temporarily. A good rating literally unlocks 10x better tasks. Once you hit that threshold, the platform shows you different opportunities - brand partnerships, influencer growth campaigns, content creation gigs. All paying significantly more.

The interesting part? The jump from 500 to 1,500 monthly doesn't come from working longer hours. It comes from being selective about which tasks you accept. The top earners I spoke to were actually working fewer hours but making way more money because they focused only on premium task types.

One practical tip I picked up: Social media engagement tasks (1-3 range) aren't worth your time if you can find brand partnerships (20-50). Yes, some days have fewer options. But waiting for quality beats grinding on quantity tasks.`,
  },
  {
    id: '2',
    slug: 'avoid-task-rejection-complete-guide',
    title: 'Why Your Tasks Get Rejected: Complete Guide to Avoiding Rejections',
    excerpt: 'The truth about rejections (and how a single bad mistake tanked someone\'s rating)',
    category: 'Platform Tips',
    date: 'March 16, 2026',
    author: 'SRK Task Team',
    readTime: '10 min',
    image: '❌',
    content: `I watched a member lose their 4.9 star rating in a single week. One mistake, repeated a few times, and boom - blocked from premium tasks indefinitely.

That's when I realized how serious the rejection system actually is. It's not just about losing money on one task. Rejections compound. Your rating tanks. Access to good tasks disappears.

## What Actually Gets Rejected

The verification team is looking at specific things. And honestly? Most rejections are preventable.

Low-quality proof is the biggest culprit. I'm talking blurry screenshots where the required action isn't clearly visible. The system can't verify what it can't see. It's that simple.

I also learned about timing issues. Some tasks have specific windows. You submit proof 5 minutes late? Rejection. Not because the task wasn't completed - because it wasn't completed during the required timeframe. Read the fine print. It matters.

Another common one: doing the task on a brand new account. Some tasks require accounts that are X months old. If your YouTube account is 2 weeks old and the task requires 3 months, that's an automatic rejection. No amount of perfect proof changes that.

## Real Example That Stuck With Me

A user told me she was doing like 50 tasks a day. Fast submissions, impressive volume. Then her rating started dropping. She got 5 rejections in a row for "unclear proof submission."

Turns out she was screenshot-happy but not careful about it. She'd just snap a quick pic and submit. Half the time the required action wasn't even clearly visible in the screenshot.

She slowed down. Started taking 30 seconds more per task to get clear, well-framed proof. Rejections stopped. Rating recovered.

Moral of the story: Speed doesn't beat quality. Not on this platform.

## How to Actually Avoid This

First, read the task description twice. Not once. Twice. Most rejections happen because someone missed a specific requirement hidden in the instructions.

Second, take proof that makes it obvious you did the thing. If you're supposed to like a video, your screenshot should clearly show:
- The video you liked
- Your username visible
- The like button highlighted

Third, time matters. If there's a deadline, submit with time to spare. If the latest is "submit by 11:59 PM," don't submit at 11:57 PM.

Fourth, double-check your account meets the requirements. New account? Verify. Specific follower count needed? Check. It sounds obvious but people rush past these details constantly.

Here's the thing though - rejections happen even to careful people. The platform isn't perfect. If you get rejected but you're certain you followed everything correctly, contact support. They review appeals and will overturn legitimate rejections.`,
  },
  {
    id: '3',
    slug: 'best-time-complete-tasks-earn-more',
    title: 'Best Times to Complete Tasks: When to Progress maximum value',
    excerpt: 'Nobody talks about this, but timing can literally triple your hourly rate',
    category: 'Earning Strategies',
    date: 'March 14, 2026',
    author: 'SRK Task Team',
    readTime: '8 min',
    image: '⏰',
    content: `Here's something most people don't realize: The same task type pays completely different rates depending on when you look at it.

I was grinding tasks at random times and averaging maybe 60/day. Then someone mentioned that they specifically worked certain hours and made 150+ on the same day. Same tasks, same platform, completely different results.

That's when I started mapping task availability and payment rates by time.

## The Pattern I Found

Tuesday through Thursday mornings (around 9 AM - 2 PM) have the best premium tasks. Brand partnerships, influencer growth campaigns, content creation work. All the high-paying stuff. Why? Because that's when brand managers are typically at their desks, posting new campaigns.

Evenings (6 PM - 10 PM) have massive volume but mostly lower-pay work. Social media engagement, surveys, that kind of thing. Good if you want quantity, not quality.

Weekends? Honestly forget about it. Task volume drops significantly and what does show up is mostly the leftover low-pay stuff.

One guy I talked to basically works only Tuesday-Thursday mornings now and makes more than people grinding 6 days a week.

## The Thing Nobody Discusses

Premium tasks fill up in minutes. Like, legitimately 5-10 minutes sometimes. If you're checking the app randomly, you miss them every time.

The people making premium money check consistently during peak hours. They've optimized their schedule around when the best opportunities appear.

It sounds obvious when I say it now, but most people just load the app whenever and wonder why they see garbage tasks. The algorithm isn't rigged - they're just looking at the leftover inventory.

## What I Actually Do Now

I check the app around 9:30 AM, noon, and 3 PM on weekdays. Takes literally 2 minutes each time. If I see a premium task, I drop what I'm doing and do it.

Yeah, I make less total tasks completed than I used to. But I make way more money because I'm cherry-picking the best opportunities rather than doing everything available.

On weekends, I basically don't use the platform. The ROI is terrible compared to weekday peak hours.`,
  },
  {
    id: '4',
    slug: 'building-social-media-presence-tasks',
    title: 'How to Build a Powerful Social Media Presence for Premium Tasks',
    excerpt: 'The uncomfortable truth: Your Instagram followers determine your experience ceiling',
    category: 'Platform Tips',
    date: 'March 12, 2026',
    author: 'SRK Task Team',
    readTime: '11 min',
    image: '📱',
    content: `I met someone on SRK Task making 500/month who couldn't access the tasks that would pay her 3,000/month. The only difference? Account age and follower count.

Premium brand tasks literally aren't available to accounts that don't meet certain criteria. It's not unfair - it's just how authentic influence works. Brands want to partner with real accounts, not new burners.

## Why Your Social Presence Matters More Than You Think

Brand creators checking your profile see:
- Account age (brands typically want 6+ months minimum)
- Follower count (500+ preferred, 1000+ ideally)
- Engagement rates (are people actually interacting?)
- Post history (do you actually use this account or is it dormant?)
- Niche fit (does your content match what they're promoting?)

The earning difference is dramatic. Someone with a 200-follower burner account? Locked out of brand deals. Someone with 5,000 followers and real engagement? Access to 500-2000/month opportunities.

I realized I was leaving enormous amounts of money on the table by not treating social media strategically.

## Here's What Actually Works

Month 1: Stop obsessing over viral content. Just post consistently 3-4 times per week. Use relevant hashtags. Reply to comments. Your account needs to look alive and authentic.

Month 2-3: Focus on your niche. If you're financial content, post about finance. If wellness, post wellness content. Brands look for accounts where their product fits naturally.

Month 3-4: Aim for 2,000-5,000 followers by this point if you're doing it right. This opens up most premium brand partnerships.

The weird part? You don't need 100,000 followers. Brands actually prefer 3,000-10,000 accounts. Highly engaged micro-influencers convert better than massive followings.

## The Timeline Most People Don't Talk About

If you build a 5,000-follower account from scratch, you're looking at 4-6 months of consistent posting. Not fun, but realistic. Then? Premium tasks that pay value monthly become available to you.

Some people outsource this (hiring engagement growth services) but honestly, that gets risky. Building it organically takes longer but is safer.

One member told me she spent 5 months building her accounts before accessing premium tasks. Then she made back all that time investment in earnings within 2 months.

## Real Talk

The people making the most money on SRK Task aren't doing it with one small account. They're running 2-4 accounts across different niches, each with decent followings. Diversification is real.

If you only have a 300-follower account, you're basically limited to basic engagement tasks forever. Nothing wrong with that, but know the ceiling. Growth doesn't happen by accident.`,
  },
  {
    id: '5',
    slug: 'security-tips-protect-account',
    title: 'Ultimate Security Guide: Protect Your SRK Task Account From Hackers',
    excerpt: 'Comprehensive security guide to protect your account, learnings, and personal information from threats.',
    category: 'Security & Safety',
    date: 'March 10, 2026',
    author: 'SRK Task Team',
    readTime: '9 min',
    image: '🔒',
    content: `I watched someone lose 8,000 in accumulated earnings because they got careless about account security. Took them 3 months to file a complaint with SRK support. Even worse? Only 40% got recovered.

That's not a scare tactic. That's reality.

The horrible truth is that most task workers think "just use a strong password" covers security. It doesn't. Not even close.

## The Real Threats (Not the Ones Everyone Mentions)

**Phishing Attacks Targeting Task Workers:** Scammers send fake "account verification" emails that look identical to real SRK emails. One member clicked a link and lost access to their account within 2 minutes.

**Credential Stuffing:** Someone gets your email + password from a breach on a different site and tries it on SRK. If you reused passwords, you're compromised instantly.

**Social Engineering:** Support tickets get faked. Your email gets compromised. Someone changes your payment details while you're sleeping.

**Shared Device Compromise:** Using a shared computer? Keystroke loggers can capture your credentials without you knowing.

**Malware on Your Payment Methods:** Your SRK account is secure, but malware on your connected bank account allows fraudsters to reroute earnings.

## What Most People Get Wrong

- Thinking 2FA is optional (it's mandatory for 500+/month earners)
- Keeping the same password everywhere
- Not checking login activity
- Storing passwords in email drafts or Notes apps
- Not updating devices

I learned this the hard way after an incident that made me paranoid about security. Now? My security is impeccable.

## Here's What Secure Task Workers Actually Do

**Password Security:** Unique 16+ character passwords. Use a password manager (1Password, Bitwarden, LastPass). This isn't optional if you're serious about earning.

**Two-Factor Authentication:** Enable SMS + authenticator app (not just SMS). SMS alone can be SIM-jacked. Use an authenticator app like Google Authenticator or Authy as your primary 2FA.

**Device Security:** Update your OS monthly. Keep antivirus current. Use a firewall. These aren't annoying - they're essential.

**Email Security:** Your email is the master key. Stronger password + 2FA on your email than anywhere else. If someone accesses your email, they access your SRK account in minutes.

**Withdrawal Security:** Never save credit card details to auto-withdraw. Verify every withdrawal manually.

## The Timeline People Ignore

Week 1: Set up password manager and use it for all new passwords.
Week 2: Enable 2FA on your SRK account and email.
Week 3: Change all passwords to unique, strong ones.
Week 4: Audit login activity in SRK account settings.
Month 2: Remove any saved payment methods you don't recognize.

One member implemented all this and caught an unauthorized login attempt the first week after setting up 2FA. It caught fraud before it happened.

## Real Talk on Backup Access

Can't access your email? You're locked out of SRK for potentially weeks. No backup authentication method exists for most accounts.

Solution: Use recovery codes. When you enable 2FA, SRK gives you 10 backup codes. Print them. Literally print them on paper. Store them somewhere physical and fireproof.

I know that sounds paranoid. I know someone who lost 6 months of learnings access because they couldn't find their phone during 2FA setup. Paranoid would've been cheaper.

## One More Thing Nobody Wants to Hear

The platform is as secure as your security practices. SRK's servers? Fort Knox. Your account? Only as safe as your weakest habit.

Start treating your SRK account like a bank account. Because, for many people here, it basically is one.`,
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
                    to={`/blog/{relatedPost.slug}`}
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
