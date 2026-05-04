import { motion } from 'framer-motion';

const SkeletonCard = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative h-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-5 rounded-2xl overflow-hidden"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: 'linear',
            repeatDelay: 0.5 
          }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
        />
      </div>

      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-800/80 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-zinc-800/80 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-zinc-800/60 rounded animate-pulse" />
            <div className="h-3 w-8 bg-zinc-800/60 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full bg-zinc-800/60 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-zinc-800/60 rounded animate-pulse" />
        <div className="h-3 w-4/6 bg-zinc-800/60 rounded animate-pulse" />
      </div>

      {/* Install command skeleton */}
      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <div className="h-2.5 w-20 bg-zinc-800/60 rounded mb-2 animate-pulse" />
        <div className="h-10 w-full bg-zinc-800/80 rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
};

export const SkeletonGrid = ({ count = 7 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
};

export default SkeletonCard;
