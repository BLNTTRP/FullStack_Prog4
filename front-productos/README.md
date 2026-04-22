# 💻 Frontend - Interfaz de Gestión de Productos y Categorías

Este es el frontend del proyecto Full Stack de Gestión de Productos y Categorías, desarrollado con **React**, **TypeScript** y empaquetado con **Vite**. Su función principal es consumir la API del backend para realizar el CRUD completo de Categorías mediante la interfaz de usuario.

## 🚀 Tecnologías Utilizadas

* **Librería principal:** React 18
* **Lenguaje:** TypeScript
* **Build Tool:** Vite
* **Estilos:** Tailwind CSS
* **Manejo de Estado del Servidor:** React Query
* **Peticiones HTTP:** Fetch API nativo

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado:
* Node.js (versión 18 o superior recomendada).
* El backend de este proyecto (FastAPI) corriendo en el puerto 8000.

---

## 🛠️ Configuración e Instalación

Sigue estos pasos para levantar el entorno de desarrollo local:

**1. Instalar dependencias**
Abre una terminal en la raíz de esta carpeta y ejecuta:
```bash
npm install
```

**2. Ejecutar el servidor de desarrollo**
```bash
npm run dev
```
La aplicación estará disponible en tu navegador en: `http://localhost:5173`

---

## 🔗 Conexión con el Backend
Este frontend está configurado para conectarse al backend localmente en `http://localhost:8000/api/categorias`.
Asegúrate de iniciar el servidor de FastAPI primero para evitar errores de conexión (CORS) y poder visualizar, crear, editar y eliminar los datos en tiempo real.
