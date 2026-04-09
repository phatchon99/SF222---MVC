from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import MedicalRecord, Patient, User
from schemas import MedicalRecordCreate, MedicalRecordResponse
from security import get_current_user

router = APIRouter(
    prefix="/records",
    tags=["Medical Records"]
)

@router.post("", response_model=MedicalRecordResponse)
def create_record(record: MedicalRecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == 'admin':
        raise HTTPException(status_code=403, detail="Admins are not allowed to create medical records")

    # Check if patient exists
    db_patient = db.query(Patient).filter(Patient.id == record.patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    record_data = record.model_dump()
    if 'doctor_name' in record_data:
        del record_data['doctor_name'] # Prevent client from specifying doctor name

    new_record = MedicalRecord(**record_data)
    new_record.doctor_name = current_user.name
        
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@router.get("/patient/{patient_id}", response_model=List[MedicalRecordResponse])
def get_patient_records(patient_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).order_by(MedicalRecord.exam_date.desc()).all()
    return records

@router.delete("/{record_id}")
def delete_record(record_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
         raise HTTPException(status_code=403, detail="Not authorized to delete records")
         
    db_record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}
