import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../features/landing-page/components/Footer';

export const EarningsDisclaimer = () => {
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
            <div className="flex items-center justify-center mb-6">
              <AlertCircle className="text-[#e1ba73]" size={40} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Earnings <span className="text-[#e1ba73]">Disclaimer</span>
            </h1>
            <p className="text-xl text-gray-400">
              Please read this earnings disclaimer thoroughly before using SRK Task. 
              Understanding these terms is essential for realistic expectations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Critical Notice */}
          <div className="p-8 rounded-xl border-2 border-[#e1ba73]/50 bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10">
            <h2 className="text-2xl font-bold text-[#e1ba73] mb-4">⚠️ Critical Notice</h2>
            <p className="text-gray-300 leading-relaxed">
              <span className="font-semibold">Earnings on SRK Task are NOT guaranteed in any amount or frequency.</span> experience depends on multiple variables outside SRK Task's control, including task availability, your profile rating, submission quality, account standing, and activity consistency. SRK Task provides a platform and infrastructure for verified engagement work — it does not guarantee any specific experience outcome.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">No experience Guarantees</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SRK Task makes no representations or warranties regarding the amount of money you can earn using the platform. Your earnings depend entirely on:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Task availability at any given time (varies by category and season)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Your profile rating and access tier (determines which tasks you can accept)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>The quality of your submissions (affects approval rates and ratings)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Your account standing and verification status (violations reduce access)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>The consistency and frequency of your activity (sporadic work reduces opportunities)</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Variable Earnings & Payment Risk</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Task payments vary widely based on task category, complexity, time requirement, and the brand's campaign budget. Additionally:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span><span className="font-semibold">No minimum earnings:</span> You may earn nothing if no tasks are available or if your submissions are rejected</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span><span className="font-semibold">Highly variable experience:</span> Earnings can fluctuate significantly week to week based on brand activity</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span><span className="font-semibold">Rejection risk:</span> Submitted tasks may be rejected, resulting in zero payment for your effort</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span><span className="font-semibold">Account suspension risk:</span> Violations of terms may result in account suspension and forfeiture of pending earnings</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Supplemental experience Only</h2>
            <p className="text-gray-300 leading-relaxed">
              SRK Task is designed and positioned as a <span className="font-semibold">supplemental experience platform only.</span> It is NOT suitable as a replacement for stable employment or a primary livelihood. While top-performing, highly-active members may earn significant amounts, you should never treat SRK Task as a guaranteed experience source or depend on it for essential expenses. Make all financial decisions based on a realistic assessment of your own activity levels and the platform's inherently variable nature.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">How Brands Fund Tasks (Transparency)</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Task payments come directly from brand and creator campaign budgets allocated for influencer marketing and social media engagement. This model explains both earnings potential and limitations:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">✓</span>
                <span>Payments are real and come from actual brand budgets</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">✓</span>
                <span>Task availability depends on active brand campaigns</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">✗</span>
                <span>When brands don't run campaigns, no tasks exist</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">✗</span>
                <span>Budget limitations mean only a certain number of spots available per task</span>
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Realistic Earnings Ranges</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Based on platform data and member reports, here are realistic earnings ranges. These are NOT guarantees, but illustrative of what's possible:
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-2">New Members (First 30 days)</p>
                <p className="text-gray-300">Typically $0-50/month as they build ratings and learn the system</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-2">Developing Members (1-3 months)</p>
                <p className="text-gray-300">$20-200/month as they unlock better tasks and improve submission quality</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-2">Established Members (3+ months)</p>
                <p className="text-gray-300">$100-500+/month depending on activity level, specialization, and rating consistency</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-2">Important: These ranges are NOT guarantees.</p>
                <p className="text-gray-300">Actual results depend entirely on the factors mentioned above. Many members earn less.</p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Effort Does Not Guarantee Earnings</h2>
            <p className="text-gray-300 leading-relaxed">
              Even if you work consistently and honestly, you are not guaranteed to earn money. Factors completely outside your control — such as lack of available tasks, market demand changes, or brand budget reductions — can result in periods with zero earning opportunities.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Account Risk</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By using SRK Task, you accept these risks:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Account suspension for policy violations results in loss of all pending earnings</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Task rejection can result in zero payment despite time investment</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Changes to platform policies may affect your earning opportunities</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e1ba73] font-bold">•</span>
                <span>Payment processing delays may occur beyond our control</span>
              </li>
            </ul>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Financial Advice Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              This platform is not financial advice. SRK Task does not recommend treating platform earnings as a guaranteed experience source or using them to cover essential living expenses. If you're in financial difficulty, please consult with appropriate financial advisors or support services rather than relying on variable platform earnings.
            </p>
          </div>

          {/* Final Statement */}
          <div className="p-8 rounded-xl border border-[#e1ba73]/50 bg-gradient-to-r from-[#b68938]/10 to-[#e1ba73]/10">
            <h2 className="text-2xl font-bold text-white mb-4">Bottom Line</h2>
            <p className="text-gray-300 leading-relaxed">
              SRK Task is a legitimate platform where verified individuals can earn supplemental experience through honest task completion. However, earnings are entirely variable and not guaranteed. Treat it as a supplemental opportunity alongside stable experience, not as a primary earnings source. Start with realistic expectations, and you may be pleasantly surprised by results. Expect nothing, and you're unlikely to be disappointed.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};
