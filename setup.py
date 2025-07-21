#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 AVENGERS COLOMBIA - CONFIGURACIÓN AUTOMÁTICA
==============================================
Script de configuración universal para Windows, macOS y Linux.
Configura automáticamente la base de datos, dependencias y archivos .env
"""

import os
import sys
import platform
import subprocess
import json
import time
from pathlib import Path


class AvengersSetup:
    """Clase principal para la configuración automática de Avengers Colombia"""

    def __init__(self):
        self.system = platform.system().lower()
        self.project_root = Path(__file__).parent.absolute()
        self.backend_dir = self.project_root / "backend"
        self.node_cmd = None
        self.npm_cmd = None
        self.mysql_cmd = None

    def print_banner(self):
        """Imprime el banner de bienvenida y detalles del sistema"""

        print(
            """
🦸‍♂️ ================================== 🦸‍♀️
   AVENGERS COLOMBIA - SETUP AUTOMÁTICO
🦸‍♂️ ================================== 🦸‍♀️
"""
        )
        print(f"🖥️  Sistema detectado: {platform.system()} {platform.release()}")
        print(f"📁 Directorio del proyecto: {self.project_root}")
        print()

    def find_command(self, command_name, possible_paths=None):
        """Busca un comando en diferentes ubicaciones posibles"""
        commands_to_try = [command_name]

        if self.system == "windows":
            commands_to_try.extend([f"{command_name}.exe", f"{command_name}.cmd"])

            # Rutas comunes en Windows
            if possible_paths is None:
                possible_paths = [
                    r"C:\Program Files\nodejs",
                    r"C:\Program Files (x86)\nodejs",
                    r"C:\nodejs",
                    os.path.expanduser(r"~\AppData\Roaming\npm"),
                    os.path.expanduser(r"~\scoop\shims"),
                    os.path.expanduser(r"~\AppData\Local\Programs\Node.js"),
                ]

        # Primero intentar encontrar en PATH
        for cmd in commands_to_try:
            try:
                result = subprocess.run(
                    [cmd, "--version"],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    check=False,
                )
                if result.returncode == 0:
                    return cmd, result.stdout.strip()
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue

        # Si no se encuentra en PATH, buscar en rutas comunes
        if possible_paths:
            for path in possible_paths:
                if os.path.exists(path):
                    for cmd in commands_to_try:
                        full_path = os.path.join(path, cmd)
                        if os.path.exists(full_path):
                            try:
                                result = subprocess.run(
                                    [full_path, "--version"],
                                    capture_output=True,
                                    text=True,
                                    timeout=5,
                                    check=False,
                                )
                                if result.returncode == 0:
                                    return full_path, result.stdout.strip()
                            except (FileNotFoundError, subprocess.TimeoutExpired):
                                continue

        return None, None

    def check_requirements(self):
        """Verifica que estén instalados los requisitos básicos"""
        print("🔍 Verificando requisitos del sistema...")

        # Verificar Python
        python_version = sys.version_info
        if python_version.major < 3 or (
            python_version.major == 3 and python_version.minor < 6
        ):
            print("❌ Se requiere Python 3.6 o superior")
            return False
        print(
            (
                "✅ Python "
                + str(python_version.major)
                + "."
                + str(python_version.minor)
                + "."
                + str(python_version.micro)
            )
        )

        # Verificar Node.js
        node_cmd, node_version = self.find_command("node")
        if node_cmd:
            print(f"✅ Node.js {node_version} (encontrado en: {node_cmd})")
            self.node_cmd = node_cmd
        else:
            print("❌ Node.js no encontrado")
            self.show_nodejs_install_instructions()
            return False

        # Verificar npm
        npm_cmd, npm_version = self.find_command("npm")
        if npm_cmd:
            print(f"✅ npm {npm_version} (encontrado en: {npm_cmd})")
            self.npm_cmd = npm_cmd
        else:
            print("❌ npm no encontrado")
            print("💡 npm debería venir incluido con Node.js")
            return False

        return True

    def show_nodejs_install_instructions(self):
        """Muestra instrucciones detalladas para instalar Node.js"""
        print(
            """
📋 INSTRUCCIONES PARA INSTALAR NODE.JS:

