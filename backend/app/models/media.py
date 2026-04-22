from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.session import Base


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    file_url = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False, default="image")  # image|video
    file_size = Column(Integer, nullable=True)  # bytes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
