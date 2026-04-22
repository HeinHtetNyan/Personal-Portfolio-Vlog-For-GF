from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Work(Base):
    __tablename__ = "work"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    type = Column(String, nullable=False, default="dish")  # dish|restaurant|review
    location = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    images = relationship("WorkImage", back_populates="work", cascade="all, delete-orphan")


class WorkImage(Base):
    __tablename__ = "work_images"

    id = Column(Integer, primary_key=True, index=True)
    work_id = Column(Integer, ForeignKey("work.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

    work = relationship("Work", back_populates="images")
