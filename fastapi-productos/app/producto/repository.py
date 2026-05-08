from typing import cast
from sqlmodel import Session, select, col
from sqlalchemy.sql import func
from app.producto.model import Producto, ProductoCategoria, ProductoIngrediente
from app.producto.schema import ProductoCreate


class ProductoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Producto]:
        statement = (
            select(Producto)
            .where(col(Producto.deleted_at).is_(None))
            .offset(skip)
            .limit(limit)
        )
        return cast(list[Producto], self.session.exec(statement).all())

    def get_by_id(self, producto_id: int) -> Producto | None:
        statement = select(Producto).where(
            Producto.id == producto_id,
            col(Producto.deleted_at).is_(None)
        )
        return cast(Producto | None, self.session.exec(statement).first())

    def add(self, producto: ProductoCreate) -> Producto:
        producto_data = producto.model_dump(exclude={"categorias", "ingredientes"})
        db_producto = Producto(**producto_data)
        self.session.add(db_producto)
        self.session.flush()  # Obtenemos el ID antes del commit

        for cat_data in producto.categorias:
            assoc_cat = ProductoCategoria(
                producto_id=db_producto.id,
                categoria_id=cat_data.categoria_id,
                es_principal=cat_data.es_principal
            )
            self.session.add(assoc_cat)

        for ing_data in producto.ingredientes:
            assoc_ing = ProductoIngrediente(
                producto_id=db_producto.id,
                ingrediente_id=ing_data.ingrediente_id,
                es_removible=ing_data.es_removible
            )
            self.session.add(assoc_ing)

        return db_producto

    def update(self, producto_id: int, producto_data: dict) -> Producto | None:
        db_producto = self.get_by_id(producto_id)
        if not db_producto:
            return None

        categorias_data = producto_data.pop("categorias", None)
        ingredientes_data = producto_data.pop("ingredientes", None)

        for key, value in producto_data.items():
            setattr(db_producto, key, value)

        if categorias_data is not None:
            stmt = select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
            for rel in self.session.exec(stmt).all():
                self.session.delete(rel)
            for cat_data in categorias_data or []:
                self.session.add(ProductoCategoria(
                    producto_id=producto_id,
                    categoria_id=cat_data["categoria_id"],
                    es_principal=cat_data["es_principal"]
                ))

        if ingredientes_data is not None:
            stmt = select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
            for rel in self.session.exec(stmt).all():
                self.session.delete(rel)
            for ing_data in ingredientes_data or []:
                self.session.add(ProductoIngrediente(
                    producto_id=producto_id,
                    ingrediente_id=ing_data["ingrediente_id"],
                    es_removible=ing_data["es_removible"]
                ))

        return db_producto

    def soft_delete(self, producto_id: int) -> Producto | None:
        db_producto = self.get_by_id(producto_id)
        if db_producto:
            db_producto.deleted_at = func.now()
        return db_producto