from app.ingrediente.schema import IngredienteCreate
from app.core.unit_of_work import UnitOfWork

def get_ingredientes(uow: UnitOfWork, skip: int = 0, limit: int = 100):
    return uow.ingredientes.get_all(skip=skip, limit=limit)

def get_ingrediente(uow: UnitOfWork, ingrediente_id: int):
    return uow.ingredientes.get_by_id(ingrediente_id)

def create_ingrediente(uow: UnitOfWork, ingrediente: IngredienteCreate):
    db_ingrediente = uow.ingredientes.add(ingrediente)
    uow.commit()
    uow.refresh(db_ingrediente)
    return db_ingrediente

def update_ingrediente(uow: UnitOfWork, ingrediente_id: int, ingrediente_data: dict):
    db_ingrediente = uow.ingredientes.update(ingrediente_id, ingrediente_data)
    if db_ingrediente:
        uow.commit()
        uow.refresh(db_ingrediente)
    return db_ingrediente

def delete_ingrediente(uow: UnitOfWork, ingrediente_id: int):
    db_ingrediente = uow.ingredientes.soft_delete(ingrediente_id)
    if db_ingrediente:
        uow.commit()
        uow.refresh(db_ingrediente)
    return db_ingrediente