import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    className="rounded-3xl border border-slate-950/[0.08] bg-white/78 p-4 shadow-sm"
  >
    <div className="mb-4 flex items-start gap-3">
      <div className="h-11 w-11 rounded-2xl bg-slate-100 shimmer" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 w-2/3 rounded bg-slate-100 shimmer" />
        <div className="h-3 w-1/2 rounded bg-slate-100 shimmer" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-slate-100 shimmer" />
      <div className="h-3 w-5/6 rounded bg-slate-100 shimmer" />
      <div className="h-3 w-3/5 rounded bg-slate-100 shimmer" />
    </div>
    <div className="mt-5 rounded-2xl border border-slate-950/[0.06] bg-slate-50 p-3">
      <div className="h-4 w-full rounded bg-slate-100 shimmer" />
    </div>
  </motion.div>
);

SkeletonCard.propTypes = {
  index: PropTypes.number,
};

SkeletonCard.defaultProps = {
  index: 0,
};

export const SkeletonGrid = ({ count = 7 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[...Array(count)].map((_, index) => <SkeletonCard key={index} index={index} />)}
  </div>
);

SkeletonGrid.propTypes = {
  count: PropTypes.number,
};

SkeletonGrid.defaultProps = {
  count: 7,
};

export default SkeletonCard;
