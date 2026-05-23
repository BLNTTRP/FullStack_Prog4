from __future__ import annotations

import json
from typing import List, Optional, cast

from sqlalchemy.sql import func
from sqlmodel import Session, col, select

from app.pedido.model import DetallePedido, Pedido
from app.pedido.schema import PedidoCreate
from app.producto.model import Producto

class PedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    # Consultas

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Pedido]:
        stmt = (
            select(Pedido)
            .where(col(Pedido.deleted_at).is_(None))
            .offset(skip)
            .limit(limit)
        )
        return cast(List[Pedido], self.session.exec(stmt).all())

    def get_by_id(self, pedido_id: int) -> Optional[Pedido]:
        stmt = select(Pedido).where(
            Pedido.id == pedido_id,
            col(Pedido.deleted_at).is_(None),
        )
        return cast(Optional[Pedido], self.session.exec(stmt).first())

    # Escritura

    def add(self, data: PedidoCreate) -> Pedido:
        """Crea el Pedido y sus DetallePedido en una sola unidad de trabajo."""
        subtotal = 0.0

        # Verificar que todos los productos existen y construir los detalles
        detalles_tmp: List[dict] = []
        for item in data.detalles:
            producto = cast(Optional[Producto], self.session.get(Producto, item.producto_id))
            if producto is None:
                raise ValueError(f"Producto con id={item.producto_id} no existe")
            linea_subtotal = round(producto.precio_base * item.cantidad, 2)
            subtotal += linea_subtotal
            detalles_tmp.append(
                {
                    "producto_id": item.producto_id,
                    "cantidad": item.cantidad,
                    "nombre_snapshot": producto.nombre,
                    "precio_snapshot": producto.precio_base,
                    "subtotal_snap": linea_subtotal,
                    "personalizacion": (
                        json.dumps(item.personalizacion)
                        if item.personalizacion
                        else None
                    ),
                }
            )

        subtotal = round(subtotal, 2)
        total = round(subtotal - data.descuento + data.costo_envio, 2)

        pedido = Pedido(
            usuario_id=data.usuario_id,
            direccion_id=data.direccion_id,
            forma_pago_codigo=data.forma_pago_codigo,
            notas=data.notas,
            subtotal=subtotal,
            descuento=data.descuento,
            costo_envio=data.costo_envio,
            total=total,
        )
        self.session.add(pedido)
        self.session.flush()  # obtiene pedido.id

        for d in detalles_tmp:
            self.session.add(DetallePedido(pedido_id=pedido.id, **d))

        return pedido

    def update(self, pedido_id: int, data: dict) -> Optional[Pedido]:
        pedido = self.get_by_id(pedido_id)
        if pedido is None:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(pedido, key, value)
        return pedido

    def soft_delete(self, pedido_id: int) -> Optional[Pedido]:
        pedido = self.get_by_id(pedido_id)
        if pedido:
            pedido.deleted_at = func.now()
        return pedido


class DetallePedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_pedido(self, pedido_id: int) -> List[DetallePedido]:
        stmt = select(DetallePedido).where(DetallePedido.pedido_id == pedido_id)
        return cast(List[DetallePedido], self.session.exec(stmt).all())

    def get_by_id(self, pedido_id: int, producto_id: int) -> Optional[DetallePedido]:
        stmt = select(DetallePedido).where(
            DetallePedido.pedido_id == pedido_id,
            DetallePedido.producto_id == producto_id,
        )
        return cast(Optional[DetallePedido], self.session.exec(stmt).first())