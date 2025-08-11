/* EXPORTS: FilterTabs */

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const FilterTabs = ({ currentFilter, onFilterChange, todoCounts }) => {
  const filters = [
    { 
      key: 'all', 
      label: 'All', 
      count: todoCounts.all,
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      key: 'active', 
      label: 'Active', 
      count: todoCounts.active,
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      count: todoCounts.completed,
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-center p-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
        {filters.map((filter, index) => (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              "relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
              "hover:bg-white/10 hover:backdrop-blur-sm",
              "focus:outline-none focus:ring-2 focus:ring-white/30",
              currentFilter === filter.key
                ? "text-white shadow-lg"
                : "text-white/70 hover:text-white"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Active filter background */}
            {currentFilter === filter.key && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-lg border border-white/30"
                layoutId="activeFilter"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* Filter content */}
            <span className="relative z-10 text-sm font-semibold">
              {filter.label}
            </span>
            
            {/* Count badge */}
            <motion.span
              className={cn(
                "relative z-10 flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-bold rounded-full",
                currentFilter === filter.key
                  ? "bg-white/30 text-white"
                  : "bg-white/20 text-white/80"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
            >
              {filter.count}
            </motion.span>
          </motion.button>
        ))}
      </div>
      
      {/* Decorative glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl -z-10 opacity-50" />
    </div>
  );
};

export { FilterTabs };