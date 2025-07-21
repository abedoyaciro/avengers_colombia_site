console.log("Avengers Colombia - Sistema conectado al backend");
const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const sesion = obtenerSesion();
  if (sesion && sesion.rol === 'heroe') {
    window.correoHeroe = sesion.correo;
    window.idHeroe = sesion.idHeroe;
  }
});


// ------------------------
// SISTEMA DE NOTIFICACIONES
// ------------------------
function mostrarNotificacion(mensaje, tipo = 'info', callback = null) {
  const existente = document.querySelector('.notification-overlay');
  if (existente) existente.remove();

  const overlay = document.createElement('div');
  overlay.className = 'notification-overlay';

  const modal = document.createElement('div');
  modal.className = `notification-modal ${tipo === 'confirm' ? 'confirm-modal' : ''}`;

  const titulo = {
    error: '⚠️ Error',
    success: '✅ Éxito',
    confirm: '❓ Confirmación',
    info: '💡 Información'
  }[tipo] || '💬';

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

  if (tipo === 'confirm' && callback) window.notificationCallback = callback;
  if (['info', 'success'].includes(tipo)) {
    setTimeout(() => cerrarNotificacion(), 4000);
  }
}

function cerrarNotificacion(respuesta = null) {
  const overlay = document.querySelector('.notification-overlay');
  if (overlay) overlay.remove();
  if (typeof window.notificationCallback === 'function' && respuesta !== null) {
    window.notificationCallback(respuesta);
    window.notificationCallback = null;
  }
}

function mostrarError(msg) {
  mostrarNotificacion(msg, 'error');
}

function mostrarExito(msg) {
  mostrarNotificacion(msg, 'success');
}

function mostrarInfo(msg) {
  mostrarNotificacion(msg, 'info');
}

function confirmar(msg, callback) {
  mostrarNotificacion(msg, 'confirm', callback);
}

// ------------------------
// MANEJO DE SESIÓN
// ------------------------

function guardarSesion(data, rol) {
  sessionStorage.setItem('sesion', JSON.stringify({ ...data, rol }));
}

function obtenerSesion() {
  const sesion = JSON.parse(sessionStorage.getItem('sesion'));
  if (!sesion) return null;

  // 🛠 Normalizar id_heroe → idHeroe (opcional si aún usas en algún lado)
  if (sesion.rol === 'heroe' && sesion.id_heroe) {
    sesion.idHeroe = sesion.id_heroe;
  }

  return sesion;
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

// ------------------------
// LOGIN
// ------------------------

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // IDs actualizados y estandarizados
    const correo = document.getElementById('correo').value.trim();
    const contrasenha = document.getElementById('contrasenha').value;

    try {
      console.log("📡 Enviando login de usuario...");
      let res = await fetch(`${API_BASE}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasenha })
      });

      let data = await res.json();
      if (res.ok) {
        guardarSesion(data, 'usuario');
        mostrarExito(`Bienvenido ${data.nombre}`);
        setTimeout(() => window.location.href = 'mis-tareas.html', 1500);
        return;
      }

      console.log("📡 Enviando login de héroe...");
      res = await fetch(`${API_BASE}/heroes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasenha })
      });

      data = await res.json();
      if (res.ok) {
        guardarSesion(data, 'heroe');
        mostrarExito(`Bienvenido ${data.nombre}`);
        setTimeout(() => window.location.href = 'panel-heroe.html', 1500);
      } else {
        mostrarError('Correo o contraseña incorrectos.');
      }

    } catch (err) {
      console.error(err);
      mostrarError('Error al conectar con el servidor.');
    }
  });
}


