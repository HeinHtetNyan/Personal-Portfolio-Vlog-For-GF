from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.post import Post, PostImage
from app.schemas.post import PostCreate, PostUpdate, PostOut, PostListItem, PaginatedPosts, PostImageOut, slugify
from pydantic import BaseModel
from app.core.deps import require_admin
import math

router = APIRouter(tags=["posts"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("/api/posts", response_model=PaginatedPosts)
def list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(9, ge=1, le=500),
    category: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Post).filter(Post.status == "published")
    if category:
        q = q.filter(Post.category == category)
    total = q.count()
    items = q.order_by(Post.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": max(1, math.ceil(total / per_page)),
    }


@router.get("/api/posts/{slug}", response_model=PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug, Post.status == "published").first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.views += 1
    db.commit()
    db.refresh(post)
    return post


# ── Admin ─────────────────────────────────────────────────────────────────────

@router.get("/api/admin/posts", response_model=list[PostListItem], dependencies=[Depends(require_admin)])
def admin_list_posts(
    status: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Post)
    if status:
        q = q.filter(Post.status == status)
    if category:
        q = q.filter(Post.category == category)
    return q.order_by(Post.created_at.desc()).all()


@router.get("/api/admin/posts/preview/{id}", response_model=PostOut, dependencies=[Depends(require_admin)])
def preview_post(id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/api/admin/posts", response_model=PostOut, dependencies=[Depends(require_admin)])
def create_post(body: PostCreate, db: Session = Depends(get_db)):
    slug = body.slug or slugify(body.title)
    # ensure uniqueness
    base, counter = slug, 1
    while db.query(Post).filter(Post.slug == slug).first():
        slug = f"{base}-{counter}"
        counter += 1
    post = Post(**body.model_dump(exclude={"slug"}), slug=slug)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/api/admin/posts/{id}", response_model=PostOut, dependencies=[Depends(require_admin)])
def update_post(id: int, body: PostUpdate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    data = body.model_dump(exclude_none=True)
    if "slug" in data and data["slug"] != post.slug:
        base, counter = slugify(data["slug"]), 1
        slug = base
        while db.query(Post).filter(Post.slug == slug, Post.id != id).first():
            slug = f"{base}-{counter}"
            counter += 1
        data["slug"] = slug
    for field, value in data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/api/admin/posts/{id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_post(id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()


class ImageUrlBody(BaseModel):
    image_url: str


@router.post("/api/admin/posts/{id}/images", response_model=PostImageOut, dependencies=[Depends(require_admin)])
def add_post_image(id: int, body: ImageUrlBody, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if len(post.images) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images per post")
    img = PostImage(post_id=id, image_url=body.image_url, sort_order=len(post.images))
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/api/admin/posts/{id}/images/{img_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_post_image(id: int, img_id: int, db: Session = Depends(get_db)):
    img = db.query(PostImage).filter(PostImage.id == img_id, PostImage.post_id == id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(img)
    db.commit()
