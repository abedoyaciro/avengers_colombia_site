// index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión con pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.send('🟢 API Activa');
});

// ==================== USUARIOS ====================

// Registrar usuario
app.post('/api/usuarios', async (req, res) => {
  const { nombre, correo, contrasenha, ubicacion } = req.body;

  if (!nombre || !correo || !contrasenha || !ubicacion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO usuarios (nombre, correo, contrasenha, ubicacion)
       VALUES (?, ?, ?, ?)`,
      [nombre, correo, contrasenha, ubicacion]
    );

    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (conn) await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Correo ya registrado' });
    } else {
      console.error('❌ ERROR en la base de datos:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    }
  } finally {
    if (conn) conn.release();
  }
});

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [usuarios] = await conn.query('SELECT * FROM usuarios');
    res.json(usuarios);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// ==================== HÉROES ====================

// Registrar héroe
app.post('/api/heroes', async (req, res) => {
  const { nombre, correo, contrasenha, especializacion } = req.body;

  if (!nombre || !correo || !contrasenha || !especializacion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO heroes (nombre, correo, contrasenha, especializacion)
       VALUES (?, ?, ?, ?)`,
      [nombre, correo, contrasenha, especializacion]
    );

    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (conn) await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Correo ya registrado' });
    } else {
      console.error('❌ Error al registrar héroe:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    }
  } finally {
    if (conn) conn.release();
  }
});

// Obtener todos los héroes
app.get('/api/heroes', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [heroes] = await conn.query('SELECT * FROM heroes');
    res.json(heroes);
  } catch (err) {
    console.error('❌ Error al obtener héroes:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// ==================== TAREAS ====================

// Publicar tarea
app.post('/api/tareas', async (req, res) => {
  const { titulo, descripcion, tema, fecha_deseada, id_usuario } = req.body;

  if (!titulo || !descripcion || !tema || !fecha_deseada || !id_usuario) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO tareas (titulo, descripcion, tema, fecha_deseada, id_usuario, estado)
       VALUES (?, ?, ?, ?, ?, 'Sin Asignar')`,
      [titulo, descripcion, tema, fecha_deseada, id_usuario]
    );

    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('❌ Error al publicar tarea:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [tareas] = await conn.query('SELECT * FROM tareas');
    res.json(tareas);
  } catch (err) {
    console.error('❌ Error al obtener tareas:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// Eliminar tarea por ID
app.delete('/api/tareas/:id_tarea', async (req, res) => {
  const { id_tarea } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `DELETE FROM tareas WHERE id_tarea = ? AND estado = 'Sin Asignar'`,
      [id_tarea]
    );

    await conn.commit();

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Tarea no encontrada o ya fue asignada' });
    } else {
      res.json({ mensaje: 'Tarea eliminada con éxito' });
    }
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('❌ Error al eliminar tarea:', err);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  } finally {
    if (conn) conn.release();
  }
});


// Ruta: Obtener tareas de un usuario específico
app.get('/api/usuarios/:id_usuario/tareas', async (req, res) => {
  const { id_usuario } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    const [tareas] = await conn.execute(
      `SELECT * FROM tareas WHERE id_usuario = ?`,
      [id_usuario]
    );
    res.json(tareas);
  } catch (err) {
    console.error('❌ Error al obtener tareas del usuario:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// Ruta para cargar tareas en formato Kanban para el panel del héroe
app.get('/api/tareas/kanban', async (req, res) => {
  const { id_heroe } = req.query;

  if (!id_heroe) {
    return res.status(400).json({ error: 'Falta el id del héroe' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const [sinAsignar] = await conn.query(
      `SELECT * FROM tareas WHERE estado = 'Sin Asignar'`
    );
    const [asignadas] = await conn.query(
      `SELECT * FROM tareas WHERE estado = 'Asignada' AND id_heroe = ?`,
      [id_heroe]
    );
    const [finalizadas] = await conn.query(
      `SELECT * FROM tareas WHERE estado = 'Finalizada' AND id_heroe = ?`,
      [id_heroe]
    );

    res.json({
      sinAsignar,
      asignadas,
      finalizadas
    });
  } catch (err) {
    console.error('❌ Error al obtener tareas del Kanban:', err);
    res.status(500).json({ error: 'Error al cargar tareas para Kanban' });
  } finally {
    if (conn) conn.release();
  }
});

// Finalizar tarea por título (desde Kanban)
app.put('/api/tareas/finalizar', async (req, res) => {
  const { titulo, comentario, id_heroe } = req.body;

  if (!titulo || !comentario || !id_heroe) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `UPDATE tareas
       SET estado = 'Finalizada',
           comentario_heroe = ?
       WHERE titulo = ? AND id_heroe = ? AND estado = 'Asignada'`,
      [comentario, titulo, id_heroe]
    );

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no está asignada' });
    }

    res.json({ mensaje: 'Tarea finalizada con éxito' });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error('❌ Error al finalizar tarea desde Kanban:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});


// Asignar tarea a un héroe (por título)
app.put('/api/tareas/asignar', async (req, res) => {
  const { titulo, id_heroe } = req.body;

  if (!titulo || !id_heroe) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `UPDATE tareas
       SET id_heroe = ?, estado = 'Asignada'
       WHERE titulo = ? AND estado = 'Sin Asignar'`,
      [id_heroe, titulo]
    );

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o ya asignada' });
    }

    res.json({ mensaje: 'Tarea asignada correctamente' });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error('❌ Error al asignar tarea por título:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});


// Ruta: Obtener detalle de una tarea por su ID
app.get('/api/tareas/:id_tarea', async (req, res) => {
  const { id_tarea } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    const [tareas] = await conn.execute(
      `SELECT * FROM tareas WHERE id_tarea = ?`,
      [id_tarea]
    );

    if (tareas.length === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.json(tareas[0]);
    }
  } catch (err) {
    console.error('❌ Error al obtener tarea:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// Ruta: Obtener tareas asignadas a un héroe
app.get('/api/heroes/:id_heroe/tareas', async (req, res) => {
  const { id_heroe } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    const [tareas] = await conn.execute(
      `SELECT * FROM tareas WHERE id_heroe = ? AND estado = 'Asignada'`,
      [id_heroe]
    );
    res.json(tareas);
  } catch (err) {
    console.error('❌ Error al obtener tareas del héroe:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// Ruta: Obtener tareas finalizadas por un héroe
app.get('/api/heroes/:id_heroe/tareas/finalizadas', async (req, res) => {
  const { id_heroe } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    const [tareas] = await conn.execute(
      `SELECT * FROM tareas WHERE id_heroe = ? AND estado = 'Finalizada'`,
      [id_heroe]
    );
    res.json(tareas);
  } catch (err) {
    console.error('❌ Error al obtener tareas finalizadas del héroe:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// ==================== LOGIN ====================

// Login de usuario
app.post('/api/usuarios/login', async (req, res) => {
  const { correo, contrasenha } = req.body;

  if (!correo || !contrasenha) {
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM usuarios WHERE correo = ? AND contrasenha = ?`,
      [correo, contrasenha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];
    res.json({ ...usuario, rol: 'usuario' });
  } catch (err) {
    console.error('❌ Error en login de usuario:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});

// Login de héroe
app.post('/api/heroes/login', async (req, res) => {
  const { correo, contrasenha } = req.body;

  if (!correo || !contrasenha) {
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM heroes WHERE correo = ? AND contrasenha = ?`,
      [correo, contrasenha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const heroe = rows[0];
    res.json({ ...heroe, rol: 'heroe' });
  } catch (err) {
    console.error('❌ Error en login de héroe:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  } finally {
    if (conn) conn.release();
  }
});



// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