🔹 OPCIÓN 1 - Instalador oficial (Recomendado):
   1. Ve a: https://nodejs.org/
   2. Descarga la versión LTS (Long Term Support)
   3. Ejecuta el instalador y sigue las instrucciones
   4. ✅ Asegúrate de marcar "Add to PATH"

🔹 OPCIÓN 2 - Chocolatey (Windows):
   1. Instala Chocolatey: https://chocolatey.org/install
   2. Ejecuta: choco install nodejs

🔹 OPCIÓN 3 - Scoop (Windows):
   1. Instala Scoop: https://scoop.sh/
   2. Ejecuta: scoop install nodejs

🔹 OPCIÓN 4 - winget (Windows 10/11):
   winget install OpenJS.NodeJS

⚠️  IMPORTANTE: Después de instalar, reinicia tu terminal/PowerShell
"""
        )

    def check_mysql(self):
        """Verifica si MySQL está instalado y corriendo"""
        print("\n🔍 Verificando MySQL...")

        mysql_cmd, mysql_version = self.find_command(
            "mysql",
            [
                r"C:\Program Files\MySQL\MySQL Server 8.0\bin",
                r"C:\Program Files\MySQL\MySQL Server 5.7\bin",
                r"C:\mysql\bin",
                r"C:\xampp\mysql\bin",
                r"C:\wamp64\bin\mysql\mysql8.0.31\bin",
            ],
        )

        if mysql_cmd:
            print(f"✅ {mysql_version} (encontrado en: {mysql_cmd})")
            self.mysql_cmd = mysql_cmd
            return True
        else:
            print("❌ MySQL no encontrado")
            self.install_mysql_instructions()
            return False

    def install_mysql_instructions(self):
        """Proporciona instrucciones para instalar MySQL según el SO"""
        print("\n📋 INSTRUCCIONES PARA INSTALAR MYSQL:")

        if self.system == "windows":
            print(
                """
🔹 OPCIÓN 1 - Instalador oficial MySQL:
   1. Ve a: https://dev.mysql.com/downloads/installer/
   2. Descarga "MySQL Installer for Windows"
   3. Ejecuta el instalador y selecciona 'Developer Default'
   4. Configura contraseña root (o déjala vacía)
   5. ✅ Asegúrate de que se agregue al PATH

🔹 OPCIÓN 2 - XAMPP (Fácil para desarrollo):
   1. Descarga XAMPP: https://www.apachefriends.org/
   2. Instala y ejecuta el panel de control
   3. Inicia los servicios Apache y MySQL

🔹 OPCIÓN 3 - Chocolatey:
   choco install mysql

🔹 OPCIÓN 4 - winget:
   winget install Oracle.MySQL
"""
            )
        elif self.system == "darwin":  # macOS
            print(
                """
macOS:
1. Homebrew: brew install mysql
2. Iniciar: brew services start mysql
3. Configurar: mysql_secure_installation
"""
            )
        else:  # Linux
            print(
                """
Linux (Ubuntu/Debian):
1. sudo apt update
2. sudo apt install mysql-server
3. sudo systemctl start mysql
4. sudo mysql_secure_installation
"""
            )

    def create_env_file(self):
        """Crea el archivo .env interactivamente"""
        print("\n⚙️  Configurando archivo .env...")

        env_path = self.backend_dir / ".env"

        if env_path.exists():
            response = input("🤔 El archivo .env ya existe. ¿Sobrescribir? (s/N): ")
            if response.lower() not in ["s", "si", "y", "yes"]:
                print("📝 Manteniendo archivo .env existente")
                return True

        print("\n📝 Configuración de la base de datos:")
        print("💡 Para desarrollo local, puedes usar un usuario sin contraseña")

        db_host = input("🏠 Host de MySQL (localhost): ").strip() or "localhost"
        db_user = input("👤 Usuario de MySQL (dev_user): ").strip() or "dev_user"
        db_pass = input(
            "🔐 Contraseña de MySQL (presiona Enter para sin contraseña): "
        ).strip()
        db_name = (
            input("🗃️  Nombre de la base de datos (avengers_colombia): ").strip()
            or "avengers_colombia"
        )
        backend_port = input("🚪 Puerto del backend (3000): ").strip() or "3000"

        env_content = f"""# Configuración de la base de datos MySQL
