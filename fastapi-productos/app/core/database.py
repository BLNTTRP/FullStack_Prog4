import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./productos.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Dependencia para que FastAPI abra y cierre la conexión en cada petición
def get_db():
    with Session(engine) as db:
        yield db