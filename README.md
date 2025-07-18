backend/
├── index.js                  ← servidor principal (carga rutas y config)
├── .env
├── sql/
│   └── database.sql
├── db/
│   └── pool.js               ← conexión a MySQL con pool
├── routes/
│   ├── usuarios.js           ← rutas relacionadas a usuarios
│   ├── heroes.js             ← rutas relacionadas a héroes
│   └── tareas.js             ← rutas relacionadas a tareas
├── controllers/
│   ├── usuarioController.js  ← lógica de negocio de usuarios
│   └── ...
└── package.json

Ejecutar con node index.js
Script para ejecutar base de datos MySQL
mysql -u root -p < sql/database.sql

## Versiones del Proyecto
### Backend (Node.js + Express)
- Node.js: `v22.17.1`
- express: `4.18.2`
- mysql2: `3.9.6`
- dotenv: `16.3.1`
- cors: `2.8.5`

### 💻 Frontend (HTML + JS)
- HTML5
- CSS3
- JavaScript (ES6+)


## **Pasos para Ejecutar el Proyecto**

Para poner en marcha la aplicación completa (frontend y backend), sigue estos pasos:

### **1. Iniciar el Backend (Servidor Node.js)**

El backend es el encargado de proveer los datos y la lógica de autenticación (login, tareas, etc.) a tu frontend.

1.  **Navega a la carpeta del backend:**
    ```bash
    cd backend-node
    ```

2.  **Instala las dependencias del backend:**
    Esto descargará todas las librerías necesarias para que el servidor funcione (como Express y CORS).
    ```bash
    npm install
    ```

3.  **Inicia el servidor Node.js:**
    ```bash
    npm start
    ```
    Verás un mensaje en la terminal indicando que el servidor está escuchando, probablemente en `http://localhost:3000`. **Deja esta terminal abierta** mientras uses la aplicación.

<!-- ### **2. Servir el Frontend (Páginas HTML)**

Tu frontend consta de archivos HTML estáticos que necesitan ser servidos a través de un servidor web para funcionar correctamente (especialmente para evitar problemas de CORS y manejo de rutas).

**Opción A: Usar un servidor estático simple (Recomendado para pruebas rápidas)**

Esta opción es la más sencilla y no requiere modificar tu backend.

1.  **Instala `serve` globalmente** (si no lo tienes ya). Esto solo necesita hacerse una vez en tu máquina:
    ```bash
    npm install -g serve
    ```

2.  **Abre una nueva terminal** (sin cerrar la del backend).

3.  **Navega a la carpeta principal de tu proyecto** (la que contiene `frontendgacy`, `backend-node`, etc.):
    ```bash
    cd <ruta-a-tu-proyecto-raiz>
    ```
    (Si estás en `backend-node`, simplemente `cd ..`)

4.  **Inicia el servidor para tu frontend:**
    ```bash
    serve frontend -l 5000
    ```
    Verás un mensaje indicando que el frontend está sirviéndose, probablemente en `http://localhost:5000`.

5.  **Abre tu navegador** y visita una de las páginas principales de tu frontend, por ejemplo:
    * `http://localhost:5000/login.html`
    * `http://localhost:5000/mis-tareas.html` (una vez logeado, si tu login simula redirección)

**Opción B: Servir el frontend desde el mismo backend (Si ya lo configuraste así)**

Si has movido tu carpeta `frontend` dentro de `backend-node/public` y configuraste Express para servir archivos estáticos (como se explicó en la respuesta anterior), entonces no necesitas el paso `serve`. Simplemente el backend ya estaría sirviendo todo.

1.  Asegúrate de que `frontend` esté en `backend-node/public`.
2.  Inicia el backend siguiendo los pasos de la sección "1. Iniciar el Backend".
3.  Abre tu navegador y visita la URL donde tu backend sirve los archivos estáticos (ej., `http://localhost:3000/login.html`).

---

## **¡Listo para Probar!**

Una vez que ambos servidores (backend y frontend) estén corriendo, tu aplicación estará funcional. Podrás interactuar con tu frontend y las solicitudes HTTP se enviarán al backend de Node.js. -->

