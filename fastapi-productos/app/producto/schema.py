from pydantic import BaseModel, ConfigDict, Field
from typing import List
from app.categoria.schema import CategoriaResponse
from app.ingrediente.schema import IngredienteResponse

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    disponible: bool = True
    # Usando Field(ge=0) nos aseguramos que sea mayor o igual a 0.
    precio_base: float = Field(..., ge=0.0, description="El precio debe ser 0 o mayor")
    stock_cantidad: int = Field(..., ge=0, description="El stock no puede ser negativo")

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