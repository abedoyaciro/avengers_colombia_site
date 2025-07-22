@echo off
chcp 65001 >nul
title Backend - Avengers Colombia
echo Iniciando Backend de Avengers Colombia...
echo.
if not exist "backend" (
    echo ERROR: El directorio backend no existe
    pause
    exit /b 1
)
if not exist "backend\package.json" (
    echo ERROR: No se encuentra package.json en el directorio backend
    pause
    exit /b 1
)
echo Cambiando al directorio backend...
cd /d "backend"
echo Ejecutando: npm.cmd run dev
npm.cmd run dev
pause
