from pydantic import BaseModel, field_validator
from typing import Optional, Literal
from datetime import datetime, date as DateField
import re


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)


class PostCreate(BaseModel):
    title: str
    content: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Literal["travel", "food", "vlog", "personal"] = "personal"
    status: Literal["draft", "published"] = "draft"
    slug: Optional[str] = None
    date: Optional[DateField] = None

    @field_validator("slug", mode="before")
    @classmethod
    def auto_slug(cls, v, info):
        if not v and info.data.get("title"):
            return slugify(info.data["title"])
        return v or ""


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Optional[Literal["travel", "food", "vlog", "personal"]] = None
    status: Optional[Literal["draft", "published"]] = None
    slug: Optional[str] = None
    date: Optional[DateField] = None


class PostImageOut(BaseModel):
    id: int
    image_url: str
    sort_order: int

    model_config = {"from_attributes": True}


class PostOut(BaseModel):
    id: int
    title: str
    slug: str
    content: Optional[str]
    cover_image_url: Optional[str]
    category: str
    status: str
    views: int
    date: Optional[DateField] = None
    created_at: datetime
    updated_at: datetime
    images: list[PostImageOut] = []

    model_config = {"from_attributes": True}


class PostListItem(BaseModel):
    id: int
    title: str
    slug: str
    cover_image_url: Optional[str]
    category: str
    status: str
    views: int
    date: Optional[DateField] = None
    created_at: datetime
    excerpt: Optional[str] = None

    model_config = {"from_attributes": True}


class PaginatedPosts(BaseModel):
    items: list[PostListItem]
    total: int
    page: int
    per_page: int
    pages: int
