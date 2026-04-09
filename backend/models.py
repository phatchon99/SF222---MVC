from sqlalchemy import Column, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(20), nullable=False, default='user')
    created_at = Column(DateTime, default=datetime.utcnow)

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=generate_uuid)
    hn = Column(String(20), unique=True, index=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(String(20), nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    blood_group = Column(String(5))
    congenital_disease = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete-orphan")

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    exam_date = Column(Date, nullable=False)
    symptoms = Column(Text, nullable=False)
    diagnosis = Column(Text, nullable=False)
    treatment = Column(Text)
    doctor_name = Column(String(100))
    note = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="medical_records")
