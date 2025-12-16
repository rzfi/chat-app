@echo off
echo ========================================
echo      SIMPLE CHAT APPLICATION
echo ========================================
echo.
echo Make sure MongoDB is running on localhost:27017
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Application URLs:
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
echo Network: http://192.168.112.110:3000
echo ========================================
echo.
echo Share the network URL with others to join!
echo.
pause