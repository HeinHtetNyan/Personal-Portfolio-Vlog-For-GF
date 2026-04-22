import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_IMAGE = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_VIDEO = {"video/mp4", "video/webm", "video/quicktime"}
ALLOWED_TYPES = ALLOWED_IMAGE | ALLOWED_VIDEO

MAX_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


async def save_upload(file: UploadFile) -> dict:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    ext = Path(file.filename or "file").suffix.lower() or ".bin"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    dest = upload_path / unique_name

    with open(dest, "wb") as f:
        f.write(content)

    file_type = "video" if file.content_type in ALLOWED_VIDEO else "image"
    return {
        "file_url": f"/uploads/{unique_name}",
        "file_name": file.filename or unique_name,
        "file_type": file_type,
        "file_size": len(content),
    }


def delete_file(file_url: str) -> None:
    path = Path(settings.UPLOAD_DIR) / Path(file_url).name
    if path.exists():
        os.remove(path)
