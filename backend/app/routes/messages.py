from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db.session import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageOut
from app.core.deps import require_admin

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["messages"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.post("/api/contact", response_model=MessageOut, status_code=201)
@limiter.limit("5/minute")
def contact(request: Request, body: MessageCreate, db: Session = Depends(get_db)):
    msg = Message(**body.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


# ── Admin ─────────────────────────────────────────────────────────────────────

@router.get("/api/admin/messages", response_model=list[MessageOut], dependencies=[Depends(require_admin)])
def list_messages(is_read: bool | None = None, db: Session = Depends(get_db)):
    q = db.query(Message)
    if is_read is not None:
        q = q.filter(Message.is_read == is_read)
    return q.order_by(Message.created_at.desc()).all()


@router.patch("/api/admin/messages/{id}", response_model=MessageOut, dependencies=[Depends(require_admin)])
def mark_read(id: int, db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/api/admin/messages/{id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_message(id: int, db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
