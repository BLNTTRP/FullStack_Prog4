from pydantic import BaseModel, ConfigDict

class IngredienteBase(BaseModel):
    nombre: str
    es_alergeno: bool = False

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteResponse(IngredienteBase):
    id: int

    model_config = ConfigDict(from_attributes=True)