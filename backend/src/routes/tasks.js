// src/routes/tasks.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 🔥 Ruta absoluta: usa process.cwd() → apunta a la raíz del proyecto (donde está package.json)
const dataPath = path.join(process.cwd(), 'data', 'tasks.json');

console.log('📁 Ruta absoluta del archivo de tareas:', dataPath);

const readTasks = () => {
  try {
    // Si no existe, créalo
    if (!fs.existsSync(dataPath)) {
      console.log('⚠️  data/tasks.json no existe. Creando archivo vacío...');
      const dir = path.dirname(dataPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dataPath, '[]', 'utf8');
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Error al leer tasks.json:', err.message);
    return [];
  }
};

const writeTasks = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Error al escribir tasks.json:', err.message);
    throw err;
  }
};

// GET /api/tasks - Listar tareas
router.get('/', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron leer las tareas' });
  }
});

// POST /api/tasks - Crear tarea
router.post('/', (req, res) => {
  try {
    const tasks = readTasks();
    const text = req.body.text?.trim();
    if (!text) {
      return res.status(400).json({ error: 'El texto de la tarea es requerido' });
    }
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo guardar la tarea: ' + err.message });
  }
});

// PUT /api/tasks/:id - Actualizar (completar o editar)
router.put('/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.text) task.text = req.body.text.trim();
    writeTasks(tasks);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo actualizar la tarea: ' + err.message });
  }
});

// DELETE /api/tasks/:id - Eliminar
router.delete('/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    const deletedTask = tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.json({ message: 'Tarea eliminada', task: deletedTask[0] });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo eliminar la tarea: ' + err.message });
  }
});

module.exports = router;