import { motion } from 'framer-motion';

// Base Shimmer Pulse Animation
const shimmerAnim = {
  initial: { opacity: 0.5 },
  animate: { opacity: [0.4, 0.8, 0.4] },
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
};

// 1. Single Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <motion.div
      {...shimmerAnim}
      className="glass border border-white/8 rounded-2xl overflow-hidden bg-[#0c0b1e]/40 p-4 space-y-3"
    >
      <div className="w-full aspect-[4/3] bg-white/5 rounded-xl animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
      <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
        <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse" />
        <div className="h-4 bg-violet-500/20 rounded w-1/5 animate-pulse" />
      </div>
    </motion.div>
  );
}

// 2. Product Grid Skeletons
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 3. Product Details Skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 aspect-[4/3] bg-white/5 rounded-3xl animate-pulse border border-white/8" />
      <div className="lg:col-span-5 space-y-6">
        <div className="h-4 bg-white/5 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-white/10 rounded w-4/5 animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
        </div>
        <div className="h-28 bg-violet-600/10 border border-violet-500/20 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

// 4. Admin Dashboard Skeleton
export function AdminDashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/5 border border-white/8 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-white/5 border border-white/8 rounded-3xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-white/5 border border-white/8 rounded-2xl animate-pulse" />
        <div className="h-48 bg-white/5 border border-white/8 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
