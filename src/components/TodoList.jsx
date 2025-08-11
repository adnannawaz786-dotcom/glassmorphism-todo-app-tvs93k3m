/* EXPORTS: TodoList as default */

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit3, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { cn } from '../lib/utils';

const TodoList = ({ 
  todos, 
  filter, 
  onToggle, 
  onDelete, 
  onEdit,
  searchQuery = '' 
}) => {
  // Filter todos based on current filter and search query
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'today':
        const today = new Date().toDateString();
        return todo.dueDate && new Date(todo.dueDate).toDateString() === today;
      case 'overdue':
        return todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
      default:
        return true;
    }
  });

  // Sort todos by priority and due date
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    return new Date(dueDate) < new Date();
  };

  if (sortedTodos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
          <Clock className="w-16 h-16 mx-auto text-white/40 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? 'No matching todos' : 'No todos yet'}
          </h3>
          <p className="text-white/70">
            {searchQuery 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first todo to get started!'
            }
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedTodos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              duration: 0.2,
              layout: { duration: 0.3 }
            }}
          >
            <Card className={cn(
              "glass-card p-4 transition-all duration-200 hover:scale-[1.02]",
              todo.completed && "opacity-75"
            )}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    className="data-[state=checked]:bg-white/20 data-[state=checked]:border-white/30"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={cn(
                      "font-medium text-white transition-all",
                      todo.completed && "line-through opacity-60"
                    )}>
                      {todo.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-2 py-1",
                          getPriorityColor(todo.priority)
                        )}
                      >
                        {todo.priority}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(todo)}
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(todo.id)}
                        className="h-8 w-8 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {todo.description && (
                    <p className={cn(
                      "text-sm text-white/70 mb-2",
                      todo.completed && "line-through opacity-50"
                    )}>
                      {todo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs">
                    {todo.category && (
                      <Badge variant="outline" className="text-white/60 border-white/20">
                        {todo.category}
                      </Badge>
                    )}
                    
                    {todo.dueDate && (
                      <div className={cn(
                        "flex items-center gap-1",
                        isOverdue(todo.dueDate, todo.completed) 
                          ? "text-red-400" 
                          : "text-white/60"
                      )}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDueDate(todo.dueDate)}</span>
                        {isOverdue(todo.dueDate, todo.completed) && (
                          <Badge variant="destructive" className="ml-1 text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { TodoList as default };