from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


# TABLA INTERMEDIA: Producto <-> Categoria
class ProductoCategoria(Base):
    __tablename__ = "producto_categoria"

    producto_id = Column(Integer, ForeignKey("productos.id"), primary_key=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), primary_key=True)
    es_principal = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones hacia los modelos principales
    producto = relationship("Producto", back_populates="categorias_asociadas")
    categoria = relationship("Categoria", back_populates="productos_asociados")


# TABLA INTERMEDIA: Producto <-> Ingrediente
class ProductoIngrediente(Base):
    __tablename__ = "producto_ingrediente"

    producto_id = Column(Integer, ForeignKey("productos.id"), primary_key=True)
    ingrediente_id = Column(Integer, ForeignKey("ingredientes.id"), primary_key=True)
    es_removible = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    producto = relationship("Producto", back_populates="ingredientes_asociados")
    ingrediente = relationship("Ingrediente", back_populates="productos_asociados")


# MODELO PRINCIPAL: Producto
class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
    precio_base = Column(Float)
    imagenes_url = Column(JSON)
    disponible = Column(Boolean, default=True)
    stock_cantidad = Column(Integer, default=0)  # Nuevo campo

    # Campos de auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relaciones (conectan con las clases intermedias)
    categorias_asociadas = relationship("ProductoCategoria", back_populates="producto")
    ingredientes_asociados = relationship("ProductoIngrediente", back_populates="producto")