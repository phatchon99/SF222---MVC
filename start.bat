@echo off
echo ===================================================
echo   Starting Patient Management System (MVC)
echo ===================================================

echo Starting Backend Server (FastAPI)...
cd backend
start cmd /k ".\venv\Scripts\python -m uvicorn main:app --reload --port 8000"

cd ..
echo Starting Frontend Server (Next.js)...
cd frontend
start cmd /k "npm run dev"

echo Both servers started in new windows!
echo Please open: http://localhost:3000
pause
