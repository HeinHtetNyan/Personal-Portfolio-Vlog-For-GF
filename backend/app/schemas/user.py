from pydantic import BaseModel, EmailStr
from datetime import datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class UserOut(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}
