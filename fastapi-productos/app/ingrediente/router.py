from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.ingrediente import service, schema

router = APIRouter(prefix="/api/ingredientes", tags=["Ingredientes"])

@router.get("/", response_model=List[schema.IngredienteResponse])
def read_ingredientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service.get_ingredientes(db, skip=skip, limit=limit)

@router.get("/{ingrediente_id}", response_model=schema.IngredienteResponse)
def read_ingrediente(ingrediente_id: int, db: Session = Depends(get_db)):
    db_ingrediente = service.get_ingrediente(db, ingrediente_id=ingrediente_id)
    if db_ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return db_ingrediente

@router.post("/", response_model=schema.IngredienteResponse)
def create_ingrediente(ingrediente: schema.IngredienteCreate, db: Session = Depends(get_db)):
    return service.create_ingrediente(db=db, ingrediente=ingrediente)

@router.put("/{ingrediente_id}", response_model=schema.IngredienteResponse)
def update_ingrediente(ingrediente_id: int, ingrediente: schema.IngredienteCreate, db: Session = Depends(get_db)):
    db_ingrediente = service.update_ingrediente(db, ingrediente_id, ingrediente.model_dump())
    if db_ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return db_ingrediente

@router.delete("/{ingrediente_id}", response_model=schema.IngredienteResponse)
def delete_ingrediente(ingrediente_id: int, db: Session = Depends(get_db)):
    db_ingrediente = service.delete_ingrediente(db, ingrediente_id)
    if db_ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return db_ingrediente