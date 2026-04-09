from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import Patient, MedicalRecord, User
from security import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = date.today()
    
    # Total Patients
    total_patients = db.query(Patient).count()
    
    # Total Records
    total_records = db.query(MedicalRecord).count()
    
    # New Patients Today
    new_patients_today = db.query(Patient).filter(func.date(Patient.created_at) == today).count()
    
    # Gender Stats
    gender_stats_query = db.query(Patient.gender, func.count(Patient.id)).group_by(Patient.gender).all()
    gender_stats = [{"gender": g, "count": c} for g, c in gender_stats_query]
    
    # Recent Patients for table
    recent_patients = db.query(Patient).order_by(Patient.created_at.desc()).limit(5).all()
    recent_patients_data = [{"id": p.id, "hn": p.hn, "full_name": p.full_name, "created_at": p.created_at} for p in recent_patients]
    
    return {
        "total_patients": total_patients,
        "total_records": total_records,
        "new_patients_today": new_patients_today,
        "gender_stats": gender_stats,
        "recent_patients": recent_patients_data
    }
