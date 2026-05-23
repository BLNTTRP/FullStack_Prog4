from sqlmodel import Session
from app.core.database import engine
from app.categoria.repository import CategoriaRepository
from app.ingrediente.repository import IngredienteRepository
from app.producto.repository import ProductoRepository
from app.pedido.repository import PedidoRepository, DetallePedidoRepository

class UnitOfWork:
    """
    Gestiona una única sesión/transacción de base de datos
    y provee acceso a todos los repositorios.
    """

    def __init__(self):
        self.session: Session = Session(engine)
        self.categorias: CategoriaRepository = CategoriaRepository(self.session)
        self.ingredientes: IngredienteRepository = IngredienteRepository(self.session)
        self.productos: ProductoRepository = ProductoRepository(self.session)
        self.pedidos: PedidoRepository = PedidoRepository(self.session)
        self.detalles_pedido: DetallePedidoRepository = DetallePedidoRepository(self.session)

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()

    def refresh(self, instance):
        self.session.refresh(instance)

    def close(self):
        self.session.close()

    def __enter__(self) -> "UnitOfWork":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.rollback()
        else:
            self.commit()
        self.close()


# Dependencia para inyectar el UoW en los routers de FastAPI
def get_uow():
    uow = UnitOfWork()
    try:
        yield uow
    except Exception:
        uow.rollback()
        raise
    finally:
        uow.close()