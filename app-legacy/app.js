// Activación de la plataforma
console.log("Avengers Colombia - Plataforma activa");

const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
const usuarioActivo = localStorage.getItem('usuarioActivo');

document.addEventListener('DOMContentLoaded', () => {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const heroes = JSON.parse(localStorage.getItem('heroes')) || [];
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  const datos = [...usuarios, ...heroes].find(u => u.email === usuarioActivo);

  if (datos) {
    // Cambiar clase visual si es héroe
    if (datos.rol === 'heroe') {
      document.body.classList.add('modo-heroe');

      // Agregar clase especial al <nav>
      const nav = document.querySelector('nav');
      if (nav) nav.classList.add('nav-heroe');
    }

    // Cambiar el título del <h1> en el header
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
      headerTitle.textContent = datos.rol === 'heroe' ? 'Panel del Héroe' : 'Panel del Usuario';
    }
  }
});


// ---------- Función general para cerrar sesión ----------
function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = 'index.html';
}

// ---------- Inicio de sesión ----------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('usuarios')) || [];
    const heroes = JSON.parse(localStorage.getItem('heroes')) || [];

    const encontrado = [...users, ...heroes].find(u => u.email === email && u.password === password);

    if (encontrado) {
      alert('¡Bienvenido, ' + encontrado.nombre + '!');
      localStorage.setItem('usuarioActivo', encontrado.email);
      window.location.href = encontrado.rol === 'heroe' ? 'tareas-heroe.html' : 'mis-tareas.html';
    } else {
      alert('Correo o contraseña incorrectos');
    }
  });
}

// ---------- Registro de usuario ----------
const registerUserForm = document.getElementById('registerUserForm');
if (registerUserForm) {
  registerUserForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const ubicacion = document.getElementById('ubicacion').value;

    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert('La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.some(u => u.email === email)) {
      alert('Este correo ya está registrado.');
      return;
    }

    usuarios.push({ nombre, email, password, ubicacion, rol: 'usuario' });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado con éxito. Puedes iniciar sesión.');
    window.location.href = 'login.html';
  });
}

// ---------- Registro de héroe ----------
const registerHeroForm = document.getElementById('registerHeroForm');
if (registerHeroForm) {
  registerHeroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const especializacion = document.getElementById('especializacion').value;
    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert('La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.');
      return;
    }

    const heroes = JSON.parse(localStorage.getItem('heroes')) || [];

    if (heroes.some(h => h.email === email)) {
      alert('Este correo ya está registrado.');
      return;
    }

    heroes.push({ nombre, email, password, especializacion, rol: 'heroe' });
    localStorage.setItem('heroes', JSON.stringify(heroes));

    alert('Héroe registrado con éxito. Puedes iniciar sesión.');
    window.location.href = 'login.html';
  });
}

// ---------- Publicación de tareas ----------
const tareaForm = document.getElementById('tareaForm');
if (tareaForm) {
  tareaForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const tema = document.getElementById('tema').value;
    const fecha = document.getElementById('fecha').value;

    tareas.push({ titulo, descripcion, tema, fecha, estado: 'Sin Asignar' });
    localStorage.setItem('tareas', JSON.stringify(tareas));

    alert('Tarea publicada con éxito.');
    window.location.href = 'mis-tareas.html';
  });
}

// ---------- Mostrar tareas publicadas (editar/eliminar) ----------
function mostrarTareasPublicadas() {
  const contenedor = document.getElementById('taskList');
  if (!contenedor) return;

  contenedor.innerHTML = tareas.length === 0
    ? '<p style="text-align: center;">No has publicado tareas aún.</p>'
    : generarTablaTareas();
}

function generarTablaTareas() {
  let tabla = `<table>
    <thead>
      <tr>
        <th>Título</th><th>Descripción</th><th>Tema</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
      </tr>
    </thead><tbody>`;

  tareas.forEach((tarea, index) => {
    tabla += `
      <tr>
        <td contenteditable="${tarea.estado === 'Sin Asignar'}">${tarea.titulo}</td>
        <td contenteditable="${tarea.estado === 'Sin Asignar'}">${tarea.descripcion}</td>
        <td contenteditable="${tarea.estado === 'Sin Asignar'}">${tarea.tema}</td>
        <td contenteditable="${tarea.estado === 'Sin Asignar'}">${tarea.fecha}</td>
        <td>${tarea.estado}</td>
        <td>
          ${tarea.estado === 'Sin Asignar'
        ? `
                <button onclick="guardarCambios(${index})">Guardar</button>
                <button onclick="eliminarTarea(${index})">Eliminar</button>
              `
        : tarea.estado === 'Finalizada'
          ? `<button onclick="verDetalle(${index})">Ver Detalles</button>`
          : ''
      }
        </td>

      </tr>`;
  });

  return tabla + '</tbody></table>';
}

