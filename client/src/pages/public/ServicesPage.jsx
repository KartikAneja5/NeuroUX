import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiZap, FiPlus, FiMinus } from 'react-icons/fi';

const plans = [
  {
    name: 'Individual License',
    price: 'A la Carte',
    period: 'pay per component',
    desc: 'Perfect for creators who only need specific UI elements for one-off projects.',
    features: [
      'Buy any component starting at $9',
      'Lifetime updates for purchased items',
      'Standard Commercial License',
      'Tailwind CSS configurations included',
      'Copy-paste ready code files',
    ],
    cta: 'Browse Marketplace',
    link: '/marketplace',
    popular: false,
    color: 'border-white/5 bg-zinc-950/60 text-zinc-300',
  },
  {
    name: 'Developer Pro Pass',
    price: '$15',
    period: 'per month',
    desc: 'Unleash full power. Direct access to all text animations, backgrounds, and premium components.',
    features: [
      'Unlimited access to all 32+ components',
      'Free access to all future components',
      'Extended Commercial License (Unlimited Projects)',
      'One-click source code copy',
      'Premium Discord Community access',
      'Priority customer support',
    ],
    cta: 'Get Pro Access',
    link: '/register',
    popular: true,
    color: 'border-violet-500/30 bg-violet-950/20 text-white shadow-glow-sm',
  },
  {
    name: 'Team License',
    price: '$39',
    period: 'per month',
    desc: 'For design agencies and product teams building collaborative websites and apps.',
    features: [
      'Access for up to 5 developers',
      'Centralized team billing & seat management',
      'Figma source design files included',
      'Custom animation requests & guidance',
      '1-on-1 dedicated engineer support',
    ],
    cta: 'Contact Sales',
    link: '/contact',
    popular: false,
    color: 'border-white/5 bg-zinc-950/60 text-zinc-300',
  },
];

const faqs = [
  {
    question: 'How do I access the source code after purchasing?',
    answer: 'Once you buy a component individually or subscribe to the Pro Pass, the locked "Source Code" tab on the component details page will instantly unlock. You can copy the code directly into your React project with a single click, or download the full asset files.',
  },
  {
    question: 'Can I use these components in commercial projects?',
    answer: 'Yes! Both the Individual License and Pro Pass allow you to use the components in commercial, client, and personal projects. The only restriction is that you cannot resell the components as standalone templates or UI kits.',
  },
  {
    question: 'Do these components require external dependencies?',
    answer: 'Most components are written in native React and CSS, utilizing framer-motion or HTML5 Canvas for advanced animations. Any external dependency (like react-icons) is listed at the top of the code for easy install.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'Since our products are digital assets and code files, we generally do not offer refunds once an item is purchased. However, if you experience technical issues or are dissatisfied with a subscription, reach out to our team and we will make it right.',
  },
];

export default function ServicesPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#080712] text-white pt-24 pb-20 relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      
      {/* Background glow blobbies */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Pricing Plans</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Flexible plans for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">every workflow</span>
          </h1>
          <p className="text-[#8b7fb5] text-lg font-light leading-relaxed">
            Choose to buy individual UI components as you go, or grab a Pro subscription to unlock the entire premium library with continuous additions.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {plans.map((p, idx) => (
            <div 
              key={idx}
              className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 relative ${p.color} hover:-translate-y-1 hover:border-white/15`}
            >
              {p.popular && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-violet-600 text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-glow-sm">
                  Most Popular
                </span>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                <p className="text-xs text-zinc-500 min-h-[32px] leading-normal">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold tracking-tight text-white">{p.price}</span>
                <span className="text-xs text-zinc-500 font-mono">/ {p.period}</span>
              </div>

              {/* Action Button */}
              <Link 
                to={p.link}
                className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all mb-8 block ${
                  p.popular 
                    ? 'bg-violet-600 text-white hover:bg-violet-500 border border-violet-400 shadow-glow' 
                    : 'bg-white/5 border border-white/8 text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {p.cta}
              </Link>

              {/* Feature List */}
              <ul className="space-y-3.5 flex-1">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <FiCheck size={15} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-white/5 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-sm text-[#8b7fb5]">Everything you need to know about licensing, code use, and purchases.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-white/5 bg-zinc-950/40 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white focus:outline-none hover:bg-white/5 transition"
                  >
                    <span>{faq.question}</span>
                    <span className="p-1 rounded bg-white/5 text-[#8b7fb5]">
                      {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-white/5 text-xs text-zinc-400 leading-relaxed font-light animate-[faqFade_0.2s_ease-out]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-24 p-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/20 to-cyan-950/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h4 className="text-base font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
              <FiZap className="text-violet-400" />
              Need a completely custom interaction?
            </h4>
            <p className="text-xs text-[#8b7fb5]">Our animation developers design custom components tailor-made for your app design.</p>
          </div>
          <Link 
            to="/contact" 
            className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-100 transition whitespace-nowrap"
          >
            Get Custom Design
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes faqFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
