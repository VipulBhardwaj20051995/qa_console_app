@echo off
echo Building Next.js app...
call npm run build

echo Adding Android platform...
call npx cap add android

echo Copying web assets...
call npx cap copy android

echo Opening Android Studio...
call npx cap open android

echo Build process completed!
pause 