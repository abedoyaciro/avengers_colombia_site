#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🦸‍♂️ ================================== 🦸‍♀️"
echo "   AVENGERS COLOMBIA - SETUP AUTOMÁTICO"
echo "🦸‍♂️ ================================== 🦸‍♀️"
echo -e "${NC}"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 no encontrado${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "📋 Instala Python desde: https://python.org o usa: brew install python3"
    else
        echo "📋 Instala Python3 con: sudo apt install python3 python3-pip"
    fi
    exit 1
fi

echo -e "${GREEN}✅ Python3 encontrado${NC}"
echo "🚀 Ejecutando configuración automática..."
echo

# Ejecutar script principal
python3 setup.py

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error durante la configuración${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuración completada exitosamente${NC}"