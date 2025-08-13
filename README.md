# 📝 To-Do List App

Una aplicación de tareas simple, elegante y funcional construida con tecnologías modernas.  
Perfecta para organizar tu día, estudiar, trabajar o simplemente probar tus habilidades fullstack.

🎯 **Live Demo**: [Próximamente en Vercel](#)  
🔧 **Backend**: Node.js + Express  
🎨 **Frontend**: React  
💾 **Persistencia**: Archivo JSON (fácil de escalar a SQLite)  
📱 **Responsive**: Funciona en móvil y escritorio

![To-Do App Screenshot](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=To-Do+App+Demo)  
*(Puedes subir una captura de pantalla después con `git add .`)*

---

## ✨ Funcionalidades

- ✅ Agregar nuevas tareas
- ✅ Marcar tareas como completadas (tachado)
- ✅ Eliminar tareas con un clic
- 💾 Persistencia entre recargas (guardado en `tasks.json`)
- 🔄 API REST entre frontend y backend
- 📱 Diseño responsive (usa bien el espacio en móvil y escritorio)

---

## 🧰 Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Base de datos | `data/tasks.json` (almacenamiento simple) |
| Comunicación | API REST (fetch) |
| Control de versiones | Git + GitHub |
| Estilos | CSS moderno (Flexbox) |

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona el repositorio
```bash
git clone https://github.com/TheJPlay2006/todo-app.git
cd todo-app
```

### 2. Inicia el backend
```bash
cd backend
npm install
npm run dev
```

### 3. Inicia el frontend (en otra terminal)
```bash
cd frontend
npm install
npm start
```

El frontend estará disponible en `http://localhost:3000` y el backend en `http://localhost:5000`.

---

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Obtiene todas las tareas |
| `POST` | `/api/tasks` | Crea una nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualiza una tarea (completada) |
| `DELETE` | `/api/tasks/:id` | Elimina una tarea |

---

## 📂 Estructura del proyecto

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   └── routes/tasks.js
│   ├── data/
│   │   └── tasks.json
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   └── package.json
└── README.md
```

---

## 🔧 Próximas mejoras

- [ ] Base de datos SQLite o MongoDB
- [ ] Autenticación de usuarios
- [ ] Categorías y filtros
- [ ] Fechas límite para tareas
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

---

## 🙌 Autor

**TheJPlay2006** 🚀  
Desarrollador en crecimiento, construyendo proyectos reales paso a paso.

- GitHub: [@TheJPlay2006](https://github.com/TheJPlay2006)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usar, modificar y distribuir el código libremente.

---

⭐ **¿Te gustó el proyecto?** ¡Dale una estrella en GitHub y compártelo!