function guardarCambios(index) {
  const fila = document.querySelectorAll('tbody tr')[index];
  const celdas = fila.querySelectorAll('td');

  tareas[index] = {
    ...tareas[index],
    titulo: celdas[0].innerText,
    descripcion: celdas[1].innerText,
    tema: celdas[2].innerText,
    fecha: celdas[3].innerText
  };

  localStorage.setItem('tareas', JSON.stringify(tareas));
  alert('Cambios guardados exitosamente.');
  mostrarTareasPublicadas();
}

function eliminarTarea(index) {
  if (confirm('¿Eliminar esta tarea?')) {
    tareas.splice(index, 1);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareasPublicadas();
  }
}

// ---------- Mostrar tareas disponibles ----------
function mostrarTareasDisponibles() {
  const contenedor = document.getElementById('listaTareas');
  if (!contenedor) return;

  const disponibles = tareas.filter(t => t.estado === 'Sin Asignar');

  contenedor.innerHTML = disponibles.length === 0
    ? '<p>No hay tareas disponibles por ahora.</p>'
    : disponibles.map((tarea, i) => `
      <div class="task-item">
        <h3>${tarea.titulo}</h3>
        <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
        <p><strong>Tema:</strong> ${tarea.tema}</p>
        <p><strong>Fecha:</strong> ${tarea.fecha}</p>
        <button onclick="asignarTarea(${i})" id="btn-asignar-${i}">Aceptar tarea</button>
      </div>
    `).join('');
}

function asignarTarea(indiceVisible) {
  const sinAsignar = tareas.filter(t => t.estado === 'Sin Asignar');
  const tarea = sinAsignar[indiceVisible];
  const indexReal = tareas.findIndex(t => t.titulo === tarea.titulo && t.estado === 'Sin Asignar');

  if (indexReal !== -1) {
    tareas[indexReal].estado = 'Asignada';
    tareas[indexReal].heroe = usuarioActivo;
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }

  const boton = document.getElementById(`btn-asignar-${indiceVisible}`);
  if (boton) {
    boton.disabled = true;
    boton.textContent = "Tarea aceptada ✅";
    boton.style.backgroundColor = "#ccc";
  }

  mostrarTareasDisponibles();
}

// ---------- Mostrar tareas asignadas ----------
function mostrarAsignadas() {
  const contenedor = document.getElementById('tareasAsignadas');
  if (!contenedor) return;

  const asignadas = tareas.filter(t => t.estado === 'Asignada' && t.heroe === usuarioActivo);
  contenedor.innerHTML = asignadas.length === 0
    ? '<p>No tienes tareas asignadas aún.</p>'
    : asignadas.map((tarea, i) => `
      <div class="task-item">
        <h3>${tarea.titulo}</h3>
        <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
        <p><strong>Tema:</strong> ${tarea.tema}</p>
        <p><strong>Fecha:</strong> ${tarea.fecha}</p>
        <textarea id="comentario-${i}" placeholder="Comentario del héroe..."></textarea>
        <button onclick="marcarFinalizada('${tarea.titulo}', ${i})">Marcar como Finalizada</button>
      </div>
    `).join('');
}

function marcarFinalizada(titulo, indexTextarea) {
  const comentario = document.getElementById(`comentario-${indexTextarea}`).value.trim();
  if (!comentario) {
    alert('Escribe un comentario.');
    return;
  }

  const index = tareas.findIndex(t => t.titulo === titulo && t.estado === 'Asignada' && t.heroe === usuarioActivo);
  if (index !== -1) {
    tareas[index].estado = 'Finalizada';
    tareas[index].comentarioHeroe = comentario;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarAsignadas();
  }
}

// ---------- Mostrar tareas finalizadas ----------
function mostrarFinalizadas() {
  const contenedor = document.getElementById('tareasFinalizadas');
  if (!contenedor) return;

  const finalizadas = tareas.filter(t => t.estado === 'Finalizada' && t.heroe === usuarioActivo);

  contenedor.innerHTML = finalizadas.length === 0
    ? '<p style="text-align: center;">No has finalizado tareas aún.</p>'
    : `
    <table>
      <thead>
        <tr><th>Título</th><th>Descripción</th><th>Tema</th><th>Fecha</th><th>Comentario</th></tr>
      </thead>
      <tbody>
        ${finalizadas.map(t => `
          <tr>
            <td>${t.titulo}</td>
            <td>${t.descripcion}</td>
            <td>${t.tema}</td>
            <td>${t.fecha}</td>
            <td>${t.comentarioHeroe || ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function verDetalle(index) {
  localStorage.setItem('tareaSeleccionada', JSON.stringify(tareas[index]));
  window.location.href = 'detalle-tarea.html';
}


// ---------- Inicializar las vistas dinámicas si existen ----------
mostrarTareasPublicadas();
mostrarTareasDisponibles();
mostrarAsignadas();
mostrarFinalizadas();
