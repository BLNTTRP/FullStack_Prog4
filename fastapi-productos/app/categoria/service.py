from app.categoria.schema import CategoriaCreate
from app.core.unit_of_work import UnitOfWork

def get_categorias(uow: UnitOfWork, skip: int = 0, limit: int = 100):
    return uow.categorias.get_all(skip=skip, limit=limit)

def get_categoria(uow: UnitOfWork, categoria_id: int):
    return uow.categorias.get_by_id(categoria_id)

def create_categoria(uow: UnitOfWork, categoria: CategoriaCreate):
    db_categoria = uow.categorias.add(categoria)
    uow.commit()
    uow.refresh(db_categoria)
    return db_categoria

def update_categoria(uow: UnitOfWork, categoria_id: int, categoria_data: dict):
    db_categoria = uow.categorias.update(categoria_id, categoria_data)
    if db_categoria:
        uow.commit()
        uow.refresh(db_categoria)
    return db_categoria

def delete_categoria(uow: UnitOfWork, categoria_id: int):
    db_categoria = uow.categorias.soft_delete(categoria_id)
    if db_categoria:
        uow.commit()
        uow.refresh(db_categoria)
    return db_categoria