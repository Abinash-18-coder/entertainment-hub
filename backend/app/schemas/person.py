from typing import Optional
from pydantic import BaseModel, ConfigDict

class PersonResponse(BaseModel):
    id: int
    tmdb_id: int
    name: str
    profile_path: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CastCreditResponse(BaseModel):
    id: int
    character_name: Optional[str] = None
    order: int
    person: PersonResponse

    model_config = ConfigDict(from_attributes=True)