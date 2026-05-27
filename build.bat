@echo off
echo Building LOST CARD...
echo.
g++ -std=c++17 -Wall -o lostcard main.cpp
if %errorlevel% neq 0 ( echo BUILD FAILED & pause & exit /b 1 )
echo.
echo  Build successful.
echo  Run: lostcard.exe
echo  (Both Default Mode and Custom Mode are inside)
echo.
pause
