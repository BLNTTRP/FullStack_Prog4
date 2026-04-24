from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlmodel import Session
from typing import List, Annotated
from app.core.database import get_db
from app.producto import service, schema

router = APIRouter(prefix="/api/productos", tags=["Productos"])

SessionDep = Annotated[Session, Depends(get_db)]

@router.get("/", response_model=List[schema.ProductoResponse])
def read_productos(
    db: SessionDep,
    skip: Annotated[int, Query(description="Registros a omitir", ge=0)] = 0,
    limit: Annotated[int, Query(description="Límite de registros a retornar", le=100)] = 100
):
    return service.get_productos(db, skip=skip, limit=limit)

@router.get("/{producto_id}", response_model=schema.ProductoResponse)
def read_producto(
        producto_id: Annotated[int, Path(description="ID del producto", ge=1)],
        db: SessionDep
):
    db_producto = service.get_producto(db, producto_id=producto_id)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.post("/", response_model=schema.ProductoResponse)
def create_producto(producto: schema.ProductoCreate, db: SessionDep):
    return service.create_producto(db=db, producto=producto)

@router.put("/{producto_id}", response_model=schema.ProductoResponse)
def update_producto(
        producto_id: Annotated[int, Path(description="ID del producto", ge=1)],
        producto: schema.ProductoCreate,
        db: SessionDep
):
    db_producto = service.update_producto(db, producto_id, producto.model_dump())
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.delete("/{producto_id}", response_model=schema.ProductoResponse)
def delete_producto(
        producto_id: Annotated[int, Path(description="ID del producto", ge=1)],
        db: SessionDep
):
    db_producto = service.delete_producto(db, producto_id)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto