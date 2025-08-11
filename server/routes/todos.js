/* EXPORTS: router (default) */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const TODOS_FILE = path.join(__dirname, '../data/todos.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(TODOS_FILE);
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read todos from file
const readTodos = async () => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(TODOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Write todos to file
const writeTodos = async (todos) => {
  await ensureDataDirectory();
  await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await readTodos();
    res.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('Error reading todos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read todos'
    });
  }
});

// POST /api/todos - Create new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', category = 'general' } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const todos = await readTodos();
    const newTodo = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await writeTodos(todos);

    res.status(201).json({
      success: true,
      data: newTodo
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create todo'
    });
  }
});

// PUT /api/todos/:id - Update todo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, category } = req.body;

    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title cannot be empty'
      });
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(completed !== undefined && { completed: Boolean(completed) }),
      ...(priority !== undefined && { priority }),
      ...(category !== undefined && { category }),
      updatedAt: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;
    await writeTodos(todos);

    res.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update todo'
    });
  }
});

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    await writeTodos(todos);

    res.json({
      success: true,
      data: deletedTodo
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete todo'
    });
  }
});

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      completed: !todos[todoIndex].completed,
      updatedAt: new Date().toISOString()
    };

    await writeTodos(todos);

    res.json({
      success: true,
      data: todos[todoIndex]
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle todo'
    });
  }
});

// DELETE /api/todos - Delete all completed todos
router.delete('/', async (req, res) => {
  try {
    const todos = await readTodos();
    const activeTodos = todos.filter(todo => !todo.completed);
    const deletedCount = todos.length - activeTodos.length;

    await writeTodos(activeTodos);

    res.json({
      success: true,
      data: {
        deletedCount,
        remainingTodos: activeTodos
      }
    });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear completed todos'
    });
  }
});

module.exports = router;