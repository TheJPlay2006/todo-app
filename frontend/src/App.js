import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/tasks';

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Tareas cargadas desde el backend:', data);
      setTasks(data);
    } catch (err) {
      console.error('❌ Error al cargar tareas:', err.message);
      alert('No se pudieron cargar las tareas. Verifica que el backend esté corriendo en http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva tarea
  const addTask = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask = { text: inputText.trim() };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'No se pudo crear la tarea');
      }

      setInputText('');
      fetchTasks(); // Recargar todas las tareas
    } catch (err) {
      console.error('❌ Error al agregar tarea:', err.message);
      alert('No se pudo crear la tarea. Revisa el backend.');
    }
  };

  // Marcar tarea como completada
  const toggleCompleted = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });

      if (!response.ok) throw new Error('No se pudo actualizar');

      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      console.error('❌ Error al actualizar tarea:', err.message);
      alert('No se pudo actualizar la tarea.');
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('No se pudo eliminar');

      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('❌ Error al eliminar tarea:', err.message);
      alert('No se pudo eliminar la tarea.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Mi To-Do List</h1>
        <p>Conectada a Supabase ✅</p>
      </header>

      <main className="App-main">
        {/* Formulario para añadir tareas */}
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Añade una tarea..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="task-input"
            aria-label="Texto de la nueva tarea"
          />
          <button type="submit">Añadir</button>
        </form>

        {/* Lista de tareas */}
        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="empty">No hay tareas guardadas</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompleted(task)}
                      aria-label={`Marcar "${task.text}" como completada`}
                    />
                    <span>{task.text}</span>
                  </label>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="delete-btn"
                    aria-label={`Eliminar tarea: ${task.text}`}
                  >
                    ×
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
