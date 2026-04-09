import os
import sys
import datetime
# sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Patient

def seed():
    db = SessionLocal()
    patients = [
        Patient(
           hn="HN26001",
           full_name="สมหญิง รักดี",
           birth_date=datetime.date(1985, 5, 12),
           gender="female",
           phone="081-111-1111",
           address="123 ถ.สุขุมวิท กรุงเทพฯ",
           blood_group="O",
           congenital_disease="ความดันโลหิตสูง"
        ),
        Patient(
           hn="HN26002",
           full_name="สมชาย มั่นคง",
           birth_date=datetime.date(1990, 11, 23),
           gender="male",
           phone="082-222-2222",
           address="456 ถ.พหลโยธิน ปทุมธานี",
           blood_group="B",
           congenital_disease="ไม่มี"
        ),
        Patient(
           hn="HN26003",
           full_name="มารตี ศรีวิไล",
           birth_date=datetime.date(1978, 1, 5),
           gender="female",
           phone="083-333-3333",
           address="789 ถ.พระราม 2 สมุทรสาคร",
           blood_group="AB",
           congenital_disease="เบาหวาน"
        )
    ]
    
    for p in patients:
        db.add(p)
    db.commit()
    print("Successfully seeded 3 patients.")
    db.close()

if __name__ == "__main__":
    seed()
