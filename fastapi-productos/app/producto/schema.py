from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.categoria.schema import CategoriaResponse
from app.ingrediente.schema import IngredienteResponse

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: List[str] = []
    disponible: bool = True
    stock_cantidad: int = 0

# Esquemas para recibir datos al CREAR un producto
class CategoriaAsignacion(BaseModel):
    categoria_id: int
    es_principal: bool = False

class IngredienteAsignacion(BaseModel):
    ingrediente_id: int
    es_removible: bool = True

class ProductoCreate(ProductoBase):
    categorias: List[CategoriaAsignacion] = []
    ingredientes: List[IngredienteAsignacion] = []

# Esquemas para ENVIAR datos en la respuesta
class ProductoCategoriaResponse(BaseModel):
    es_principal: bool
    categoria: CategoriaResponse

    model_config = ConfigDict(from_attributes=True)

class ProductoIngredienteResponse(BaseModel):
    es_removible: bool
    ingrediente: IngredienteResponse

    model_config = ConfigDict(from_attributes=True)

class ProductoResponse(ProductoBase):
    id: int
    categorias_asociadas: List[ProductoCategoriaResponse] = []
    ingredientes_asociados: List[ProductoIngredienteResponse] = []

    model_config = ConfigDict(from_attributes=True)