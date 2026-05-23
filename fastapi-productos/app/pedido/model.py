from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.sql import func

if TYPE_CHECKING:
    from app.producto.model import Producto


# DetallePedido
class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    pedido_id: int = Field(
        foreign_key="pedidos.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    producto_id: int = Field(
        foreign_key="productos.id",
        primary_key=True,
        ondelete="RESTRICT"
    )

    cantidad: int = Field(ge=1)

    # Snapshot inmutable
    nombre_snapshot: str = Field(max_length=200)
    precio_snapshot: float = Field(ge=0.0)
    subtotal_snap: float

    personalizacion: Optional[str] = Field(
        default=None,
        description="IDs de ingredientes removidos"
    )

    created_at: Optional[datetime] = Field(
        default=None,
        sa_column_kwargs={"server_default": func.now()}
    )

    # Relaciones
    pedido: Optional["Pedido"] = Relationship(back_populates="detalles")
    producto: Optional["Producto"] = Relationship()


# Pedido
class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    # FKs
    usuario_id: int = Field()
    direccion_id: Optional[int] = Field(default=None)

    estado_codigo: str = Field(default="PENDIENTE", max_length=20)
    forma_pago_codigo: str = Field(max_length=20)

    # Snapshot monetario
    subtotal: float = Field(ge=0.0)
    descuento: float = Field(default=0.0, ge=0.0)
    costo_envio: float = Field(default=50.0, ge=0.0)
    total: float = Field(ge=0.0)

    notas: Optional[str] = Field(default=None)

    # Auditoria
    created_at: Optional[datetime] = Field(
        default=None,
        sa_column_kwargs={"server_default": func.now()}
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        sa_column_kwargs={"onupdate": func.now()}
    )
    deleted_at: Optional[datetime] = Field(default=None)

    # Composición 1..N con DetallePedido
    detalles: List["DetallePedido"] = Relationship(back_populates="pedido")