// ------------------------
// REGISTRO
// ------------------------
const registroForm = document.getElementById('registroForm');
if (registroForm) {
  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rol = document.getElementById('rol').value;
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('email').value.trim();
    const contrasenha = document.getElementById('password').value;
    const ubicacion = document.getElementById('ubicacion')?.value;
    const especializacion = document.getElementById('especializacion')?.value;

    /*
    if (!/^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(contrasenha)) {
      mostrarError('La contraseña debe tener al menos 8 caracteres, un número y un símbolo especial.');
      return;
    } */

    try {
      let endpoint = '';
      let payload = {};

      if (rol === 'usuario') {
        endpoint = `${API_BASE}/usuarios`;
        payload = { nombre, correo, contrasenha, ubicacion };
      } else if (rol === 'heroe') {
        endpoint = `${API_BASE}/heroes`;
        payload = { nombre, correo, contrasenha, especializacion };
      } else {
        mostrarError('Debes seleccionar un rol válido.');
        return;
      }

      console.log("📡 Intentando registro con payload:", payload);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        mostrarExito('Registro exitoso. Redirigiendo a login...');
        setTimeout(() => window.location.href = 'login.html', 2000);
      } else {
        mostrarError(data.error || 'No se pudo completar el registro.');
      }

    } catch (err) {
      console.error(err);
      mostrarError('Error al conectar con el servidor.');
    }
  });
}
// ------------------------
// PUBLICACIÓN DE TAREAS
// ------------------------
const tareaForm = document.getElementById('tareaForm');
if (tareaForm) {
  tareaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const tema = document.getElementById('tema').value;
    const fecha = document.getElementById('fecha').value;

    if (!titulo || !descripcion || !tema || !fecha) {
      mostrarError('Todos los campos son obligatorios.');
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaIngresada = new Date(fecha);
    if (fechaIngresada < hoy) {
      mostrarError('La fecha no puede ser anterior a hoy.');
      return;
    }

    const sesion = obtenerSesion();
    if (!sesion || sesion.rol !== 'usuario') {
      mostrarError('Debes iniciar sesión para publicar tareas.');
      return;
    }

    const body = {
      titulo,
      descripcion,
      tema,
      fecha_deseada: fecha,
      id_usuario: sesion.id_usuario  // 
    };


    try {
      const res = await fetch(`${API_BASE}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        mostrarExito('Tarea publicada con éxito.');
        setTimeout(() => window.location.href = 'mis-tareas.html', 1500);
      } else {
        mostrarError(data.error || 'No se pudo publicar la tarea.');
      }

    } catch (err) {
      console.error(err);
      mostrarError('Error al conectar con el servidor.');
    }
  });
}
// -------------------------------
// MOSTRAR TAREAS DEL USUARIO
// -------------------------------
async function mostrarTareasPublicadas() {
  const contenedor = document.getElementById('taskList');
  if (!contenedor) return;

  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'usuario') {
    mostrarError('Debes iniciar sesión para ver tus tareas.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/usuarios/${sesion.id_usuario}/tareas`);
    const data = await res.json();

    if (!res.ok) {
      mostrarError(data.error || 'Error al obtener tus tareas.');
      return;
    }

    if (data.length === 0) {
      contenedor.innerHTML = '<p style="text-align: center;">No has publicado tareas aún.</p>';
      return;
    }

    contenedor.innerHTML = generarTablaTareas(data);

  } catch (err) {
    console.error(err);
    mostrarError('No se pudo conectar con el servidor.');
  }
}

function generarTablaTareas(tareas) {
  let tabla = `<table>
    <thead>
      <tr>
        <th>Título</th>
        <th>Descripción</th>
        <th>Tema</th>
        <th>Fecha Deseada</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>`;

  tareas.forEach(tarea => {
    tabla += `
      <tr>
        <td>${tarea.titulo}</td>
        <td>${tarea.descripcion}</td>
        <td>${tarea.tema}</td>
        <td>${tarea.fecha_deseada}</td>
        <td>${tarea.estado}</td>
        <td>
          ${tarea.estado === 'Sin Asignar' 
            ? `<button onclick="eliminarTareaBackend(${tarea.id_tarea})">Eliminar</button>`
            : tarea.estado === 'Finalizada'
              ? `<button onclick="verDetalle(${tarea.id_tarea})">Ver Detalles</button>`
              : ''}
        </td>
      </tr>`;
  });

  tabla += '</tbody></table>';
  return tabla;
}

function verDetalle(id) {
  sessionStorage.setItem('detalle_id', id);
  window.location.href = 'detalle-tarea.html';
}


async function eliminarTareaBackend(idTarea) {
  confirmar('¿Deseas eliminar esta tarea?', async (confirmado) => {
    if (!confirmado) return;

    try {
      const res = await fetch(`${API_BASE}/tareas/${idTarea}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok) {
        mostrarExito('Tarea eliminada con éxito.');
        mostrarTareasPublicadas();
      } else {
        mostrarError(data.error || 'Error al eliminar la tarea.');
      }

    } catch (err) {
      console.error(err);
      mostrarError('No se pudo conectar con el servidor.');
    }
  });
}
// -------------------------------
// MOSTRAR TAREAS DISPONIBLES PARA HÉROES
// -------------------------------
async function mostrarTareasDisponibles() {
  const contenedor = document.getElementById('listaTareas');
  if (!contenedor) return;

  try {
    const res = await fetch(`${API_BASE}/tareas/disponibles`);
    const data = await res.json();

    if (!res.ok) {
      mostrarError(data.error || 'Error al obtener tareas disponibles.');
      return;
    }

    if (data.length === 0) {
      contenedor.innerHTML = '<p>No hay tareas disponibles por ahora.</p>';
      return;
    }

    contenedor.innerHTML = data.map((tarea, i) => `
      <div class="task-item">
        <h3>${tarea.titulo}</h3>
        <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
        <p><strong>Tema:</strong> ${tarea.tema}</p>
        <p><strong>Fecha:</strong> ${tarea.fecha_deseada}</p>
        <button onclick="aceptarTarea(${tarea.id_tarea}, this)">Aceptar tarea</button>
      </div>
    `).join('');

  } catch (error) {
    console.error(error);
    mostrarError('No se pudo conectar con el servidor.');
  }
}

// -------------------------------
// ACEPTAR TAREA COMO HÉROE
// -------------------------------
async function aceptarTarea(idTarea, boton) {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError('Debes estar autenticado como héroe para aceptar tareas.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/${idTarea}/aceptar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_heroe: sesion.idHeroe })
    });

    const data = await res.json();
    if (res.ok) {
      mostrarExito('Tarea aceptada correctamente.');
      boton.disabled = true;
      boton.textContent = 'Tarea aceptada ✅';
      boton.style.backgroundColor = '#ccc';
      mostrarTareasDisponibles();
    } else {
      mostrarError(data.error || 'No se pudo aceptar la tarea.');
    }

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  }
}

// -------------------------------
// MOSTRAR TAREAS ASIGNADAS AL HÉROE
// -------------------------------
async function mostrarAsignadas() {
  const contenedor = document.getElementById('tareasAsignadas');
  if (!contenedor) return;

  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError('Debes iniciar sesión como héroe.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/asignadas?id_heroe=${sesion.idHeroe}`);
    const data = await res.json();

    if (!res.ok) {
      mostrarError(data.error || 'Error al obtener tareas asignadas.');
      return;
    }

    if (data.length === 0) {
      contenedor.innerHTML = '<p>No tienes tareas asignadas aún.</p>';
      return;
    }

    contenedor.innerHTML = data.map((tarea, i) => `
      <div class="task-item">
        <h3>${tarea.titulo}</h3>
        <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
        <p><strong>Tema:</strong> ${tarea.tema}</p>
        <p><strong>Fecha:</strong> ${tarea.fecha_deseada}</p>
        <textarea id="comentario-${i}" class="kanban-textarea" placeholder="Comentario del héroe..."></textarea>
        <button onclick="marcarFinalizada(${tarea.id_tarea}, ${i})">Marcar como Finalizada</button>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  }
}

// -------------------------------
// FINALIZAR TAREA (HÉROE)
// -------------------------------
async function marcarFinalizada(idTarea, i) {
  const comentario = document.getElementById(`comentario-${i}`).value.trim();
  const sesion = obtenerSesion();

  if (!comentario) {
    mostrarError('Debes escribir un comentario antes de finalizar la tarea.');
    return;
  }

  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError('No hay héroe autenticado.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/${idTarea}/finalizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comentario_heroe: comentario,
        id_heroe: sesion.idHeroe
      })
    });

    const data = await res.json();
    if (res.ok) {
      mostrarExito('Tarea finalizada correctamente.');
      mostrarAsignadas();
    } else {
      mostrarError(data.error || 'No se pudo finalizar la tarea.');
    }

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  }
}
// -------------------------------
// MOSTRAR TAREAS FINALIZADAS POR EL HÉROE
// -------------------------------
async function mostrarFinalizadas() {
  const contenedor = document.getElementById('tareasFinalizadas');
  if (!contenedor) return;

  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError('Debes iniciar sesión como héroe.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/finalizadas?id_heroe=${sesion.idHeroe}`);
    const data = await res.json();

    if (!res.ok) {
      mostrarError(data.error || 'Error al obtener tareas finalizadas.');
      return;
    }

    if (data.length === 0) {
      contenedor.innerHTML = '<p style="text-align: center;">No has finalizado tareas aún.</p>';
      return;
    }

    contenedor.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Tema</th>
            <th>Fecha</th>
            <th>Comentario del Héroe</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(t => `
            <tr>
              <td>${t.titulo}</td>
              <td>${t.descripcion}</td>
              <td>${t.tema}</td>
              <td>${t.fecha_deseada}</td>
              <td>${t.comentario_heroe || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  }
}

// -------------------------------
// MOSTRAR PANEL KANBAN
// -------------------------------
async function mostrarPanelKanban() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError('Debes iniciar sesión como héroe.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/kanban?id_heroe=${sesion.idHeroe}`);
    const data = await res.json();

    if (!res.ok) {
      mostrarError(data.error || 'Error al obtener tareas.');
      return;
    }

    renderizarColumnaKanban('columna-sin-asignar', data.sinAsignar || [], 'Sin Asignar');
    renderizarColumnaKanban('columna-asignadas', data.asignadas || [], 'Asignada');
    renderizarColumnaKanban('columna-finalizadas', data.finalizadas || [], 'Finalizada');

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  }
}

function renderizarColumnaKanban(idColumna, tareas, tipo) {
  const columna = document.getElementById(idColumna);
  if (!columna) return;

  if (tareas.length === 0) {
    columna.innerHTML = '<div class="kanban-empty">No hay tareas en esta categoría</div>';
    return;
  }

  // Mapear tipos a clases CSS
  const claseEstado = {
    'Sin Asignar': 'sin-asignar',
    'Asignada': 'asignada', 
    'Finalizada': 'finalizada'
  }[tipo] || '';

  columna.innerHTML = tareas.map((tarea, i) => {
    const base = `
      <div class="kanban-task ${claseEstado}">
        <h4>${tarea.titulo}</h4>
        <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
        <p><strong>Tema:</strong> ${tarea.tema}</p>
        <p><strong>Fecha:</strong> ${tarea.fecha_deseada}</p>`;

    if (tipo === 'Sin Asignar') {
      return base + `<button onclick="asignarTareaKanban('${tarea.titulo}')">Asignar</button></div>`;
    }

    if (tipo === 'Asignada') {
      return base + `
        <textarea id="comentario-${i}" class="kanban-textarea" placeholder="Comentario del héroe..."></textarea>
        <button onclick="finalizarTareaKanban('${tarea.titulo}', ${i})">Finalizar</button>
      </div>`;
    }

    if (tipo === 'Finalizada') {
      return base + `<p><strong>Comentario:</strong> ${tarea.comentario_heroe || ''}</p></div>`;
    }

    return base + '</div>';
  }).join('');
}

async function asignarTareaKanban(titulo) {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError('Debes iniciar sesión como héroe.');
    return;
  }

  // Agregar animación de movimiento
  const tarjeta = event.target.closest('.kanban-task');
  if (tarjeta) {
    tarjeta.classList.add('moving');
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/asignar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, id_heroe: sesion.idHeroe })
    });

    const data = await res.json();
    if (!res.ok) {
      mostrarError(data.error || 'No se pudo asignar la tarea');
      return;
    }

    mostrarExito('Tarea asignada exitosamente.');
    
    // Esperar un poco antes de actualizar para que se vea la animación
    setTimeout(() => {
      mostrarPanelKanban();
    }, 300);

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  } finally {
    // Remover animación después de un tiempo
    if (tarjeta) {
      setTimeout(() => {
        tarjeta.classList.remove('moving');
      }, 500);
    }
  }
}

