from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.sql import func
from app.categoria.model import Categoria
from app.ingrediente.model import Ingrediente

# TABLA INTERMEDIA: Producto <-> Categoria
class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    producto_id: int = Field(foreign_key="productos.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categorias.id", primary_key=True)
    es_principal: bool = Field(default=False)
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"server_default": func.now()})

    # Relaciones hacia los modelos principales
    producto: Optional["Producto"] = Relationship(back_populates="categorias_asociadas")
    categoria: Optional[Categoria] = Relationship(back_populates="productos_asociados")


# TABLA INTERMEDIA: Producto <-> Ingrediente
class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "producto_ingrediente"

    producto_id: int = Field(foreign_key="productos.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingredientes.id", primary_key=True)
    es_removible: bool = Field(default=True)
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"server_default": func.now()})

    producto: Optional["Producto"] = Relationship(back_populates="ingredientes_asociados")
    ingrediente: Optional[Ingrediente] = Relationship(back_populates="productos_asociados")


# MODELO PRINCIPAL: Producto
class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    nombre: str = Field(index=True)
    descripcion: Optional[str] = Field(default=None)
    precio_base: float = Field()
    disponible: bool = Field(default=True)
    stock_cantidad: int = Field(default=0)

    # Campos de auditoría
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"server_default": func.now()})
    updated_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"onupdate": func.now()})
    deleted_at: Optional[datetime] = Field(default=None)

    # Relaciones (conectan con las clases intermedias)
    categorias_asociadas: List["ProductoCategoria"] = Relationship(back_populates="producto")
    ingredientes_asociados: List["ProductoIngrediente"] = Relationship(back_populates="producto")