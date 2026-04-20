from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.ingrediente.model import Ingrediente
from app.ingrediente.schema import IngredienteCreate

def get_ingredientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Ingrediente).filter(Ingrediente.deleted_at.is_(None)).offset(skip).limit(limit).all()

def get_ingrediente(db: Session, ingrediente_id: int):
    return db.query(Ingrediente).filter(Ingrediente.id == ingrediente_id, Ingrediente.deleted_at.is_(None)).first()

def create_ingrediente(db: Session, ingrediente: IngredienteCreate):
    db_ingrediente = Ingrediente(**ingrediente.model_dump())
    db.add(db_ingrediente)
    db.commit()
    db.refresh(db_ingrediente)
    return db_ingrediente

def update_ingrediente(db: Session, ingrediente_id: int, ingrediente_data: dict):
    db_ingrediente = get_ingrediente(db, ingrediente_id)
    if db_ingrediente:
        for key, value in ingrediente_data.items():
            setattr(db_ingrediente, key, value)
        db.commit()
        db.refresh(db_ingrediente)
    return db_ingrediente

def delete_ingrediente(db: Session, ingrediente_id: int):
    db_ingrediente = get_ingrediente(db, ingrediente_id)
    if db_ingrediente:
        db_ingrediente.deleted_at = func.now()
        db.commit()
        db.refresh(db_ingrediente)
    return db_ingrediente