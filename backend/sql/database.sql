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
('Camila Díaz', 'camila@correo.com', '789ghi!', 'Bogotá'),
('María González', 'maria@correo.com', 'pass123!', 'Barranquilla'),
('Pedro Sánchez', 'pedro@correo.com', 'abc456!', 'Cartagena'),
('Ana López', 'ana@correo.com', '789xyz!', 'Bucaramanga');

-- heroes
INSERT IGNORE INTO heroes (nombre, correo, contrasenha, especializacion) VALUES
('Carlos Bravo', 'carlos@heroes.com', 'abc123!', 'Matemáticas'),
('Daniela Pérez', 'daniela@heroes.com', 'def456!', 'Programación'),
('Juan Nieto', 'juan@heroes.com', 'ghi789!', 'Inglés'),
('Sofia Mendoza', 'sofia@heroes.com', 'hero123!', 'Literatura'),
('Diego Herrera', 'diego@heroes.com', 'super456!', 'Historia'),
('Valentina Castro', 'vale@heroes.com', 'hero789!', 'Psicología');

-- tareas - Casos de uso completos
INSERT IGNORE INTO tareas (titulo, descripcion, tema, fecha_deseada, estado, id_usuario, id_heroe, comentario_heroe) VALUES
-- Tareas SIN ASIGNAR (para que los héroes puedan tomarlas)
('Resolver ecuaciones cuadráticas', 'Necesito ayuda urgente con ecuaciones de segundo grado para mi examen de mañana.', 'Matemáticas', '2025-07-25', 'Sin Asignar', 1, NULL, NULL),
('Traducir texto al inglés', 'Tengo un documento importante que necesito traducir correctamente.', 'Inglés', '2025-07-26', 'Sin Asignar', 2, NULL, NULL),
('Crear página web básica', 'Necesito aprender HTML y CSS para mi proyecto universitario.', 'Programación', '2025-07-27', 'Sin Asignar', 3, NULL, NULL),
('Análisis literario', 'Ayuda con análisis de "Cien años de soledad" para ensayo.', 'Literatura', '2025-07-28', 'Sin Asignar', 4, NULL, NULL),
('Resolver problemas de física', 'Ejercicios de mecánica clásica que no entiendo.', 'Matemáticas', '2025-07-29', 'Sin Asignar', 5, NULL, NULL),

-- Tareas ASIGNADAS (en progreso)
('Mejorar redacción', 'Revisar mi ensayo sobre cambio climático, mejorar estilo y coherencia.', 'Literatura', '2025-07-24', 'Asignada', 6, 4, NULL),
('Aprender Python básico', 'Introducción a programación en Python, conceptos fundamentales.', 'Programación', '2025-07-25', 'Asignada', 1, 2, NULL),
('Historia de Colombia', 'Necesito entender la independencia colombiana para mi examen.', 'Historia', '2025-07-26', 'Asignada', 2, 5, NULL),
('Gramática inglesa', 'Problemas con tiempos verbales en inglés, necesito práctica.', 'Inglés', '2025-07-27', 'Asignada', 3, 3, NULL),
('Consejos de estudio', 'Técnicas para mejorar concentración y hábitos de estudio.', 'Psicología', '2025-07-28', 'Asignada', 4, 6, NULL),

-- Tareas FINALIZADAS (con comentarios de héroes)
('Álgebra lineal', 'Sistemas de ecuaciones 3x3, método de eliminación gaussiana.', 'Matemáticas', '2025-07-20', 'Finalizada', 5, 1, 'Excelente progreso. Te expliqué el método paso a paso y ahora dominas la eliminación gaussiana. Practica con más ejercicios similares. ¡Sigue así!'),
('Ensayo argumentativo', 'Estructura y técnicas para escribir ensayos persuasivos.', 'Literatura', '2025-07-21', 'Finalizada', 6, 4, 'Tu ensayo mejoró considerablemente. Trabajamos en la estructura: introducción, desarrollo y conclusión. Recuerda usar conectores y evidencia sólida.'),
('JavaScript básico', 'Fundamentos de programación web con JavaScript.', 'Programación', '2025-07-22', 'Finalizada', 1, 2, 'Dominaste variables, funciones y eventos. Tu proyecto final del calculadora quedó perfecto. Siguiente paso: aprende sobre DOM manipulation.'),
('Conversación en inglés', 'Práctica de speaking y pronunciation en inglés.', 'Inglés', '2025-07-23', 'Finalizada', 2, 3, 'Tu pronunciación mejoró mucho en estas sesiones. Practica 15 minutos diarios con videos en inglés. Confidence is key!'),
('Revolución Industrial', 'Causas y consecuencias de la Revolución Industrial europea.', 'Historia', '2025-07-19', 'Finalizada', 3, 5, 'Comprendiste perfectamente el contexto histórico. Tu línea de tiempo quedó excelente. Para el examen, enfócate en las consecuencias sociales.');
