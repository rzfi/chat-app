@echo off
echo Starting Chat Application...
echo.

echo 1. Starting MongoDB (make sure MongoDB is installed and running)
echo 2. Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo 3. Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause