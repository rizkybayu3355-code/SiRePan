@echo off
echo ===================================================
echo Memulai Backend FastAPI & Frontend FoodSafety AI...
echo ===================================================

:: 1. Masuk ke folder backend dan jalankan Uvicorn
start cmd /k "cd backend && uvicorn main:app --reload"

:: 2. Tunggu 2 detik agar server FastAPI siap
timeout /t 2 /nobreak >nul

:: 3. Buka Frontend index.html secara otomatis di browser bawaan
start "" "%~dp0frontend\index.html"

echo Aplikasi berhasil dijalankan! Silakan lakukan demo presentasi.