import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

load_dotenv()

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "root")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "productos_db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

FINAL_DATABASE_URL = os.getenv("DATABASE_URL", DATABASE_URL)

engine = create_engine(FINAL_DATABASE_URL)

# Dependencia para que FastAPI abra y cierre la conexión en cada petición
def get_db():
    with Session(engine) as db:
        yield db