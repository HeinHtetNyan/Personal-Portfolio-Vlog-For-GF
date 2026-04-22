from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    category: Optional[str] = "general"


class MessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str]
    message: str
    category: Optional[str]
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
