# 🛒 Backend - Gestión de Categorías, Productos e Ingredientes

Este es el backend del proyecto Full Stack de Gestión de Categorías, Productos e Ingredientes, desarrollado con **FastAPI** y **Python**. Provee una API RESTful para gestionar un sistema de productos y categorías con relaciones de base de datos (Muchos a Muchos).

## 🚀 Tecnologías Utilizadas

* **Framework:** FastAPI
* **Base de Datos:** PostgreSQL
* **ORM:** SQLModel
* **Validación de Datos:** Pydantic
* **Tipado Avanzado:** Uso de `Annotated` para dependencias y validaciones más limpias.
* **Servidor:** Uvicorn

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu computadora:
* **Python 3.8** o superior.
* **PostgreSQL:** El motor de base de datos instalado y corriendo.
* **pgAdmin 4 (Opcional pero recomendado):** Para gestionar la base de datos de forma visual.

---

## 🛠️ Configuración e Instalación

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

**1. Configurar variables de entorno**
Crea un archivo llamado `.env` en la raíz del proyecto y agrega la configuración de la base de datos:
```
POSTGRES_USER=postgres (o tu usuario seteado)
POSTGRES_PASSWORD=root (o tu contraseña seteada)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=productos_db
```

**2. Preparar la Base de Datos en pgAdmin 4**
Antes de levantar el servidor, necesitas crear la base de datos:
1. Abre **pgAdmin 4** y conéctate a tu servidor local de PostgreSQL.
2. Haz clic derecho sobre **Databases** > **Create** > **Database...**
3. En el campo **Database**, escribe el nombre: `productos_db` (o el nombre que prefieras usar en tu `.env`).
4. Haz clic en **Save**. El servidor de FastAPI (a través de SQLModel) se encargará de crear las tablas automáticamente cuando lo inicies.

**3. Crear y activar un entorno virtual (Recomendado)**
Es una buena práctica aislar las dependencias del proyecto.

* En Windows:
```bash
python -m venv venv
venv\Scripts\activate
```
* En macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

**4. Instalar las dependencias**
```bash
pip install -r requirements.txt
```

---

## 🏃‍♂️ Ejecución del Servidor
Para levantar el servidor de desarrollo, ejecuta el siguiente comando en la terminal:
```bash
uvicorn app.main:app --reload
```
El servidor estará disponible en: `http://localhost:8000`

---

## 📖 Documentación y Pruebas
FastAPI genera documentación interactiva automáticamente. Una vez que el servidor esté corriendo, puedes acceder a:
* **Swagger UI:** http://localhost:8000/docs (Ideal para probar los endpoints gráficamente).
* **ReDoc:** http://localhost:8000/redoc

**Archivo REST Client**
En la raíz del proyecto se incluye un archivo llamado `test_api.http`. Puedes utilizarlo con la extensión "REST Client" de Visual Studio Code para probar el CRUD completo de Productos, Categorías e Ingredientes, directamente desde tu editor de código.