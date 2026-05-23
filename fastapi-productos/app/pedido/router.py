from __future__ import annotations

from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.core.unit_of_work import UnitOfWork, get_uow
from app.pedido import service
from app.pedido.schema import (
    DetallePedidoResponse,
    PedidoCreate,
    PedidoResponse,
    PedidoUpdate,
)

router = APIRouter(prefix="/api/pedido", tags=["Pedidos"])

UoWDep = Annotated[UnitOfWork, Depends(get_uow)]


# Pedido CRUD

@router.get("/", response_model=List[PedidoResponse])
def read_pedidos(
    uow: UoWDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    return service.get_pedidos(uow, skip=skip, limit=limit)


@router.get("/{id}", response_model=PedidoResponse)
def read_pedido(
    id: Annotated[int, Path(ge=1)],
    uow: UoWDep,
):
    pedido = service.get_pedido(uow, id)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


@router.post("/", response_model=PedidoResponse, status_code=201)
def create_pedido(data: PedidoCreate, uow: UoWDep):
    return service.create_pedido(uow, data)


@router.put("/{id}", response_model=PedidoResponse)
def update_pedido(
    id: Annotated[int, Path(ge=1)],
    data: PedidoUpdate,
    uow: UoWDep,
):
    pedido = service.update_pedido(uow, id, data)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


@router.delete("/{id}", response_model=PedidoResponse)
def delete_pedido(
    id: Annotated[int, Path(ge=1)],
    uow: UoWDep,
):
    pedido = service.delete_pedido(uow, id)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


# DetallePedido (sub-recurso, solo lectura)

@router.get("/{id}/detalles", response_model=List[DetallePedidoResponse])
def read_detalles(
    id: Annotated[int, Path(ge=1)],
    uow: UoWDep,
):
    """Devuelve todos los ítems de un pedido."""
    pedido = service.get_pedido(uow, id)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return service.get_detalles_pedido(uow, id)


@router.get("/{id}/detalles/{producto_id}", response_model=DetallePedidoResponse)
def read_detalle(
    id: Annotated[int, Path(ge=1)],
    producto_id: Annotated[int, Path(ge=1)],
    uow: UoWDep,
):
    """Devuelve el ítem de un producto específico dentro de un pedido."""
    detalle = service.get_detalle_pedido(uow, id, producto_id)
    if detalle is None:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle