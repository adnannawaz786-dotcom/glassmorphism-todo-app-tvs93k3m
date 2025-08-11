/* EXPORTS: TodoApp as default */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal'
  });

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo = {
      id: Date.now().toString(),
      ...newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo({ title: '', description: '', priority: 'medium', category: 'personal' });
    setIsAddDialogOpen(false);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category: todo.category
    });
  };

  const saveEdit = () => {
    if (!newTodo.title.trim()) return;

    setTodos(prev => prev.map(todo =>
      todo.id === editingTodo.id
        ? { ...todo, ...newTodo, updatedAt: new Date().toISOString() }
        : todo
    ));

    setEditingTodo(null);
    setNewTodo({ title: '', description: '', priority: 'medium', category: 'personal' });
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setNewTodo({ title: '', description: '', priority: 'medium', category: 'personal' });
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'completed' && todo.completed) ||
                         (filterStatus === 'pending' && !todo.completed);
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-200';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-blue-500/20 text-blue-700 border-blue-200';
      case 'personal': return 'bg-purple-500/20 text-purple-700 border-purple-200';
      case 'shopping': return 'bg-pink-500/20 text-pink-700 border-pink-200';
      case 'health': return 'bg-emerald-500/20 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{totalCount}</div>
            <div className="text-white/70 text-sm">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{completedCount}</div>
            <div className="text-white/70 text-sm">Completed</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{totalCount - completedCount}</div>
            <div className="text-white/70 text-sm">Remaining</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-input"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="glass-select w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="glass-select w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="glass-button w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Task title..."
                    value={newTodo.title}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                    className="glass-input"
                  />
                  <Textarea
                    placeholder="Task description..."
                    value={newTodo.description}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={newTodo.priority}
                      onValueChange={(value) => setNewTodo(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="glass-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newTodo.category}
                      onValueChange={(value) => setNewTodo(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="glass-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTodo} className="glass-button flex-1">
                      Add Task
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="glass-button-outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group"
            >
              <Card className="glass-card hover:glass-card-hover transition-all duration-200">
                <CardContent className="p-4">
                  {editingTodo?.id === todo.id ? (
                    <div className="space-y-3">
                      <Input
                        value={newTodo.title}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                        className="glass-input"
                      />
                      <Textarea
                        value={newTodo.description}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                        className="glass-input"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm" className="glass-button">
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button onClick={cancelEdit} size="sm" variant="outline" className="glass-button-outline">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="mt-1 glass-checkbox"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                          {todo.title}
                        </div>
                        {todo.description && (
                          <div className={`text-sm text-white/70 mt-1 ${todo.completed ? 'line-through opacity-60' : ''}`}>
                            {todo.description}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Badge className={getPriorityColor(todo.priority)}>
                            {todo.priority}
                          </Badge>
                          <Badge className={getCategoryColor(todo.category)}>
                            {todo.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(todo)}
                          className="glass-button-ghost"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                          className="glass-button-ghost hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="text-white/60 text-lg">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'No todos match your current filters.'
                    : 'No todos yet. Create your first task to get started!'}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;