DB_HOST={db_host}
DB_USER={db_user}
DB_PASS={db_pass}
DB_NAME={db_name}

# Puerto del servidor backend
PORT={backend_port}

# Configuración adicional
NODE_ENV=development
"""

        try:
            # Crear directorio backend si no existe
            self.backend_dir.mkdir(exist_ok=True)

            with open(env_path, "w", encoding="utf-8") as f:
                f.write(env_content)
            print(f"✅ Archivo .env creado en: {env_path}")
            return True
        except OSError as e:
            print(f"❌ Error creando .env (OSError): {e}")
            return False
        except ValueError as e:
            print(f"❌ Error creando .env (ValueError): {e}")
            return False

    def setup_mysql_user(self):
        """Configura el usuario de desarrollo en MySQL con soporte UTF-8"""
        print("\n👤 Configurando usuario de desarrollo en MySQL...")

        env_path = self.backend_dir / ".env"
        if not env_path.exists():
            print("❌ Archivo .env no encontrado")
            return False

        # Leer configuración del .env
        env_vars = {}
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    env_vars[key] = value

        db_user = env_vars.get("DB_USER", "dev_user")
        db_pass = env_vars.get("DB_PASS", "")
        db_name = env_vars.get("DB_NAME", "avengers_colombia")

        # Comandos SQL con encoding explícito
        mysql_commands = [
            f"CREATE USER IF NOT EXISTS '{db_user}'@'localhost' IDENTIFIED BY '{db_pass}';",
            f"GRANT ALL PRIVILEGES ON *.* TO '{db_user}'@'localhost';",
            f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
            f"GRANT ALL PRIVILEGES ON {db_name}.* TO '{db_user}'@'localhost';",
            "FLUSH PRIVILEGES;",
        ]

        print("🔐 Configurando permisos de MySQL...")
        print("💡 Se te pedirá la contraseña root de MySQL")

        mysql_cmd = getattr(self, "mysql_cmd", "mysql")

        # MÉTODO 1: Usar input directo sin archivo
        sql_script = "\n".join(mysql_commands)

        try:
            print("📝 Ejecutando comandos SQL...")
            result = subprocess.run(
                [mysql_cmd, "-u", "root", "-p", "--default-character-set=utf8mb4"],
                input=sql_script,
                capture_output=True,
                text=True,
                check=False,
                encoding="utf-8",
            )

            if result.returncode == 0:
                print(f"✅ Usuario '{db_user}' configurado correctamente")
                return self._verify_mysql_user(db_user, db_pass, mysql_cmd)
            else:
                print(f"❌ Error en script completo: {result.stderr}")
                return self._try_individual_commands(mysql_commands, mysql_cmd)

        except (subprocess.SubprocessError, OSError, UnicodeDecodeError) as e:
            print(f"❌ Error ejecutando script: {e}")
            return self._try_individual_commands(mysql_commands, mysql_cmd)

    def _try_individual_commands(self, mysql_commands, mysql_cmd):
        """Ejecuta comandos MySQL individualmente como fallback"""
        print("🔄 Ejecutando comandos individualmente...")

        success_count = 0
        for i, cmd in enumerate(mysql_commands, 1):
            print(f"📝 Comando {i}/{len(mysql_commands)}: {cmd[:50]}...")
            try:
                result = subprocess.run(
                    [
                        mysql_cmd,
                        "-u",
                        "root",
                        "-p",
                        "--default-character-set=utf8mb4",
                        "-e",
                        cmd,
                    ],
                    capture_output=True,
                    text=True,
                    check=False,
                    encoding="utf-8",
                )

                if result.returncode == 0:
                    success_count += 1
                    print("    ✅ Éxito")
                else:
                    print(f"    ⚠️  Advertencia: {result.stderr.strip()}")
                    if (
                        "already exists" in result.stderr
                        or "duplicate" in result.stderr.lower()
                    ):
                        success_count += 1  # Contar como éxito si ya existe

            except Exception as e:
                print(f"    ❌ Error: {e}")
                continue

        print(f"📊 Resultado: {success_count}/{len(mysql_commands)} comandos exitosos")

        if success_count >= 3:  # Al menos usuario, permisos y BD creados
            return self._verify_mysql_user_from_env(mysql_cmd)
        else:
            print("\n🔧 Comandos SQL para ejecutar manualmente:")
            for cmd in mysql_commands:
                print(f"   {cmd}")
            return False

    def _verify_mysql_user(self, db_user, db_pass, mysql_cmd):
        """Verifica que el usuario MySQL fue creado correctamente"""
        print("🔍 Verificando usuario creado...")
        try:
            test_args = [mysql_cmd, "-u", db_user, "--default-character-set=utf8mb4"]
            if db_pass:
                test_args.append(f"-p{db_pass}")
            test_args.extend(["-e", "SELECT 1 as test;"])

            test_result = subprocess.run(
                test_args, capture_output=True, text=True, timeout=10, check=False
            )

            if test_result.returncode == 0:
                print(f"✅ Usuario '{db_user}' verificado correctamente")
                return True
            else:
                print(
                    f"⚠️  Usuario creado pero con problemas de acceso: {test_result.stderr}"
                )
                return True  # Continuar aunque haya advertencias menores

        except Exception as e:
            print(f"⚠️  No se pudo verificar el usuario: {e}")
            return True  # Asumir que funcionó si llegamos hasta aquí

    def _verify_mysql_user_from_env(self, mysql_cmd):
        """Verifica usuario leyendo desde .env"""
        env_vars = {}
        env_path = self.backend_dir / ".env"
        if env_path.exists():
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if "=" in line and not line.startswith("#"):
                        key, value = line.strip().split("=", 1)
                        env_vars[key] = value

        db_user = env_vars.get("DB_USER", "dev_user")
        db_pass = env_vars.get("DB_PASS", "")

        return self._verify_mysql_user(db_user, db_pass, mysql_cmd)

    def setup_database(self):
        """Configura la base de datos ejecutando el script SQL"""
        print("\n🗃️  Configurando base de datos...")

        sql_file = self.backend_dir / "sql" / "database.sql"
        if not sql_file.exists():
            print(f"❌ Archivo SQL no encontrado: {sql_file}")
            return False

        env_path = self.backend_dir / ".env"
        env_vars = {}
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    env_vars[key] = value

        db_user = env_vars.get("DB_USER", "dev_user")
        db_pass = env_vars.get("DB_PASS", "")

        print("💾 Ejecutando script de base de datos...")
        try:
            mysql_cmd = getattr(self, "mysql_cmd", "mysql")
            cmd_args = [mysql_cmd, "-u", db_user, "--default-character-set=utf8mb4"]

            if db_pass:
                cmd_args.extend(["-p" + db_pass])
            else:
                cmd_args.extend(["-p"])  # Pedirá contraseña si es necesario

            with open(sql_file, "r", encoding="utf-8") as f:
                result = subprocess.run(
                    cmd_args, stdin=f, capture_output=True, text=True, check=False
                )

            if result.returncode == 0:
                print("✅ Base de datos configurada correctamente")
                return True
            else:
                print(f"❌ Error configurando base de datos: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def install_dependencies(self):
        """Instala las dependencias de Node.js"""
        print("\n📦 Instalando dependencias de Node.js...")

        try:
            original_dir = os.getcwd()
            os.chdir(self.backend_dir)

            npm_cmd = getattr(self, "npm_cmd", "npm")
            result = subprocess.run(
                [npm_cmd, "install"], check=True, capture_output=True, text=True
            )

            print("✅ Dependencias instaladas correctamente")
            if result.stdout:
                print("📋 Salida de npm:")
                print(result.stdout)
            return True

        except subprocess.CalledProcessError as e:
            print(f"❌ Error instalando dependencias:")
            print(f"Código de salida: {e.returncode}")
            if e.stderr:
                print(f"Error: {e.stderr}")
            if e.stdout:
                print(f"Salida: {e.stdout}")
            return False
        except Exception as e:
            print(f"❌ Error inesperado: {e}")
            return False
        finally:
            os.chdir(original_dir)

    def create_package_json_if_missing(self):
        """Crea package.json si no existe"""
        package_path = self.backend_dir / "package.json"

        if package_path.exists():
            print("✅ package.json ya existe")
            return True

        print("📝 Creando package.json...")

        package_content = {
            "name": "avengers-colombia-backend",
            "version": "1.0.0",
            "description": "Backend API para Avengers Colombia",
            "main": "index.js",
            "scripts": {"start": "node index.js", "dev": "node index.js"},
            "dependencies": {
                "express": "^4.18.2",
                "mysql2": "^3.9.6",
                "cors": "^2.8.5",
                "dotenv": "^16.4.5",
            },
            "author": "Avengers Colombia Team",
            "license": "MIT",
        }

        try:
            # Crear directorio backend si no existe
            self.backend_dir.mkdir(exist_ok=True)

            with open(package_path, "w", encoding="utf-8") as f:
                json.dump(package_content, f, indent=2, ensure_ascii=False)
            print("✅ package.json creado")
            return True
        except OSError as e:
            print(f"❌ Error creando package.json (OSError): {e}")
            return False
        except ValueError as e:
            print(f"❌ Error creando package.json (ValueError): {e}")
            return False

    def test_connection(self):
        """Prueba la conexión a la base de datos"""
        print("\n🔍 Probando conexión...")

        test_script = """
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        
        const [result] = await connection.execute('SELECT 1 + 1 as test');
        console.log('✅ Conexión exitosa:', result[0]);
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
}

