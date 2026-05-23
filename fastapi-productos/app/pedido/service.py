from __future__ import annotations

from fastapi import HTTPException

from app.core.unit_of_work import UnitOfWork
from app.pedido.schema import PedidoCreate, PedidoUpdate


# Pedido

def get_pedidos(uow: UnitOfWork, skip: int = 0, limit: int = 100):
    return uow.pedidos.get_all(skip=skip, limit=limit)


def get_pedido(uow: UnitOfWork, pedido_id: int):
    return uow.pedidos.get_by_id(pedido_id)


def create_pedido(uow: UnitOfWork, data: PedidoCreate):
    try:
        pedido = uow.pedidos.add(data)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    uow.commit()
    uow.refresh(pedido)
    return pedido


def update_pedido(uow: UnitOfWork, pedido_id: int, data: PedidoUpdate):
    # Excluimos los campos que no fueron enviados (None)
    update_data = data.model_dump(exclude_none=True)
    pedido = uow.pedidos.update(pedido_id, update_data)
    if pedido is None:
        return None
    uow.commit()
    uow.refresh(pedido)
    return pedido


def delete_pedido(uow: UnitOfWork, pedido_id: int):
    pedido = uow.pedidos.soft_delete(pedido_id)
    if pedido:
        uow.commit()
        uow.refresh(pedido)
    return pedido


# DetallePedido

def get_detalles_pedido(uow: UnitOfWork, pedido_id: int):
    return uow.detalles_pedido.get_by_pedido(pedido_id)


def get_detalle_pedido(uow: UnitOfWork, pedido_id: int, producto_id: int):
    return uow.detalles_pedido.get_by_id(pedido_id, producto_id)