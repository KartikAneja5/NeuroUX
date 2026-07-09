import { FiStar } from 'react-icons/fi';

const reviews = [
  {
    id: 1,
    author: 'Alex Carter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 5,
    date: 'Oct 12, 2026',
    content: 'Absolutely incredible quality. The attention to detail saved my team weeks of dev time.',
  },
  {
    id: 2,
    author: 'Jamie Lin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
    rating: 5,
    date: 'Sep 28, 2026',
    content: 'The Figma files alone are worth the price. Clean code and the latest React patterns.',
  },
  {
    id: 3,
    author: 'Sam Jenkins',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    rating: 4,
    date: 'Aug 14, 2026',
    content: 'Great product. Had a minor issue but the author pushed a fix within hours.',
  },
];

export default function ReviewList() {
  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <div key={review.id} className="p-5 glass rounded-xl border border-white/8">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full ring-1 ring-white/10" />
              <div>
                <h4 className="text-sm font-semibold text-white">{review.author}</h4>
                <div className="text-xs text-[#5a5275]">{review.date}</div>
              </div>
            </div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={13} className={i < review.rating ? 'fill-current' : 'opacity-20'} />
              ))}
            </div>
          </div>
          <p className="text-sm text-[#8b7fb5] leading-relaxed">{review.content}</p>
        </div>
      ))}
    </div>
  );
}