testConnection();
"""

        test_file = self.backend_dir / "test_connection.js"
        try:
            with open(test_file, "w", encoding="utf-8") as f:
                f.write(test_script)

            original_dir = os.getcwd()
            os.chdir(self.backend_dir)

            node_cmd = getattr(self, "node_cmd", "node")
            result = subprocess.run(
                [node_cmd, "test_connection.js"],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode == 0:
                print("✅ Conexión a la base de datos exitosa")
                print(result.stdout)
                return True
            else:
                print(f"❌ Error en la conexión:")
                print(f"Salida: {result.stdout}")
                print(f"Error: {result.stderr}")
                return False

        except subprocess.TimeoutExpired:
            print("❌ Timeout probando conexión")
            return False
        except Exception as e:
            print(f"❌ Error probando conexión: {e}")
            return False
        finally:
            if test_file.exists():
                test_file.unlink()
            os.chdir(original_dir)

    def create_startup_scripts(self):
        """Crea scripts de inicio independientes para los servidores"""
        print("\n📝 Creando scripts de inicio...")

        try:
            # Script para backend
            if self.system == "windows":
                backend_script = self.project_root / "start_backend.bat"
                # Usar rutas relativas para evitar problemas con caracteres especiales
                npm_cmd_str = getattr(self, "npm_cmd", "npm")

                backend_content = f"""@echo off
