/* EXPORTS: App as default */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoApp from './components/TodoApp';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage on app initialization
  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem('glassmorphism-todos');
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos);
          setTodos(parsedTodos);
        }
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 800); // Smooth loading transition
      }
    };

    loadTodos();
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      try {
        localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [todos, isLoading]);

  // Todo CRUD operations
  const addTodo = (todoData) => {
    const newTodo = {
      id: Date.now().toString(),
      text: todoData.text,
      category: todoData.category || 'general',
      priority: todoData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id, updates) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    updateTodo(id, { completed: !todos.find(todo => todo.id === id)?.completed });
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // Loading screen with glassmorphism effect
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white/20 border-t-white/80 rounded-full mx-auto mb-4"
          />
          <h2 className="text-white text-xl font-semibold">Loading your todos...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 -right-10 w-96 h-96 bg-pink-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-10 left-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-xl"
        />
      </div>

      {/* Main app container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          {/* App header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Glass<span className="text-cyan-300">Todo</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              A beautiful glassmorphism todo app to organize your tasks with style
            </p>
          </motion.div>

          {/* Main todo app */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <TodoApp
              todos={todos}
              onAddTodo={addTodo}
              onUpdateTodo={updateTodo}
              onDeleteTodo={deleteTodo}
              onToggleComplete={toggleComplete}
              onClearCompleted={clearCompleted}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-white/60 text-sm">
              Built with React, Framer Motion, and Glassmorphism design
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { App as default };