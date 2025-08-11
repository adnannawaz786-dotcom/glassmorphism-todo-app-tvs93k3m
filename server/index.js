const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-domain.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for todos (replace with database in production)
let todos = [
  {
    id: '1',
    text: 'Welcome to your Glassmorphism Todo App',
    completed: false,
    priority: 'medium',
    category: 'personal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Try editing this todo by clicking on it',
    completed: false,
    priority: 'low',
    category: 'work',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 3;

// Helper function to generate unique IDs
const generateId = () => {
  return (nextId++).toString();
};

// Helper function to validate todo data
const validateTodo = (todo) => {
  const errors = [];
  
  if (!todo.text || typeof todo.text !== 'string' || todo.text.trim().length === 0) {
    errors.push('Todo text is required and must be a non-empty string');
  }
  
  if (todo.text && todo.text.length > 500) {
    errors.push('Todo text must be less than 500 characters');
  }
  
  if (todo.priority && !['low', 'medium', 'high'].includes(todo.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  if (todo.category && typeof todo.category !== 'string') {
    errors.push('Category must be a string');
  }
  
  return errors;
};

// API Routes

// Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const { filter, sort, search } = req.query;
    let filteredTodos = [...todos];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => 
        todo.text.toLowerCase().includes(searchLower) ||
        todo.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (filter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }
    
    // Apply sorting
    if (sort === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filteredTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sort === 'date') {
      filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'alphabetical') {
      filteredTodos.sort((a, b) => a.text.localeCompare(b.text));
    }
    
    res.json({
      success: true,
      data: filteredTodos,
      total: filteredTodos.length
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message
    });
  }
});

// Get single todo by ID
app.get('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todo',
      error: error.message
    });
  }
});

// Create new todo
app.post('/api/todos', (req, res) => {
  try {
    const todoData = {
      text: req.body.text?.trim(),
      completed: false,
      priority: req.body.priority || 'medium',
      category: req.body.category || 'general'
    };
    
    const validationErrors = validateTodo(todoData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    const newTodo = {
      id: generateId(),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    });
  }
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    const updateData = {
      text: req.body.text?.trim() || todos[todoIndex].text,
      completed: req.body.completed !== undefined ? req.body.completed : todos[todoIndex].completed,
      priority: req.body.priority || todos[todoIndex].priority,
      category: req.body.category || todos[todoIndex].category
    };
    
    const validationErrors = validateTodo(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    const updatedTodo = {
      ...todos[todoIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    todos[todoIndex] = updatedTodo;
    
    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message
    });
  }
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message
    });
  }
});

// Bulk operations
app.post('/api/todos/bulk', (req, res) => {
  try {
    const { action, ids } = req.body;
    
    if (!action || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Action and ids array are required'
      });
    }
    
    let affectedTodos = [];
    
    if (action === 'delete') {
      affectedTodos = todos.filter(todo => ids.includes(todo.id));
      todos = todos.filter(todo => !ids.includes(todo.id));
    } else if (action === 'complete') {
      todos.forEach(todo => {
        if (ids.includes(todo.id)) {
          todo.completed = true;
          todo.updatedAt = new Date().toISOString();
          affectedTodos.push(todo);
        }
      });
    } else if (action === 'incomplete') {
      todos.forEach(todo => {
        if (ids.includes(todo.id)) {
          todo.completed = false;
          todo.updatedAt = new Date().toISOString();
          affectedTodos.push(todo);
        }
      });
    }
    
    res.json({
      success: true,
      data: affectedTodos,
      message: `Bulk ${action} completed successfully`,
      affected: affectedTodos.length
    });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    todos: todos.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo API server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});

module.exports = app;