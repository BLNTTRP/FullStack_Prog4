from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.categoria import service, schema

router = APIRouter(prefix="/api/categorias", tags=["Categorias"])

@router.get("/", response_model=List[schema.CategoriaResponse])
def read_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service.get_categorias(db, skip=skip, limit=limit)

@router.get("/{categoria_id}", response_model=schema.CategoriaResponse)
def read_categoria(categoria_id: int, db: Session = Depends(get_db)):
    db_categoria = service.get_categoria(db, categoria_id=categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria

@router.post("/", response_model=schema.CategoriaResponse)
def create_categoria(categoria: schema.CategoriaCreate, db: Session = Depends(get_db)):
    return service.create_categoria(db=db, categoria=categoria)

@router.put("/{categoria_id}", response_model=schema.CategoriaResponse)
def update_categoria(categoria_id: int, categoria: schema.CategoriaCreate, db: Session = Depends(get_db)):
    db_categoria = service.update_categoria(db, categoria_id, categoria.model_dump())
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria

@router.delete("/{categoria_id}", response_model=schema.CategoriaResponse)
def delete_categoria(categoria_id: int, db: Session = Depends(get_db)):
    db_categoria = service.delete_categoria(db, categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return db_categoria