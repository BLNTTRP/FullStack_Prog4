from sqlmodel import Session, select
from sqlalchemy.sql import func
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate

class CategoriaRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Categoria]:
        statement = (
            select(Categoria)
            .where(Categoria.deleted_at.is_(None))
            .offset(skip)
            .limit(limit)
        )
        return self.session.exec(statement).all()

    def get_by_id(self, categoria_id: int) -> Categoria | None:
        statement = select(Categoria).where(
            Categoria.id == categoria_id,
            Categoria.deleted_at.is_(None)
        )
        return self.session.exec(statement).first()

    def add(self, categoria: CategoriaCreate) -> Categoria:
        db_categoria = Categoria(**categoria.model_dump())
        self.session.add(db_categoria)
        return db_categoria

    def update(self, categoria_id: int, categoria_data: dict) -> Categoria | None:
        db_categoria = self.get_by_id(categoria_id)
        if db_categoria:
            for key, value in categoria_data.items():
                setattr(db_categoria, key, value)
        return db_categoria

    def soft_delete(self, categoria_id: int) -> Categoria | None:
        db_categoria = self.get_by_id(categoria_id)
        if db_categoria:
            db_categoria.deleted_at = func.now()
        return db_categoria