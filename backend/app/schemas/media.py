from pydantic import BaseModel
from datetime import datetime


class MediaOut(BaseModel):
    id: int
    file_url: str
    file_name: str
    file_type: str
    file_size: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
