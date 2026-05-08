from sqlmodel import Session, select
from sqlalchemy.sql import func
from app.ingrediente.model import Ingrediente
from app.ingrediente.schema import IngredienteCreate

class IngredienteRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Ingrediente]:
        statement = (
            select(Ingrediente)
            .where(Ingrediente.deleted_at.is_(None))
            .offset(skip)
            .limit(limit)
        )
        return self.session.exec(statement).all()

    def get_by_id(self, ingrediente_id: int) -> Ingrediente | None:
        statement = select(Ingrediente).where(
            Ingrediente.id == ingrediente_id,
            Ingrediente.deleted_at.is_(None)
        )
        return self.session.exec(statement).first()

    def add(self, ingrediente: IngredienteCreate) -> Ingrediente:
        db_ingrediente = Ingrediente(**ingrediente.model_dump())
        self.session.add(db_ingrediente)
        return db_ingrediente

    def update(self, ingrediente_id: int, ingrediente_data: dict) -> Ingrediente | None:
        db_ingrediente = self.get_by_id(ingrediente_id)
        if db_ingrediente:
            for key, value in ingrediente_data.items():
                setattr(db_ingrediente, key, value)
        return db_ingrediente

    def soft_delete(self, ingrediente_id: int) -> Ingrediente | None:
        db_ingrediente = self.get_by_id(ingrediente_id)
        if db_ingrediente:
            db_ingrediente.deleted_at = func.now()
        return db_ingrediente