// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/tasks';

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar las tareas. ¿Está el backend encendido?');
      console.error(err);
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
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks([...tasks, savedTask]);
        setInputText('');
        setError('');
      } else {
        setError('Error al agregar tarea');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
      console.error(err);
    }
  };

  const toggleCompleted = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };

    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTask.completed })
      });

      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      setError('');
    } catch (err) {
      setError('No se pudo actualizar la tarea');
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      setTasks(tasks.filter(t => t.id !== id));
      setError('');
    } catch (err) {
      setError('No se pudo eliminar la tarea');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Mi Lista de Tareas</h1>
        <p>Conectada a tu API Node.js ✅</p>
      </header>

      <main className="App-main">
        {error && <div className="error">{error}</div>}

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Añade una nueva tarea..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="task-input"
          />
          <button type="submit" disabled={!inputText.trim()}>
            Añadir
          </button>
        </form>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="empty">No hay tareas. ¡Agrega una!</li>
            ) : (
              tasks.map(task => (
                <li
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompleted(task)}
                    />
                    <span>{task.text}</span>
                  </label>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
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