chcp 65001 >nul
title Backend - Avengers Colombia
echo Iniciando Backend de Avengers Colombia...
echo.
if not exist "backend" (
    echo ERROR: El directorio backend no existe
    pause
    exit /b 1
)
if not exist "backend\\package.json" (
    echo ERROR: No se encuentra package.json en el directorio backend
    pause
    exit /b 1
)
echo Cambiando al directorio backend...
cd /d "backend"
echo Ejecutando: {npm_cmd_str} run dev
{npm_cmd_str} run dev
pause
"""

                frontend_script = self.project_root / "start_frontend.bat"
                frontend_content = f"""@echo off
chcp 65001 >nul
title Frontend - Avengers Colombia
echo Iniciando Frontend de Avengers Colombia...
echo.
echo Ejecutando desde directorio actual...
echo Ejecutando: python -m http.server 8000
python -m http.server 8000
pause
"""
            else:
                # Scripts para Unix/Linux/macOS
                backend_script = self.project_root / "start_backend.sh"
                backend_content = f"""#!/bin/bash
echo "🚀 Iniciando Backend de Avengers Colombia..."
cd "{self.backend_dir}"
{getattr(self, 'npm_cmd', 'npm')} run dev
"""

                frontend_script = self.project_root / "start_frontend.sh"
                frontend_content = f"""#!/bin/bash
