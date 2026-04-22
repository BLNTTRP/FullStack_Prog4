from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.sql import func

if TYPE_CHECKING:
    from app.producto.model import ProductoIngrediente

class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingredientes"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    nombre: str = Field(index=True)
    es_alergeno: bool = Field(default=False)

    # Campos de auditoría
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"server_default": func.now()})
    updated_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"onupdate": func.now()})
    deleted_at: Optional[datetime] = Field(default=None)

    # Relación con la tabla intermedia
    productos_asociados: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")