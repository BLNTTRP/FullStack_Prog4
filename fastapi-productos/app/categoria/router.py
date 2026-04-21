from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from typing import List, Annotated
from app.core.database import get_db
from app.categoria import service, schema

router = APIRouter(prefix="/api/categorias", tags=["Categorias"])

SessionDep = Annotated[Session, Depends(get_db)]

@router.get("/", response_model=List[schema.CategoriaResponse])
def read_categorias(
    db: SessionDep,
    skip: Annotated[int, Query(description="Registros a omitir", ge=0)] = 0,
    limit: Annotated[int, Query(description="Límite de registros a retornar", le=100)] = 100
):
    return service.get_categorias(db, skip=skip, limit=limit)

@router.get("/{categoria_id}", response_model=schema.CategoriaResponse)
def read_categoria(categoria_id: int, db: SessionDep):
    db_categoria = service.get_categoria(db, categoria_id=categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria

@router.post("/", response_model=schema.CategoriaResponse)
def create_categoria(categoria: schema.CategoriaCreate, db: SessionDep):
    return service.create_categoria(db=db, categoria=categoria)

@router.put("/{categoria_id}", response_model=schema.CategoriaResponse)
def update_categoria(categoria_id: int, categoria: schema.CategoriaCreate, db: SessionDep):
    db_categoria = service.update_categoria(db, categoria_id, categoria.model_dump())
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria

@router.delete("/{categoria_id}", response_model=schema.CategoriaResponse)
def delete_categoria(categoria_id: int, db: SessionDep):
    db_categoria = service.delete_categoria(db, categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria