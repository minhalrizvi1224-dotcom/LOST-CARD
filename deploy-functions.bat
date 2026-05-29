@echo off
echo.
echo ============================================================
echo  LOST CARD - Firebase Cloud Functions Deploy
echo  Sirf ek baar chalao — phir admin panel se keys add karo
echo ============================================================
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
  echo.
  echo  ERROR: Node.js nahi mila!
  echo  https://nodejs.org  — LTS version download karo phir dobara chalao.
  echo.
  pause
  exit /b 1
)

echo [2/4] Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
  echo Firebase CLI install kar raha hoon...
  npm install -g firebase-tools
)

echo [3/4] Firebase login...
firebase login

echo [4/4] Installing function dependencies + deploying...
cd functions
npm install
cd ..
firebase deploy --only functions

echo.
echo ============================================================
echo  DONE! Cloud Functions live hain.
echo.
echo  Agla step: Admin Panel mein jaao
echo  Settings tab mein apni Gemini + Groq API keys daalo.
echo  CF automatically wahan se keys parega — koi aur command
echo  nahi chahiye.
echo ============================================================
pause
