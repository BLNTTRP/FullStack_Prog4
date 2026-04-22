from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional

# Esquema base con los datos comunes
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None

# Esquema para crear
class CategoriaCreate(CategoriaBase):

    @field_validator("parent_id")
    @classmethod
    def prevent_zero_parent_id(cls, v):
        # Si el usuario envía un 0, lo transformamos en None (se guarda como null en DB)
        if v == 0:
            return None
        return v

# Esquema de respuesta
class CategoriaResponse(CategoriaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)