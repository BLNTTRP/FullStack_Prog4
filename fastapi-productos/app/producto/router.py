from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Annotated
from app.core.unit_of_work import UnitOfWork, get_uow
from app.producto import service, schema

router = APIRouter(prefix="/api/productos", tags=["Productos"])

UoWDep = Annotated[UnitOfWork, Depends(get_uow)]

@router.get("/", response_model=List[schema.ProductoResponse])
def read_productos(
    uow: UoWDep,
    skip: Annotated[int, Query(description="Registros a omitir", ge=0)] = 0,
    limit: Annotated[int, Query(description="Límite de registros a retornar", le=100)] = 100
):
    return service.get_productos(uow, skip=skip, limit=limit)

@router.get("/{producto_id}", response_model=schema.ProductoResponse)
def read_producto(
        producto_id: Annotated[int, Path(description="ID del producto", ge=1)],
        uow: UoWDep
):
    db_producto = service.get_producto(uow, producto_id=producto_id)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.post("/", response_model=schema.ProductoResponse)
def create_producto(producto: schema.ProductoCreate, uow: UoWDep):
    return service.create_producto(uow=uow, producto=producto)

@router.put("/{producto_id}", response_model=schema.ProductoResponse)
def update_producto(
        producto_id: Annotated[int, Path(description="ID del producto", ge=1)],
        producto: schema.ProductoCreate,
        uow: UoWDep
):
    db_producto = service.update_producto(uow, producto_id, producto.model_dump())
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.delete("/{producto_id}", response_model=schema.ProductoResponse)
def delete_producto(
        producto_id: Annotated[int, Path(description="ID del producto", ge=1)],
        uow: UoWDep
):
    db_producto = service.delete_producto(uow, producto_id)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto