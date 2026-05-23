from __future__ import annotations

import json
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


# DetallePedido

class DetallePedidoCreate(BaseModel):
    """Datos que el cliente envía para cada linea del pedido."""
    producto_id: int
    cantidad: int = Field(ge=1)
    personalizacion: Optional[List[int]] = None  # IDs de ingredientes removidos


class DetallePedidoResponse(BaseModel):
    pedido_id: int
    producto_id: int
    cantidad: int
    nombre_snapshot: str
    precio_snapshot: float
    subtotal_snap: float
    personalizacion: Optional[List[int]] = None
    created_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("personalizacion", mode="before")
    @classmethod
    def parse_personalizacion(cls, v):
        """Deserializa el JSON string almacenado en BD a List[int]."""
        if isinstance(v, str):
            return json.loads(v)
        return v

    @field_validator("created_at", mode="before")
    @classmethod
    def format_created_at(cls, v):
        if v is None:
            return None
        return str(v)


# Pedido

class PedidoCreate(BaseModel):
    """Payload para crear un pedido completo con sus detalles."""
    usuario_id: int
    direccion_id: Optional[int] = None
    forma_pago_codigo: str = Field(max_length=20)
    notas: Optional[str] = None
    descuento: float = Field(default=0.0, ge=0.0)
    costo_envio: float = Field(default=50.0, ge=0.0)
    detalles: List[DetallePedidoCreate] = Field(min_length=1)


class PedidoUpdate(BaseModel):
    """Campos actualizables de un pedido (no se pueden cambiar los detalles)"""
    estado_codigo: Optional[str] = Field(default=None, max_length=20)
    forma_pago_codigo: Optional[str] = Field(default=None, max_length=20)
    direccion_id: Optional[int] = None
    notas: Optional[str] = None
    descuento: Optional[float] = Field(default=None, ge=0.0)
    costo_envio: Optional[float] = Field(default=None, ge=0.0)


class PedidoResponse(BaseModel):
    id: int
    usuario_id: int
    direccion_id: Optional[int]
    estado_codigo: str
    forma_pago_codigo: str
    subtotal: float
    descuento: float
    costo_envio: float
    total: float
    notas: Optional[str]
    detalles: List[DetallePedidoResponse] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("created_at", "updated_at", mode="before")
    @classmethod
    def format_timestamps(cls, v):
        if v is None:
            return None
        return str(v)