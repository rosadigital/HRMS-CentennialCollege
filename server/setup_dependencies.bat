@echo off
echo Installing HRMS server dependencies...

REM Upgrade pip first
pip install --upgrade pip

REM Install packages from requirements.txt
pip install -r requirements.txt

REM Additional package for Oracle
pip install python-oracledb==2.1.0

echo Dependency installation complete!
echo.
echo To run the application:
echo   python run.py
echo. 