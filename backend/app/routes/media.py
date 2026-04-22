from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.media import Media
from app.schemas.media import MediaOut
from app.core.deps import require_admin
from app.services.storage import save_upload, delete_file

router = APIRouter(prefix="/api/admin/media", tags=["media"])


@router.post("/upload", response_model=MediaOut, dependencies=[Depends(require_admin)])
async def upload_media(file: UploadFile = File(...), db: Session = Depends(get_db)):
    result = await save_upload(file)
    media = Media(**result)
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.get("", response_model=list[MediaOut], dependencies=[Depends(require_admin)])
def list_media(db: Session = Depends(get_db)):
    return db.query(Media).order_by(Media.created_at.desc()).all()


@router.delete("/{id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_media(id: int, db: Session = Depends(get_db)):
    media = db.query(Media).filter(Media.id == id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    delete_file(media.file_url)
    db.delete(media)
    db.commit()
