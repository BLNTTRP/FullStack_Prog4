from sqlmodel import Session, select
from sqlalchemy.sql import func
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate

def get_categorias(db: Session, skip: int = 0, limit: int = 100):
    # Solo traemos las que NO están eliminadas
    statement = select(Categoria).where(Categoria.deleted_at.is_(None)).offset(skip).limit(limit)
    return db.exec(statement).all()

def get_categoria(db: Session, categoria_id: int):
    statement = select(Categoria).where(Categoria.id == categoria_id, Categoria.deleted_at.is_(None))
    return db.exec(statement).first()

def create_categoria(db: Session, categoria: CategoriaCreate):
    db_categoria = Categoria(**categoria.model_dump())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def update_categoria(db: Session, categoria_id: int, categoria_data: dict):
    db_categoria = get_categoria(db, categoria_id)
    if db_categoria:
        for key, value in categoria_data.items():
            setattr(db_categoria, key, value)
        db.commit()
        db.refresh(db_categoria)
    return db_categoria

def delete_categoria(db: Session, categoria_id: int):
    db_categoria = get_categoria(db, categoria_id)
    if db_categoria:
        # Borrado Lógico: Marcamos la fecha de eliminación en lugar de borrar el registro
        db_categoria.deleted_at = func.now()
        db.commit()
        db.refresh(db_categoria)
    return db_categoria