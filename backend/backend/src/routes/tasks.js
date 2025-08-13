const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// GET /api/tasks - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id');

    if (error) {
      console.error('❌ Error Supabase:', error);
      return res.status(500).json({ error: 'No se pudieron cargar las tareas' });
    }

    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener tareas:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/tasks - Crear tarea
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    // Validar entrada
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.error('❌ Error: Texto inválido');
      return res.status(400).json({
        error: 'Campo "text" es requerido y no puede estar vacío'
      });
    }

    console.log('✅ Texto válido:', text.trim());

    // Insertar en Supabase
    console.log('ℹ️ Intentando insertar en Supabase...');
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ text: text.trim(), completed: false }])
      .select();

    if (error) {
      console.error('❌ Error en Supabase:', error.message);
      return res.status(500).json({
        error: 'No se pudo crear la tarea',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      console.error('❌ Error: Supabase devolvió datos nulos');
      return res.status(500).json({
        error: 'Error al guardar la tarea',
        details: 'Supabase devolvió datos nulos'
      });
    }

    console.log('✅ Tarea creada:', data);
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('❌ Error en el servidor:', err.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: err.message
    });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { completed, text } = req.body;
    const updates = {};
    if (completed !== undefined) updates.completed = completed;
    if (text) updates.text = text.trim();

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });

    res.json(data[0]);
  } catch (err) {
    console.error('❌ Error al actualizar tarea:', err.message);
    res.status(500).json({ error: 'No se pudo actualizar' });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });

    res.json({ message: 'Tarea eliminada', task: data[0] });
  } catch (err) {
    console.error('❌ Error al eliminar tarea:', err.message);
    res.status(500).json({ error: 'No se pudo eliminar' });
  }
});

module.exports = router;
