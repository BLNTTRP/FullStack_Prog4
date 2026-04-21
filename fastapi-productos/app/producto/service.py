from sqlmodel import Session, select
from sqlalchemy.sql import func
from app.producto.model import Producto, ProductoCategoria, ProductoIngrediente
from app.producto.schema import ProductoCreate


def get_productos(db: Session, skip: int = 0, limit: int = 100):
    statement = select(Producto).where(Producto.deleted_at.is_(None)).offset(skip).limit(limit)
    return db.exec(statement).all()


def get_producto(db: Session, producto_id: int):
    statement = select(Producto).where(Producto.id == producto_id, Producto.deleted_at.is_(None))
    return db.exec(statement).first()


def create_producto(db: Session, producto: ProductoCreate):
    # Separamos los datos del producto de las listas de relaciones
    producto_data = producto.model_dump(exclude={"categorias", "ingredientes"})
    db_producto = Producto(**producto_data)

    # Guardamos el producto base. Usamos flush() para que la DB le asigne un ID
    # sin cerrar todavía la transacción (commit).
    db.add(db_producto)
    db.flush()

    # Guardamos las relaciones con categorías y sus atributos extra
    for cat_data in producto.categorias:
        assoc_cat = ProductoCategoria(
            producto_id=db_producto.id,
            categoria_id=cat_data.categoria_id,
            es_principal=cat_data.es_principal
        )
        db.add(assoc_cat)

    # Guardamos las relaciones con ingredientes
    for ing_data in producto.ingredientes:
        assoc_ing = ProductoIngrediente(
            producto_id=db_producto.id,
            ingrediente_id=ing_data.ingrediente_id,
            es_removible=ing_data.es_removible
        )
        db.add(assoc_ing)

    db.commit()
    db.refresh(db_producto)
    return db_producto


def update_producto(db: Session, producto_id: int, producto_data: dict):
    db_producto = get_producto(db, producto_id)
    if not db_producto:
        return None

    # Extraemos las listas de relaciones si vienen en el JSON
    categorias_data = producto_data.pop("categorias", None)
    ingredientes_data = producto_data.pop("ingredientes", None)

    # Actualizamos los campos básicos del producto (nombre, precio, etc.)
    for key, value in producto_data.items():
        setattr(db_producto, key, value)

        # Actualizamos categorías si se enviaron en la petición
        if categorias_data is not None:
            # Borramos las relaciones anteriores de la tabla intermedia
            statement_delete_cat = select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
            for rel in db.exec(statement_delete_cat).all():
                db.delete(rel)
            # Creamos y añadimos las nuevas
            for cat_data in categorias_data:
                assoc_cat = ProductoCategoria(
                    producto_id=producto_id,
                    categoria_id=cat_data["categoria_id"],
                    es_principal=cat_data["es_principal"]
                )
                db.add(assoc_cat)

        # Actualizamos ingredientes si se enviaron
        if ingredientes_data is not None:
            # Borramos las relaciones anteriores
            statement_delete_ing = select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
            for rel in db.exec(statement_delete_ing).all():
                db.delete(rel)
            # Creamos y añadimos las nuevas
            for ing_data in ingredientes_data:
                assoc_ing = ProductoIngrediente(
                    producto_id=producto_id,
                    ingrediente_id=ing_data["ingrediente_id"],
                    es_removible=ing_data["es_removible"]
                )
                db.add(assoc_ing)

    # Confirmamos todos los cambios (datos básicos + relaciones) en una sola transacción
    db.commit()
    db.refresh(db_producto)
    return db_producto


def delete_producto(db: Session, producto_id: int):
    db_producto = get_producto(db, producto_id)
    if db_producto:
        db_producto.deleted_at = func.now()  # Borrado Lógico
        db.commit()
        db.refresh(db_producto)
    return db_producto