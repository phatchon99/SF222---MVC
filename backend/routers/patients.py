from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import Patient, User
from schemas import PatientCreate, PatientUpdate, PatientResponse, PatientDetailResponse
from security import get_current_user, get_current_admin

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

@router.get("/", response_model=List[PatientResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@router.post("/", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    # Check if HN exists
    db_patient = db.query(Patient).filter(Patient.hn == patient.hn).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="HN already registered")
        
    new_patient = Patient(**patient.model_dump())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.get("/{patient_id}", response_model=PatientDetailResponse)
def get_patient(patient_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, patient_update: PatientUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    update_data = patient_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
        
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}")
def delete_patient(patient_id: str, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    db.delete(db_patient)
    db.commit()
    return {"message": "Patient deleted successfully"}
