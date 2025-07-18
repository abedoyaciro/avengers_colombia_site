// --- Datos por defecto para desarrollo/demo ---
if (!localStorage.getItem('usuarios')) {
  localStorage.setItem('usuarios', JSON.stringify([
    { nombre: "Juan Pérez", email: "juan@correo.com", password: "Demo123!", ubicacion: "Bogotá", rol: "usuario" },
    { nombre: "Ana Torres", email: "ana@correo.com", password: "Demo123!", ubicacion: "Medellín", rol: "usuario" }
  ]));
}
if (!localStorage.getItem('heroes')) {
  localStorage.setItem('heroes', JSON.stringify([
    { nombre: "Capitán Colombia", email: "capitan@correo.com", password: "Heroe123!", especializacion: "Tecnología", rol: "heroe" },
    { nombre: "Doctora Paz", email: "paz@correo.com", password: "Heroe123!", especializacion: "Psicología", rol: "heroe" }
  ]));
}
if (!localStorage.getItem('tareas')) {
  localStorage.setItem('tareas', JSON.stringify([
    { titulo: "Ayuda con ensayo", descripcion: "Necesito ayuda con un ensayo de literatura.", tema: "Literatura", fecha: "2025-06-25", estado: "Sin Asignar" },
    { titulo: "Revisión de ortografía", descripcion: "Revisar ortografía de mi tarea.", tema: "Ortografía", fecha: "2025-06-26", estado: "Asignada", heroe: "capitan@correo.com" },
    { titulo: "Consejo psicológico", descripcion: "Busco orientación emocional.", tema: "Psicología", fecha: "2025-06-20", estado: "Finalizada", heroe: "paz@correo.com", comentarioHeroe: "¡Ánimo, sigue adelante!" }
  ]));
}

// Activación de la plataforma
console.log("Avengers Colombia - Plataforma activa");

