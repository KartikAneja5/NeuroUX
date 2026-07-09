import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass rounded-2xl border border-white/6 border-dashed">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#5a5275] mb-5">
        <FiInbox size={28} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
      <p className="text-[#8b7fb5] max-w-sm mb-6 text-sm leading-relaxed">
        {message || "We couldn't find anything matching your filters. Try adjusting them."}
      </p>
      {action}
    </div>
  );
}
