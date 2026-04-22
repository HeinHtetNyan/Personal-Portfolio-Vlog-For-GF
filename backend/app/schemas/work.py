from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class WorkImageOut(BaseModel):
    id: int
    image_url: str
    sort_order: int

    model_config = {"from_attributes": True}


class WorkCreate(BaseModel):
    title: str
    description: Optional[str] = None
    notes: Optional[str] = None
    type: Literal["dish", "restaurant", "review"] = "dish"
    location: Optional[str] = None


class WorkUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    type: Optional[Literal["dish", "restaurant", "review"]] = None
    location: Optional[str] = None


class WorkOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    notes: Optional[str]
    type: str
    location: Optional[str]
    created_at: datetime
    images: list[WorkImageOut] = []

    model_config = {"from_attributes": True}
