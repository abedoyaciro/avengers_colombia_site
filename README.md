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

## 🚀 Configuración Rápida (Un Solo Comando)

### Windows
```cmd
setup.bat
```

### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

### Método Universal (Cualquier SO)
```bash
python setup.py
```

## 📋 Qué Hace el Setup Automático

✅ **Verifica requisitos** - Python, Node.js, MySQL  
✅ **Crea archivo .env** - Configuración de base de datos  
✅ **Configura usuario MySQL** - Usuario de desarrollo sin contraseña  
✅ **Instala dependencias** - npm install automático  
✅ **Configura base de datos** - Ejecuta scripts SQL  
✅ **Prueba conexión** - Verifica que todo funcione  

## 🎯 Inicio Rápido Después del Setup

1. **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend** (Terminal 2):
   ```bash
   python -m http.server 8000
   ```

3. **Abrir**: http://localhost:8000

## 🔑 Credenciales de Prueba

| Tipo | Email | Contraseña |
|------|-------|------------|
| Usuario | andrea@correo.com | 123abc! |
| Héroe | carlos@heroes.com | abc123! |

## 🛠️ Requisitos Previos

- **Python 3.6+** - [Descargar](https://python.org)
- **Node.js 14+** - [Descargar](https://nodejs.org)
- **MySQL 8.0+** - [Descargar](https://dev.mysql.com/downloads/)

## 📁 Estructura del Proyecto

```
avengers_colombia_site/
├── 🚀 setup.py          # Configuración automática
├── 🚀 setup.bat         # Script para Windows
├── 🚀 setup.sh          # Script para Unix/Linux/macOS
├── 🏠 index.html        # Página principal
├── 📁 frontend/         # Aplicación web
│   ├── login.html
│   ├── registro.html
│   ├── panel-heroe.html
│   └── style.css
├── 📁 backend/          # API REST
│   ├── index.js         # Servidor Express
│   ├── package.json     # Dependencias
│   ├── .env            # Configuración (creado automáticamente)
│   └── sql/
│       └── database.sql # Esquema de BD
└── 📁 docs/            # Documentación
```

## 🆘 Solución de Problemas

### MySQL no se conecta
```bash
# Reiniciar servicio MySQL
# Windows: net start mysql
# macOS: brew services restart mysql
# Linux: sudo systemctl restart mysql
```

### Puerto ocupado
```bash
# Cambiar puerto en backend/.env
PORT=3001
```

### Permisos de usuario
```sql
-- Ejecutar en MySQL como root
GRANT ALL PRIVILEGES ON avengers_colombia.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📞 Soporte

Si el setup automático falla:
1. Verifica que MySQL esté corriendo
2. Ejecuta `mysql -u root -p` para probar conexión
3. Revisa los logs en la consola
4. Contacta al equipo de desarrollo

---
🦸‍♂️ **¡Feliz desarrollo!** 🦸‍♀️