// === SISTEMA DE NOTIFICACIONES PERSONALIZADO ===
function mostrarNotificacion(mensaje, tipo = 'info', callback = null) {
  // Remover notificación existente si hay alguna
  const existente = document.querySelector('.notification-overlay');
  if (existente) {
    existente.remove();
  }

  const overlay = document.createElement('div');
  overlay.className = 'notification-overlay';
  
  const modal = document.createElement('div');
  modal.className = `notification-modal ${tipo === 'confirm' ? 'confirm-modal' : ''}`;
  
  const titulo = tipo === 'error' ? '⚠️ Error' : 
                tipo === 'success' ? '✅ Éxito' : 
                tipo === 'confirm' ? '❓ Confirmación' : 
                '💡 Información';
  
  modal.innerHTML = `
    <h3>${titulo}</h3>
    <p>${mensaje}</p>
    <div class="notification-buttons">
      ${tipo === 'confirm' ? 
        `<button class="btn-secondary" onclick="cerrarNotificacion(false)">Cancelar</button>
         <button class="btn-primary" onclick="cerrarNotificacion(true)">Confirmar</button>` :
        `<button class="btn-primary" onclick="cerrarNotificacion()">Aceptar</button>`
      }
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Guardar callback para confirmaciones
  if (tipo === 'confirm' && callback) {
    window.notificationCallback = callback;
  }
  
  // Auto-cerrar después de 5 segundos para info/success
  if (tipo === 'info' || tipo === 'success') {
    setTimeout(() => {
      if (document.querySelector('.notification-overlay')) {
        cerrarNotificacion();
      }
    }, 5000);
  }
}

function cerrarNotificacion(resultado = null) {
  const overlay = document.querySelector('.notification-overlay');
  if (overlay) {
    overlay.remove();
  }
  
  // Ejecutar callback si es confirmación
  if (window.notificationCallback && resultado !== null) {
    window.notificationCallback(resultado);
    window.notificationCallback = null;
  }
}

// Funciones de conveniencia
function mostrarExito(mensaje) {
  mostrarNotificacion(mensaje, 'success');
}

function mostrarError(mensaje) {
  mostrarNotificacion(mensaje, 'error');
}

function mostrarInfo(mensaje) {
  mostrarNotificacion(mensaje, 'info');
}

function confirmar(mensaje, callback) {
  mostrarNotificacion(mensaje, 'confirm', callback);
}

const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
const usuarioActivo = localStorage.getItem('usuarioActivo');

document.addEventListener('DOMContentLoaded', () => {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const heroes = JSON.parse(localStorage.getItem('heroes')) || [];
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  const datos = [...usuarios, ...heroes].find(u => u.email === usuarioActivo);

  // Si hay un usuario activo, mostrar su información
  if (datos) {


    // Cambiar clase visual si es héroe
    if (datos.rol === 'heroe') {
      
      // Agregar clase especial al body
      document.body.classList.add('modo-heroe');

      // Agregar clase especial al <nav>
      const nav = document.querySelector('nav');
      if (nav) nav.classList.add('nav-heroe');  
      }
    
    // Cambiar el título del <h1> en el header
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
      headerTitle.textContent = datos.rol === 'heroe' ? 
        `Bienvenido, ${datos.nombre}. Eres un heroe!` :
        `Bienvenido, ${datos.nombre}`;
    }

    // Redirigir a la página correspondiente según el rol
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')) {
      datos.rol === 'heroe' ?
      window.location.href = 'frontend/panel-heroe.html' :
      window.location.href = 'frontend/mis-tareas.html';
    }

  }
});


// ---------- Función general para cerrar sesión ----------
function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../';
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
      mostrarExito('¡Bienvenido, ' + encontrado.nombre + '!');
      localStorage.setItem('usuarioActivo', encontrado.email);
      setTimeout(() => {
        window.location.href = encontrado.rol === 'heroe' ? 'panel-kanban.html' : 'mis-tareas.html';
      }, 1500);
    } else {
      mostrarError('Correo o contraseña incorrectos');
    }
  });
}

// ---------- Registro de usuario y héroe ----------
const registroFormUnico = document.getElementById('registroForm');
if (registroFormUnico) {
  registroFormUnico.addEventListener('submit', function (e) {
    e.preventDefault();

    const rol = document.getElementById('rol').value;
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const ubicacion = document.getElementById('ubicacion')?.value;
    const especializacion = document.getElementById('especializacion')?.value;

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      mostrarError('La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.');
      return;
    }

    if (rol === 'usuario') {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      if (usuarios.some(u => u.email === email)) {
        mostrarError('Este correo ya está registrado.');
        return;
      }
      usuarios.push({ nombre, email, password, ubicacion, rol });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    } else if (rol === 'heroe') {
      const heroes = JSON.parse(localStorage.getItem('heroes')) || [];
      if (heroes.some(h => h.email === email)) {
        mostrarError('Este correo ya está registrado.');
        return;
      }
      heroes.push({ nombre, email, password, especializacion, rol });
      localStorage.setItem('heroes', JSON.stringify(heroes));
    } else {
      mostrarError('Debes seleccionar un rol válido.');
      return;
    }

    mostrarExito('Registro exitoso. Ahora puedes iniciar sesión.');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  });
}



// // ---------- Registro de usuario ----------
// const registerUserForm = document.getElementById('registerUserForm');
// if (registerUserForm) {
//   registerUserForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     const nombre = document.getElementById('nombre').value;
//     const email = document.getElementById('email').value;
//     const ubicacion = document.getElementById('ubicacion').value;

//     const password = document.getElementById('password').value;
//     const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

//     if (!passwordRegex.test(password)) {
//       alert('La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.');
//       return;
//     }

//     const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

//     if (usuarios.some(u => u.email === email)) {
//       alert('Este correo ya está registrado.');
//       return;
//     }

//     usuarios.push({ nombre, email, password, ubicacion, rol: 'usuario' });
//     localStorage.setItem('usuarios', JSON.stringify(usuarios));

//     alert('Usuario registrado con éxito. Puedes iniciar sesión.');
//     window.location.href = 'login.html';
//   });
// }

// // ---------- Registro de héroe ----------
// const registerHeroForm = document.getElementById('registerHeroForm');
// if (registerHeroForm) {
//   registerHeroForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     const nombre = document.getElementById('nombre').value;
//     const email = document.getElementById('email').value;
//     const especializacion = document.getElementById('especializacion').value;
//     const password = document.getElementById('password').value;
//     const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

//     if (!passwordRegex.test(password)) {
//       alert('La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.');
//       return;
//     }

//     const heroes = JSON.parse(localStorage.getItem('heroes')) || [];

//     if (heroes.some(h => h.email === email)) {
//       alert('Este correo ya está registrado.');
//       return;
//     }

//     heroes.push({ nombre, email, password, especializacion, rol: 'heroe' });
//     localStorage.setItem('heroes', JSON.stringify(heroes));

//     alert('Héroe registrado con éxito. Puedes iniciar sesión.');
//     window.location.href = 'login.html';
//   });
// }

// ---------- Publicación de tareas ----------
const tareaForm = document.getElementById('tareaForm');
if (tareaForm) {
  tareaForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const tema = document.getElementById('tema').value;
    const fecha = document.getElementById('fecha').value;

    // Validar que la fecha no sea anterior a hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaIngresada = new Date(fecha);
    if (fechaIngresada < hoy) {
      mostrarError('La fecha no puede ser anterior a la actual.');
      return;
    }

    tareas.push({ titulo, descripcion, tema, fecha, estado: 'Sin Asignar' });
    localStorage.setItem('tareas', JSON.stringify(tareas));

    mostrarExito('Tarea publicada con éxito.');
    setTimeout(() => {
      window.location.href = 'mis-tareas.html';
    }, 1500);
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
  const especializaciones = [
    "Literatura",
    "Tecnología",
    "Psicología",
    "Ortografía",
    "Cultura ciudadana",
    "Historia",
    "Geografía",
    "Educación",
    "Humor educativo",
    "Otros"
  ];

  let tabla = `<table>
    <thead>
      <tr>
        <th>Título</th>
        <th>Descripción</th>
        <th>Especialización</th>
        <th>Fecha</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>`;

  tareas.forEach((tarea, index) => {
    const especializacionActual = tarea.especializacion || tarea.tema || "";

    let selectHtml = `<select ${tarea.estado !== 'Sin Asignar' ? 'disabled' : ''} required>`;
    selectHtml += `<option value="">Elegir...</option>`;
    especializaciones.forEach(opt => {
      selectHtml += `<option value="${opt}"${opt === especializacionActual ? ' selected' : ''}>${opt}</option>`;
    });
    selectHtml += `</select>`;

    // Solo permitir editar la fecha si la tarea NO está finalizada
    let fechaInput = tarea.estado === 'Finalizada'
      ? `<input type="date" value="${tarea.fecha}" disabled>`
      : `<input type="date" value="${tarea.fecha}" required>`;

    tabla += `
      <tr>
        <td contenteditable="${tarea.estado === 'Sin Asignar'}" data-required="true">${tarea.titulo}</td>
        <td contenteditable="${tarea.estado === 'Sin Asignar'}" data-required="true">${tarea.descripcion}</td>
        <td>${tarea.estado === 'Sin Asignar' ? selectHtml : especializacionActual}</td>
        <td>${fechaInput}</td>
        <td>${tarea.estado}</td>
        <td>
          ${tarea.estado === 'Sin Asignar'
            ? `
                <button onclick="guardarCambiosValidando(${index})">Guardar</button>
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

// Nueva función para validar campos antes de guardar
function guardarCambiosValidando(index) {
  const fila = document.querySelectorAll('tbody tr')[index];
  const celdas = fila.querySelectorAll('td');
  const select = fila.querySelector('select');
  const fechaInput = fila.querySelector('input[type="date"]');

  // Validar campos vacíos
  if (
    !celdas[0].innerText.trim() ||
    !celdas[1].innerText.trim() ||
    (select && !select.value) ||
    (fechaInput && !fechaInput.value)
  ) {
    mostrarError('Ningún campo puede quedar vacío.');
    return;
  }

  // Validar que la fecha no sea anterior a hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaIngresada = new Date(fechaInput.value);
  if (fechaIngresada < hoy) {
    mostrarError('La fecha no puede ser anterior a la actual.');
    return;
  }

  tareas[index] = {
    ...tareas[index],
    titulo: celdas[0].innerText.trim(),
    descripcion: celdas[1].innerText.trim(),
    especializacion: select ? select.value : tareas[index].especializacion,
    tema: select ? select.value : tareas[index].tema,
    fecha: fechaInput ? fechaInput.value : tareas[index].fecha
  };

  localStorage.setItem('tareas', JSON.stringify(tareas));
  mostrarExito('Cambios guardados exitosamente.');
  setTimeout(() => {
    mostrarTareasPublicadas();
  }, 1000);
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
  confirmar('¿Estás seguro de que deseas eliminar esta tarea?', (confirmado) => {
    if (confirmado) {
      tareas.splice(index, 1);
      localStorage.setItem('tareas', JSON.stringify(tareas));
      mostrarTareasPublicadas();
      mostrarExito('Tarea eliminada exitosamente.');
    }
  });
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
    mostrarError('Debes escribir un comentario antes de finalizar la tarea.');
    return;
  }

  const index = tareas.findIndex(t => t.titulo === titulo && t.estado === 'Asignada' && t.heroe === usuarioActivo);
  if (index !== -1) {
    tareas[index].estado = 'Finalizada';
    tareas[index].comentarioHeroe = comentario;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarAsignadas();
    mostrarExito('Tarea marcada como finalizada exitosamente.');
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

// ---------- Mostrar panel Kanban ----------
function mostrarPanelKanban() {
  const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  const usuarioActivo = localStorage.getItem('usuarioActivo');

  const sinAsignar = tareas.filter(t => t.estado === 'Sin Asignar');
  const asignadas = tareas.filter(t => t.estado === 'Asignada' && t.heroe === usuarioActivo);
  const finalizadas = tareas.filter(t => t.estado === 'Finalizada' && t.heroe === usuarioActivo);

  renderizarColumna('columna-sin-asignar', sinAsignar, 'sinAsignar');
  renderizarColumna('columna-asignadas', asignadas, 'asignada');
  renderizarColumna('columna-finalizadas', finalizadas, 'finalizada');
}

// ---------- Renderizar columnas del Kanban ----------
function renderizarColumna(idContenedor, lista, tipo) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  if (lista.length === 0) {
    contenedor.innerHTML = `<div class="kanban-empty">No hay tareas en esta columna.</div>`;
    return;
  }

  contenedor.innerHTML = lista.map((t, i) => `
    <div class="kanban-task">
      <h5>${t.titulo}</h5>
      <p><strong>Descripción:</strong> ${t.descripcion}</p>
      <p><strong>Tema:</strong> ${t.tema}</p>
      <p><strong>Fecha:</strong> ${t.fecha}</p>
      ${tipo === 'sinAsignar' ? `<button onclick="asignarTareaKanban('${t.titulo}')">Aceptar Tarea</button>` : ''}
      ${tipo === 'asignada' ? `
        <textarea id="comentario-${i}" placeholder="Comentario del héroe..." class="kanban-textarea"></textarea>
        <button onclick="finalizarTareaKanban('${t.titulo}', ${i})" class="btn-finalizar">Finalizar Tarea</button>
      ` : ''}
      ${tipo === 'finalizada' ? `<div class="hero-comment-box">${t.comentarioHeroe || 'Sin comentario'}</div>` : ''}
    </div>
  `).join('');
}

// ---------- Asignar tarea en Kanban ----------
function asignarTareaKanban(titulo) {
  const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  const i = tareas.findIndex(t => t.titulo === titulo && t.estado === 'Sin Asignar');
  if (i !== -1) {
    tareas[i].estado = 'Asignada';
    tareas[i].heroe = usuarioActivo;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarPanelKanban();
  }
}

// ---------- Finalizar tarea en Kanban ----------
function finalizarTareaKanban(titulo, i) {
  const comentario = document.getElementById(`comentario-${i}`).value.trim();
  if (!comentario) {
    mostrarError("Por favor escribe un comentario antes de finalizar la tarea.");
    return;
  }
  const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  const idx = tareas.findIndex(t => t.titulo === titulo && t.heroe === usuarioActivo && t.estado === 'Asignada');
  if (idx !== -1) {
    tareas[idx].estado = 'Finalizada';
    tareas[idx].comentarioHeroe = comentario;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarPanelKanban();
    mostrarExito('Tarea finalizada exitosamente.');
  }
}

// ---------- Inicializar el panel Kanban si existe ----------
const panelKanban = document.getElementById('panelKanban');
if (panelKanban) {
  mostrarPanelKanban();
}



// ---------- Inicializar las vistas dinámicas si existen ----------
mostrarTareasPublicadas();
mostrarTareasDisponibles();
mostrarAsignadas();
mostrarFinalizadas();
