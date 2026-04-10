@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%brightcart-main\backend"

call "%BACKEND_DIR%\mvnw.cmd" -f "%BACKEND_DIR%\pom.xml" %*
if errorlevel 1 exit /b %errorlevel%

set "JAR_NAME=ecommerce-backend-0.0.1-SNAPSHOT.jar"
set "SOURCE_JAR=%BACKEND_DIR%\target\%JAR_NAME%"
set "TARGET_DIR=%SCRIPT_DIR%target"

if exist "%SOURCE_JAR%" (
  if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
  copy /Y "%SOURCE_JAR%" "%TARGET_DIR%\%JAR_NAME%" >nul
)
