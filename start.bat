@echo off
echo Starting NeuroAge XAI Platform...

start "NeuroAge Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 /nobreak >nul
start "NeuroAge Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Platform running at:
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
