// src/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Ruta para tareas
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

// Inicia el servidor en 0.0.0.0 para mayor compatibilidad
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Mensaje de advertencia si hay error
app.on('error', (err) => {
  console.error('❌ Error del servidor:', err.message);
});