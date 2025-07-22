@echo off
chcp 65001 >nul
title Frontend - Avengers Colombia
echo Iniciando Frontend de Avengers Colombia...
echo.
echo Ejecutando desde directorio actual...
echo Ejecutando: python -m http.server 8000
python -m http.server 8000
pause
