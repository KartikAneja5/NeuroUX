import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Frontend Lead at TechFlow',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'The AI recommendations are scary accurate. I found the perfect dashboard template in under 10 seconds.',
  },
  {
    name: 'Marcus Chen',
    role: 'Indie Hacker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    content: 'The quality of the UI kits is unmatched. Instantly elevated my SaaS from prototype to polished product.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Product Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    content: 'I sell my templates here and the platform experience is incredible. The community actually cares about design.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#0a0913] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">Reviews</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">Loved by creators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl glass border-glow relative">
              {/* Stars */}
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, j) => <FiStar key={j} size={14} className="fill-current" />)}
              </div>
              
              <p className="text-[#c4b5fd] text-sm leading-relaxed italic mb-6">"{t.content}"</p>
              
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full ring-1 ring-white/10" />
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-[#5a5275]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
