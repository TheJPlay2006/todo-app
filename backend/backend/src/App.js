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
        throw new Error('Error al cargar las tareas');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('❌ Error al cargar tareas:', err.message);
    } finally {
      setLoading(false);
    }
  };

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
        throw new Error('Error al crear la tarea');
      }
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setInputText('');
    } catch (err) {
      console.error('❌ Error al agregar tarea:', err.message);
    }
  };

  const toggleCompleted = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      console.error('❌ Error al actualizar tarea:', err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('❌ Error al eliminar tarea:', err.message);
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
          />
          <button type="submit">Añadir</button>
        </form>

        {/* Lista de tareas */}
        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="empty">No hay tareas</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompleted(task)}
                    />
                    <span>{task.text}</span>
                  </label>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
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