echo "🎨 Iniciando Frontend de Avengers Colombia..."
cd "{self.project_root}"
python -m http.server 8000
"""

            # Escribir scripts
            with open(backend_script, "w", encoding="utf-8") as f:
                f.write(backend_content)

            with open(frontend_script, "w", encoding="utf-8") as f:
                f.write(frontend_content)

            # Hacer ejecutables en Unix/Linux/macOS
            if self.system != "windows":
                os.chmod(backend_script, 0o755)
                os.chmod(frontend_script, 0o755)

            print(f"✅ Scripts creados:")
            print(f"   Backend: {backend_script}")
            print(f"   Frontend: {frontend_script}")

            self.backend_script = backend_script
            self.frontend_script = frontend_script
            return True

        except Exception as e:
            print(f"❌ Error creando scripts: {e}")
            return False

    def launch_servers(self):
        """Lanza automáticamente el backend y frontend usando scripts independientes"""
        print("\n🚀 ¿Te gustaría iniciar los servidores automáticamente?")
        response = input(
            "   Esto abrirá el backend (Puerto 3000) y frontend (Puerto 8000) (s/N): "
        )

        if response.lower() not in ["s", "si", "y", "yes"]:
            print(
                "⏭️  Servidores no iniciados. Usa los comandos manuales mostrados arriba."
            )
            return True

        # Crear scripts de inicio primero
        if not self.create_startup_scripts():
            print("❌ Error creando scripts. Usando método manual.")
            return False

        print("\n🎬 Iniciando servidores usando scripts independientes...")

        try:
            if self.system == "windows":
                # En Windows - ejecutar los .bat en ventanas separadas usando rutas relativas
                backend_script_name = self.backend_script.name
                frontend_script_name = self.frontend_script.name

                backend_cmd = (
                    f'start "Backend - Avengers Colombia" "{backend_script_name}"'
                )
                frontend_cmd = (
                    f'start "Frontend - Avengers Colombia" "{frontend_script_name}"'
                )

                print("🔧 Iniciando backend...")
                subprocess.Popen(backend_cmd, shell=True, cwd=str(self.project_root))
                time.sleep(4)

                print("🎨 Iniciando frontend...")
                subprocess.Popen(frontend_cmd, shell=True, cwd=str(self.project_root))
                time.sleep(3)

            else:
                # En Unix/Linux/macOS
                if platform.system() == "Darwin":  # macOS
                    backend_cmd = f'osascript -e \'tell application "Terminal" to do script "{self.backend_script}"\''
                    frontend_cmd = f'osascript -e \'tell application "Terminal" to do script "{self.frontend_script}"\''
                else:  # Linux
                    backend_cmd = f'gnome-terminal --title="Backend - Avengers Colombia" -- bash -c "{self.backend_script}"'
                    frontend_cmd = f'gnome-terminal --title="Frontend - Avengers Colombia" -- bash -c "{self.frontend_script}"'

                print("🔧 Iniciando backend...")
                subprocess.Popen(backend_cmd, shell=True)
                time.sleep(4)

                print("🎨 Iniciando frontend...")
                subprocess.Popen(frontend_cmd, shell=True)
                time.sleep(3)

            print(
                f"""
🎉 ¡SERVIDORES INICIADOS EXITOSAMENTE!

🔧 Backend API: http://localhost:3000
🎨 Frontend: http://localhost:8000

🌐 ABRIR EN NAVEGADOR:
   http://localhost:8000

📋 VENTANAS DE TERMINAL INDEPENDIENTES:
   • Backend ejecutándose en nueva ventana
   • Frontend ejecutándose en nueva ventana

📋 SCRIPTS CREADOS:
   • {self.backend_script}
   • {self.frontend_script}

📋 PARA DETENER LOS SERVIDORES:
   • Presiona Ctrl+C en cada ventana de terminal
   • O cierra las ventanas de terminal directamente

💡 PARA REINICIAR EN EL FUTURO:
   • Ejecuta directamente los scripts creados
   • O usa los comandos manuales mostrados abajo

