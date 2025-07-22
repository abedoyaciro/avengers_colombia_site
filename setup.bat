@echo off
chcp 65001 > nul
title Avengers Colombia - Setup Automático

echo.
echo 🦸‍♂️ ================================== 🦸‍♀️
echo    AVENGERS COLOMBIA - SETUP AUTOMÁTICO
echo 🦸‍♂️ ================================== 🦸‍♀️
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no encontrado. Descárgalo desde https://python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo 🚀 Ejecutando configuración automática...
echo.

python setup.py

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error durante la configuración
    pause
    exit /b 1
)

echo.
echo ✅ Configuración completada exitosamente
pause