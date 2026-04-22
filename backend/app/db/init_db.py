from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.core.config import settings
from app.models.user import User


def init_db(db: Session) -> None:
    existing = db.query(User).filter(User.email == settings.FIRST_ADMIN_EMAIL).first()
    if not existing:
        admin = User(
            email=settings.FIRST_ADMIN_EMAIL,
            password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
            role="admin",
        )
        db.add(admin)
        db.commit()
        print(f"Created admin user: {settings.FIRST_ADMIN_EMAIL}")
