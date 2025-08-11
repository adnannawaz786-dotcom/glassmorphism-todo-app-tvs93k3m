/* EXPORTS: TodoForm */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

const TodoForm = ({ onAddTodo, isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'personal'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ];

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newTodo = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onAddTodo(newTodo);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'personal'
      });
      
      setErrors({});
      onClose?.();
    } catch (error) {
      setErrors({ submit: 'Failed to add todo. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'personal'
    });
    setErrors({});
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="glass-card border-0 shadow-2xl backdrop-blur-xl bg-white/10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add New Todo</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter todo title..."
                className="glass-input bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400/50 focus:ring-blue-400/20"
                maxLength={100}
              />
              {errors.title && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-400 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </motion.div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add more details (optional)..."
                className="glass-input bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400/50 focus:ring-blue-400/20 resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-red-400 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </motion.div>
                )}
                <span className="text-xs text-white/60 ml-auto">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger className="glass-input bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                    {priorities.map((priority) => (
                      <SelectItem
                        key={priority.value}
                        value={priority.value}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        <span className={priority.color}>
                          {priority.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="glass-input bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Due Date (Optional)
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="glass-input bg-white/5 border-white/20 text-white focus:border-blue-400/50 focus:ring-blue-400/20"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-400 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.dueDate}
                </motion.div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 glass-button bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border-white/20 backdrop-blur-sm"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Todo
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="glass-button bg-white/5 hover:bg-white/10 text-white border-white/20 backdrop-blur-sm"
              >
                Reset
              </Button>
              
              {onClose && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export { TodoForm };