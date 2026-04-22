from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.sql import func

if TYPE_CHECKING:
    from app.producto.model import ProductoCategoria

class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    nombre: str = Field(index=True)
    descripcion: Optional[str] = Field(default=None)
    imagen_url: Optional[str] = Field(default=None)

    # Clave foránea a sí misma para permitir Subcategorías
    parent_id: Optional[int] = Field(default=None, foreign_key="categorias.id")

    # Campos de auditoría (Borrado lógico)
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"server_default": func.now()})
    updated_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"onupdate": func.now()})
    deleted_at: Optional[datetime] = Field(default=None)

    # Relación recursiva para obtener el padre y los hijos fácilmente
    subcategorias: List["Categoria"] = Relationship(
        back_populates="parent"
    )
    parent: Optional["Categoria"] = Relationship(
        back_populates="subcategorias",
        sa_relationship_kwargs={"remote_side": "Categoria.id"}
    )

    # Relación con ProductoCategoria
    productos_asociados: List["ProductoCategoria"] = Relationship(back_populates="categoria")