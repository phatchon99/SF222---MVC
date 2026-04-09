from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database
from database import engine
from routers import auth, patients, records, dashboard, users

# Create Database tables
database.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Patient Management System",
    description="API for Patient Management System using FastAPI and SQLAlchemy",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000", 
    "*" # For dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(records.router)
app.include_router(dashboard.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Welcome to Patient Management System API"}
