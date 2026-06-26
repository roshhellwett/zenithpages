import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SkeletonCard = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md p-4 shadow-sm"
  >
    <div className="mb-4 flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-[var(--color-sidebar-hover)]/70 shimmer" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 w-2/3 rounded bg-[var(--color-sidebar-hover)] shimmer" />
        <div className="h-3 w-1/2 rounded bg-[var(--color-sidebar-hover)] shimmer" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-[var(--color-sidebar-hover)] shimmer" />
      <div className="h-3 w-5/6 rounded bg-[var(--color-sidebar-hover)] shimmer" />
    </div>
    <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/70 backdrop-blur-sm p-3">
      <div className="h-4 w-full rounded bg-[var(--color-sidebar-hover)] shimmer" />
    </div>
  </motion.div>
);

SkeletonCard.propTypes = {
  index: PropTypes.number,
};

export const SkeletonGrid = ({ count = 7 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[...Array(count)].map((_, index) => <SkeletonCard key={index} index={index} />)}
  </div>
);

SkeletonGrid.propTypes = {
  count: PropTypes.number,
};

export default SkeletonCard;