---

### **Para Detener la Aplicación**

En cada terminal donde tengas un servidor corriendo (backend y `serve`), presiona `Ctrl + C`.

---

# 🦸‍♂️ Avengers Colombia

## Equipo de Desarrollo

- **Anderson Bedoya Ciro** (<abedoyaci@unal.edu.co>)
- **Nicolás Orozco Medina** (<norozcom@unal.edu.co>)
- **Andrés Felipe Diez Ángel** (<adieza@unal.edu.co>)
- **Isabel Cristina Ramírez Ramírez** (<isramirezr@unal.edu.co>)

---

## Descripción del Proyecto

**Avengers Colombia** es una plataforma web desarrollada como proyecto académico para la asignatura de Desarrollo Web (2025-1). El sistema permite a usuarios publicar tareas o solicitudes de ayuda y a héroes aceptar y gestionar dichas tareas, promoviendo la colaboración y el apoyo en el país.

El proyecto incluye funcionalidades de registro, inicio de sesión, publicación y gestión de tareas, así como asignación y finalización de tareas por parte de los héroes.

---

## 🚀 Instrucciones para Ejecutar el Proyecto

### Opción 1: Usar la versión desplegada

Puedes acceder y probar la plataforma directamente desde el siguiente enlace:

🔗 [https://abedoyaciro.github.io/avengers_colombia_site/index.html](https://abedoyaciro.github.io/avengers_colombia_site/index.html)

### Opción 2: Ejecutar localmente

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/abedoyaciro/avengers_colombia_site.git
   ```

2. **Abre la carpeta del proyecto en tu editor (por ejemplo, VS Code).**
3. **Abre el archivo `index.html` en tu navegador.**
   - Puedes hacer doble clic sobre el archivo o usar una extensión como "Live Server" en VS Code para una mejor experiencia.

> **Nota:** El sistema utiliza `localStorage` para almacenar los datos de usuarios, héroes y tareas. Al abrirlo en diferentes navegadores o limpiar los datos del navegador, se reiniciarán los datos de prueba.

---

## 🧪 Datos de Prueba

Al iniciar la aplicación por primera vez, se cargan automáticamente los siguientes datos de ejemplo en el `localStorage`:

**Usuarios:**

- Juan Pérez (`juan@correo.com`), contraseña: `Demo123!`, ubicación: Bogotá
- Ana Torres (`ana@correo.com`), contraseña: `Demo123!`, ubicación: Medellín

**Héroes:**

- Capitán Colombia (`capitan@correo.com`), contraseña: `Heroe123!`, especialización: Tecnología
- Doctora Paz (`paz@correo.com`), contraseña: `Heroe123!`, especialización: Psicología

**Tareas:**

- **Ayuda con ensayo:**
  Tema: Literatura  
  Descripción: Necesito ayuda con un ensayo de literatura.  
  Fecha: 2025-06-25  
  Estado: Sin Asignar

- **Revisión de ortografía:**  
  Tema: Ortografía  
  Descripción: Revisar ortografía de mi tarea.  
  Fecha: 2025-06-26  
  Estado: Asignada  
  Héroe asignado: Capitán Colombia

- **Consejo psicológico:**  
  Tema: Psicología  
  Descripción: Busco orientación emocional.  
  Fecha: 2025-06-20  
  Estado: Finalizada  
  Héroe asignado: Doctora Paz  
  Comentario del héroe: ¡Ánimo, sigue adelante!

Puedes usar estos datos para probar las funcionalidades del sistema.

---

## 📄 Documentación

La documentación completa del proyecto (requisitos, casos de uso, modelo entidad-relación, wireframes, etc.) está disponible en:

🔗 [https://github.com/abedoyaciro/avengers_colombia_site/tree/main/docs](https://github.com/abedoyaciro/avengers_colombia_site/tree/main/docs)

---

## 📝 Créditos

Proyecto desarrollado por el Equipo 19 de Desarrollo Web para la Universidad Nacional de Colombia, 2025-1.
