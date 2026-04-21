from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.core.database import engine
from app.categoria.router import router as categoria_router
from app.producto.router import router as producto_router
from app.ingrediente.router import router as ingrediente_router
from app.categoria.model import Categoria
from app.ingrediente.model import Ingrediente
from app.producto.model import Producto, ProductoCategoria, ProductoIngrediente

# Crea todas las tablas en la base de datos
SQLModel.metadata.create_all(engine)

# Inicializamos la aplicación FastAPI
app = FastAPI(
    title="API Full Stack - Productos, Categorías, Ingredientes",
    description="Backend para el proyecto con React y FastAPI",
    version="3.0.0"
)

# Configuración de CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Añadimos el middleware a la aplicación
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos los enrutadores en la aplicación principal
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(ingrediente_router)

@app.get("/")
def ruta_raiz():
    return {"mensaje": "Bienvenido a la API de Productos, Categorías e Ingredientes"}