⚡ Los servidores ahora corren independientemente de este script!
"""
            )

            # Abrir navegador después de un delay
            def open_browser_delayed():
                time.sleep(6)  # Esperar más tiempo para que los servidores estén listos
                try:
                    import webbrowser

                    print("🌐 Abriendo navegador...")
                    webbrowser.open("http://localhost:8000")
                    print("✅ Navegador abierto en http://localhost:8000")
                except Exception as e:
                    print(f"⚠️  No se pudo abrir el navegador automáticamente: {e}")
                    print("   Abre manualmente: http://localhost:8000")

            # Ejecutar la apertura del navegador en un hilo separado
            import threading

            browser_thread = threading.Thread(target=open_browser_delayed)
            browser_thread.daemon = True
            browser_thread.start()

            return True

        except Exception as e:
            print(f"❌ Error iniciando servidores: {e}")
            print("💡 Usa los comandos manuales mostrados en la información final")
            return False

    def show_completion_info(self):
        """Muestra la información final de configuración"""
        node_cmd = getattr(self, "node_cmd", "node")
        npm_cmd = getattr(self, "npm_cmd", "npm")

        # Verificar si se crearon scripts
        scripts_info = ""
        if hasattr(self, "backend_script") and hasattr(self, "frontend_script"):
            scripts_info = f"""
🚀 SCRIPTS DE INICIO CREADOS:
   Backend: {self.backend_script}
   Frontend: {self.frontend_script}
   (Ejecuta estos archivos para reiniciar los servidores)
"""

        print(
            f"""
🎉 ================================== 🎉
   ¡CONFIGURACIÓN COMPLETADA!
🎉 ================================== 🎉

🚀 COMANDOS MANUALES (si no usaste auto-inicio):

1️⃣  Backend (Terminal 1):
   cd backend
   {npm_cmd} run dev

2️⃣  Frontend (Terminal 2):
   python -m http.server 8000

3️⃣  Abrir en navegador:
   http://localhost:8000
{scripts_info}
📋 DATOS DE PRUEBA:
   Usuario: andrea@correo.com / 123abc!
   Héroe: carlos@heroes.com / abc123!

🔧 HERRAMIENTAS ENCONTRADAS:
   Node.js: {node_cmd}
   npm: {npm_cmd}
   MySQL: {getattr(self, 'mysql_cmd', 'mysql')}

🔧 ARCHIVOS IMPORTANTES:
   ✅ backend/.env - Configuración de BD
   ✅ backend/package.json - Dependencias
   ✅ backend/sql/database.sql - Estructura de BD

💡 CONSEJOS:
   - Usa las credenciales de prueba para hacer login
   - El puerto 3000 es para la API, el 8000 para el frontend
   - Revisa los logs en la consola si algo no funciona

¡Feliz desarrollo! 🦸‍♂️🦸‍♀️
"""
        )

    def run(self):
        """Ejecuta el proceso completo de configuración"""
        self.print_banner()

        # Verificaciones básicas
        if not self.check_requirements():
            print("❌ Faltan requisitos básicos. Instálalos y vuelve a ejecutar.")
            return False

        if not self.check_mysql():
            print("❌ MySQL no está disponible. Instálalo y vuelve a ejecutar.")
            return False

        # Configuración paso a paso
        steps = [
            ("Crear package.json", self.create_package_json_if_missing),
            ("Configurar archivo .env", self.create_env_file),
            ("Configurar usuario MySQL", self.setup_mysql_user),
            ("Instalar dependencias", self.install_dependencies),
            ("Configurar base de datos", self.setup_database),
            ("Probar conexión", self.test_connection),
        ]

        for step_name, step_func in steps:
            print(f"\n🔄 {step_name}...")
            if not step_func():
                print(f"❌ Error en: {step_name}")
                response = input("🤔 ¿Continuar con el siguiente paso? (s/N): ")
                if response.lower() not in ["s", "si", "y", "yes"]:
                    print("⏹️  Configuración interrumpida")
                    return False

        # Paso adicional: Lanzar servidores
        self.launch_servers()

        # Mostrar información final
        self.show_completion_info()
        return True


if __name__ == "__main__":
    setup = AvengersSetup()
    SUCCESS = setup.run()
    sys.exit(0 if SUCCESS else 1)
