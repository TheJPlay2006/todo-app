require('dotenv').config();

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

// Rutas de tareas
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
