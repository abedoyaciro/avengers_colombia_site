// backend-node/index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // ¡Añade esta línea para manejar rutas de archivos!
const app = express();
const port = 3000;

// Habilita CORS para permitir solicitudes desde otros orígenes
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// --- Configuración para servir archivos estáticos del frontend ---

// Sirve los archivos de la carpeta 'app-legacy' bajo la ruta '/app-legacy'
app.use('/app-legacy', express.static(path.join(__dirname, '..', 'app-legacy')));

// Sirve el archivo index.html directamente desde la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// --- Tus rutas de API irán aquí ---

// Ejemplo de una ruta de API para obtener tareas
app.get('/api/tareas', (req, res) => {
  const tareas = [
    { id: 1, titulo: 'Comprar leche', completada: false },
    { id: 2, titulo: 'Pasear al perro', completada: true }
  ];
  res.json(tareas);
});

// --- Fin de tus rutas de API ---

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor de Node.js escuchando en http://localhost:${port}`);
});