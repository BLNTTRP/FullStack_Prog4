from app.producto.schema import ProductoCreate
from app.core.unit_of_work import UnitOfWork


def get_productos(uow: UnitOfWork, skip: int = 0, limit: int = 100):
    return uow.productos.get_all(skip=skip, limit=limit)


def get_producto(uow: UnitOfWork, producto_id: int):
    return uow.productos.get_by_id(producto_id)


def create_producto(uow: UnitOfWork, producto: ProductoCreate):
    db_producto = uow.productos.add(producto)
    uow.commit()
    uow.refresh(db_producto)
    return db_producto


def update_producto(uow: UnitOfWork, producto_id: int, producto_data: dict):
    db_producto = uow.productos.update(producto_id, producto_data)
    if db_producto is None:
        return None
    uow.commit()
    uow.refresh(db_producto)
    return db_producto


def delete_producto(uow: UnitOfWork, producto_id: int):
    db_producto = uow.productos.soft_delete(producto_id)
    if db_producto:
        uow.commit()
        uow.refresh(db_producto)
    return db_producto