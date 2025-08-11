/* EXPORTS: useTodos */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'glassmorphism_todos';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [todos, isLoading]);

  // Add new todo
  const addTodo = useCallback((text) => {
    if (!text.trim()) return;

    const newTodo = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []);

  // Delete todo
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  // Toggle todo completion
  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, []);

  // Edit todo text
  const editTodo = useCallback((id, newText) => {
    if (!newText.trim()) return;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              text: newText.trim(),
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, []);

  // Clear all completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  // Toggle all todos
  const toggleAllTodos = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    const now = new Date().toISOString();

    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
        updatedAt: now
      }))
    );
  }, [todos]);

  // Get filtered todos based on current filter
  const getFilteredTodos = useCallback(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // Get todos statistics
  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;

    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [todos]);

  // Reorder todos (for drag and drop functionality)
  const reorderTodos = useCallback((startIndex, endIndex) => {
    setTodos(prevTodos => {
      const result = Array.from(prevTodos);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // Search todos
  const searchTodos = useCallback((query) => {
    if (!query.trim()) return getFilteredTodos();

    const searchTerm = query.toLowerCase();
    return getFilteredTodos().filter(todo =>
      todo.text.toLowerCase().includes(searchTerm)
    );
  }, [getFilteredTodos]);

  // Bulk operations
  const bulkDelete = useCallback((todoIds) => {
    setTodos(prevTodos => prevTodos.filter(todo => !todoIds.includes(todo.id)));
  }, []);

  const bulkToggle = useCallback((todoIds, completed) => {
    const now = new Date().toISOString();
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todoIds.includes(todo.id)
          ? { ...todo, completed, updatedAt: now }
          : todo
      )
    );
  }, []);

  return {
    // State
    todos,
    filter,
    isLoading,

    // Actions
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    clearCompleted,
    toggleAllTodos,
    reorderTodos,
    bulkDelete,
    bulkToggle,

    // Filter management
    setFilter,

    // Computed values
    filteredTodos: getFilteredTodos(),
    stats: getStats(),

    // Utility functions
    searchTodos
  };
};

export { useTodos };