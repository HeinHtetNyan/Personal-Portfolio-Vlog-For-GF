from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, nullable=True)
    cover_image_url = Column(String, nullable=True)
    category = Column(String, nullable=False, default="personal")  # travel|food|vlog|personal
    status = Column(String, nullable=False, default="draft")        # draft|published
    views = Column(Integer, default=0, nullable=False)
    date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    images = relationship("PostImage", back_populates="post", cascade="all, delete-orphan")


class PostImage(Base):
    __tablename__ = "post_images"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

    post = relationship("Post", back_populates="images")
