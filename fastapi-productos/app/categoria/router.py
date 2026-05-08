from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Annotated
from app.core.unit_of_work import UnitOfWork, get_uow
from app.categoria import service, schema

router = APIRouter(prefix="/api/categorias", tags=["Categorias"])

UoWDep = Annotated[UnitOfWork, Depends(get_uow)]

@router.get("/", response_model=List[schema.CategoriaResponse])
def read_categorias(
    uow: UoWDep,
    skip: Annotated[int, Query(description="Registros a omitir", ge=0)] = 0,
    limit: Annotated[int, Query(description="Límite de registros a retornar", le=100)] = 100
):
    return service.get_categorias(uow, skip=skip, limit=limit)

@router.get("/{categoria_id}", response_model=schema.CategoriaResponse)
def read_categoria(
        categoria_id: Annotated[int, Path(description="ID de la categoría", ge=1)],
        uow: UoWDep
):
    db_categoria = service.get_categoria(uow, categoria_id=categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria

@router.post("/", response_model=schema.CategoriaResponse)
def create_categoria(categoria: schema.CategoriaCreate, uow: UoWDep):
    return service.create_categoria(uow=uow, categoria=categoria)

@router.put("/{categoria_id}", response_model=schema.CategoriaResponse)
def update_categoria(
        categoria_id: Annotated[int, Path(description="ID de la categoría", ge=1)],
        categoria: schema.CategoriaCreate,
        uow: UoWDep
):
    datos_actualizar = categoria.model_dump(exclude_unset=True)
    db_categoria = service.update_categoria(uow, categoria_id, datos_actualizar)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria

@router.delete("/{categoria_id}", response_model=schema.CategoriaResponse)
def delete_categoria(
        categoria_id: Annotated[int, Path(description="ID de la categoría", ge=1)],
        uow: UoWDep
):
    db_categoria = service.delete_categoria(uow, categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria