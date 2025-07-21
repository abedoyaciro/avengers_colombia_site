-- Crear base de datos (solo si no existe)
CREATE DATABASE IF NOT EXISTS avengers_colombia;
USE avengers_colombia;

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  contrasenha VARCHAR(100),
  ubicacion VARCHAR(100)
);

-- Tabla: heroes
CREATE TABLE IF NOT EXISTS heroes (
  id_heroe INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  contrasenha VARCHAR(100),
  especializacion VARCHAR(100)
);

-- Tabla: tareas
CREATE TABLE IF NOT EXISTS tareas (
  id_tarea INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100),
  descripcion TEXT,
  tema VARCHAR(100),
  fecha_deseada DATE,
  estado ENUM('Sin Asignar', 'Asignada', 'Finalizada') DEFAULT 'Sin Asignar',
  comentario_heroe TEXT,

  id_usuario INT,
  id_heroe INT,

  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_heroe) REFERENCES heroes(id_heroe) ON DELETE SET NULL
);

-- insert usuarios
INSERT IGNORE INTO usuarios (nombre, correo, contrasenha, ubicacion) VALUES
('Andrea Torres', 'andrea@correo.com', '123abc!', 'Cali'),
('Luis Ramírez', 'luis@correo.com', '456def!', 'Medellín'),
('Camila Díaz', 'camila@correo.com', '789ghi!', 'Bogotá');

-- heroes
INSERT IGNORE INTO heroes (nombre, correo, contrasenha, especializacion) VALUES
('Carlos Bravo', 'carlos@heroes.com', 'abc123!', 'Matemáticas'),
('Daniela Pérez', 'daniela@heroes.com', 'def456!', 'Programación'),
('Juan Nieto', 'juan@heroes.com', 'ghi789!', 'Inglés');

-- tareas
INSERT IGNORE INTO tareas (titulo, descripcion, tema, fecha_deseada, estado, id_usuario) VALUES
('Resolver ecuaciones', 'Necesito ayuda con ecuaciones de segundo grado.', 'Matemáticas', '2025-07-25', 'Sin Asignar', 1),
('Ensayo de inglés', 'Revisar mi ensayo sobre tecnología.', 'Inglés', '2025-07-22', 'Asignada', 2),
('Proyecto HTML', 'Ayuda con estructura básica de HTML.', 'Programación', '2025-07-23', 'Finalizada', 3);
