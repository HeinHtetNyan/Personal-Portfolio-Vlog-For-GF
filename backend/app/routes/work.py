from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.models.work import Work, WorkImage
from app.models.media import Media
from app.schemas.work import WorkCreate, WorkUpdate, WorkOut
from app.services.storage import delete_file
from app.core.deps import require_admin


class ImageUrlBody(BaseModel):
    image_url: str

router = APIRouter(tags=["work"])


def _purge_media(db: Session, url: str) -> None:
    if not url:
        return
    media = db.query(Media).filter(Media.file_url == url).first()
    if media:
        delete_file(media.file_url)
        db.delete(media)


#Public 

@router.get("/api/work", response_model=list[WorkOut])
def list_work(type: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Work)
    if type:
        q = q.filter(Work.type == type)
    return q.order_by(Work.created_at.desc()).all()


@router.get("/api/work/{id}", response_model=WorkOut)
def get_work(id: int, db: Session = Depends(get_db)):
    work = db.query(Work).filter(Work.id == id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    return work


#Admin 

@router.post("/api/admin/work", response_model=WorkOut, dependencies=[Depends(require_admin)])
def create_work(body: WorkCreate, db: Session = Depends(get_db)):
    work = Work(**body.model_dump())
    db.add(work)
    db.commit()
    db.refresh(work)
    return work


@router.put("/api/admin/work/{id}", response_model=WorkOut, dependencies=[Depends(require_admin)])
def update_work(id: int, body: WorkUpdate, db: Session = Depends(get_db)):
    work = db.query(Work).filter(Work.id == id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(work, field, value)
    db.commit()
    db.refresh(work)
    return work


@router.delete("/api/admin/work/{id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_work(id: int, db: Session = Depends(get_db)):
    work = db.query(Work).filter(Work.id == id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    for img in work.images:
        _purge_media(db, img.image_url)
    db.delete(work)
    db.commit()


@router.post("/api/admin/work/{id}/images", response_model=WorkOut, dependencies=[Depends(require_admin)])
def add_work_image(id: int, body: ImageUrlBody, db: Session = Depends(get_db)):
    work = db.query(Work).filter(Work.id == id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    img = WorkImage(work_id=id, image_url=body.image_url, sort_order=len(work.images))
    db.add(img)
    db.commit()
    db.refresh(work)
    return work


@router.delete("/api/admin/work/{id}/images/{img_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_work_image(id: int, img_id: int, db: Session = Depends(get_db)):
    img = db.query(WorkImage).filter(WorkImage.id == img_id, WorkImage.work_id == id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    _purge_media(db, img.image_url)
    db.delete(img)
    db.commit()
