from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Annotated
from app.core.unit_of_work import UnitOfWork, get_uow
from app.ingrediente import service, schema

router = APIRouter(prefix="/api/ingredientes", tags=["Ingredientes"])

UoWDep = Annotated[UnitOfWork, Depends(get_uow)]

@router.get("/", response_model=List[schema.IngredienteResponse])
def read_ingredientes(
    uow: UoWDep,
    skip: Annotated[int, Query(description="Registros a omitir", ge=0)] = 0,
    limit: Annotated[int, Query(description="Límite de registros a retornar", le=100)] = 100
):
    return service.get_ingredientes(uow, skip=skip, limit=limit)

@router.get("/{ingrediente_id}", response_model=schema.IngredienteResponse)
def read_ingrediente(
        ingrediente_id: Annotated[int, Path(description="ID del ingrediente", ge=1)],
        uow: UoWDep
):
    db_ingrediente = service.get_ingrediente(uow, ingrediente_id=ingrediente_id)
    if db_ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return db_ingrediente

@router.post("/", response_model=schema.IngredienteResponse)
def create_ingrediente(ingrediente: schema.IngredienteCreate, uow: UoWDep):
    return service.create_ingrediente(uow=uow, ingrediente=ingrediente)

@router.put("/{ingrediente_id}", response_model=schema.IngredienteResponse)
def update_ingrediente(
        ingrediente_id: Annotated[int, Path(description="ID del ingrediente", ge=1)],
        ingrediente: schema.IngredienteCreate,
        uow: UoWDep
):
    db_ingrediente = service.update_ingrediente(uow, ingrediente_id, ingrediente.model_dump())
    if db_ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return db_ingrediente

@router.delete("/{ingrediente_id}", response_model=schema.IngredienteResponse)
def delete_ingrediente(
        ingrediente_id: Annotated[int, Path(description="ID del ingrediente", ge=1)],
        uow: UoWDep
):
    db_ingrediente = service.delete_ingrediente(uow, ingrediente_id)
    if db_ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return db_ingrediente