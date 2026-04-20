from pydantic import BaseModel, ConfigDict
from typing import Optional

# Esquema base con los datos comunes
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None

# Esquema para crear
class CategoriaCreate(CategoriaBase):
    pass

# Esquema de respuesta
class CategoriaResponse(CategoriaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)