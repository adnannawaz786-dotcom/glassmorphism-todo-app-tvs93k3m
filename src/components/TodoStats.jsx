/* EXPORTS: TodoStats */

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

const TodoStats = ({ todos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const stats = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: totalTodos,
      icon: AlertCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completedTodos,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: 'pending',
      label: 'Pending',
      value: pendingTodos,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      id: 'completion',
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`
              relative overflow-hidden backdrop-blur-xl bg-white/10 
              border ${stat.borderColor} shadow-lg hover:shadow-xl 
              transition-all duration-300 p-6
            `}>
              {/* Background gradient */}
              <div className={`
                absolute inset-0 ${stat.bgColor} opacity-50
              `} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`
                    p-2 rounded-lg ${stat.bgColor} ${stat.borderColor} 
                    border backdrop-blur-sm
                  `}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  
                  {stat.id === 'completion' && (
                    <motion.div
                      className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Progress
                    </motion.div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <motion.div
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <p className="text-sm text-white/80 font-medium">
                    {stat.label}
                  </p>
                </div>

                {/* Progress bar for completion rate */}
                {stat.id === 'completion' && totalTodos > 0 && (
                  <motion.div
                    className="mt-3 w-full bg-white/20 rounded-full h-2 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ 
                        delay: 0.6, 
                        duration: 0.8, 
                        ease: "easeOut" 
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-lg" />
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export { TodoStats };