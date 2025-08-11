/* EXPORTS: TodoItem */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

const TodoItem = ({ 
  todo, 
  onToggleComplete, 
  onDelete, 
  onEdit, 
  className 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: isDeleting ? 0 : 1, 
          y: isDeleting ? -20 : 0,
          scale: isDeleting ? 0.95 : 1
        }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4",
          "hover:bg-white/15 hover:border-white/30 transition-all duration-300",
          "shadow-lg hover:shadow-xl",
          todo.completed && "opacity-60",
          className
        )}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl pointer-events-none" />
        
        <div className="relative flex items-start gap-3">
          {/* Checkbox */}
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggleComplete(todo.id)}
              className="data-[state=checked]:bg-green-500/80 data-[state=checked]:border-green-400"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Edit todo..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleEdit}
                    size="sm"
                    className="bg-green-500/80 hover:bg-green-500 text-white"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/80 hover:bg-white/10"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <p className={cn(
                  "text-white font-medium leading-relaxed",
                  todo.completed && "line-through text-white/60"
                )}>
                  {todo.text}
                </p>
                
                {/* Priority and Date */}
                <div className="flex items-center gap-2 text-sm">
                  {todo.priority && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-medium border backdrop-blur-sm",
                        getPriorityColor(todo.priority)
                      )}
                    >
                      {todo.priority}
                    </Badge>
                  )}
                  
                  {todo.createdAt && (
                    <span className="text-white/60 text-xs">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={handleDelete}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* Completion indicator */}
        {todo.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2"
          >
            <div className="bg-green-500 rounded-full p-1">
              <Check className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export { TodoItem };