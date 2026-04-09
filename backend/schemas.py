from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional, List
import uuid

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = 'user'

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Medical Record Schemas
class MedicalRecordBase(BaseModel):
    exam_date: date
    symptoms: str
    diagnosis: str
    treatment: Optional[str] = None
    doctor_name: Optional[str] = None
    note: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    patient_id: str

class MedicalRecordResponse(MedicalRecordBase):
    id: str
    patient_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Patient Schemas
class PatientBase(BaseModel):
    hn: str
    full_name: str
    birth_date: date
    gender: str
    phone: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None
    congenital_disease: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None
    congenital_disease: Optional[str] = None

class PatientResponse(PatientBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PatientDetailResponse(PatientResponse):
    medical_records: List[MedicalRecordResponse] = []