async function finalizarTareaKanban(titulo, i) {
  const comentario = document.getElementById(`comentario-${i}`).value.trim();
  const sesion = obtenerSesion();

  if (!comentario) {
    mostrarError("Comentario obligatorio para finalizar.");
    return;
  }

  if (!sesion || sesion.rol !== 'heroe') {
    mostrarError("Debes estar autenticado como héroe.");
    return;
  }

  // Agregar animación de movimiento
  const tarjeta = event.target.closest('.kanban-task');
  if (tarjeta) {
    tarjeta.classList.add('moving');
  }

  try {
    const res = await fetch(`${API_BASE}/tareas/finalizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, comentario, id_heroe: sesion.idHeroe })
    });

    const data = await res.json();
    if (!res.ok) {
      mostrarError(data.error || 'No se pudo finalizar la tarea');
      return;
    }

    mostrarExito('Tarea finalizada correctamente.');
    
    // Esperar un poco antes de actualizar para que se vea la animación
    setTimeout(() => {
      mostrarPanelKanban();
    }, 300);

  } catch (err) {
    console.error(err);
    mostrarError('Error al conectar con el servidor.');
  } finally {
    // Remover animación después de un tiempo
    if (tarjeta) {
      setTimeout(() => {
        tarjeta.classList.remove('moving');
      }, 500);
    }
  }
}

// -------------------------------
// DETECCIÓN DE PÁGINA Y FUNCIONES
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('mis-tareas.html')) {
    mostrarTareasPublicadas();
  }

  if (path.includes('panel-heroe.html')) {
    mostrarTareasDisponibles();
    mostrarAsignadas();
    mostrarFinalizadas();
    mostrarPanelKanban();  // ✅ Agregado aquí
  }

  if (path.includes('kanban.html')) {
    mostrarPanelKanban();
  }
});

