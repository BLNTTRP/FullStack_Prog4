from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
    imagen_url = Column(String, nullable=True)

    # Clave foránea a sí misma para permitir Subcategorías
    parent_id = Column(Integer, ForeignKey("categorias.id"), nullable=True)

    # Campos de auditoría (Borrado lógico)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relación recursiva para obtener el padre y los hijos fácilmente
    subcategorias = relationship("Categoria", backref="parent", remote_side=[id])

    # Relación con ProductoCategoria
    productos_asociados = relationship("ProductoCategoria", back_populates="categoria")