@echo off
setlocal

set "BASE_DIR=%~dp0"
if "%BASE_DIR:~-1%"=="\" set "BASE_DIR=%BASE_DIR:~0,-1%"
set "WRAPPER_DIR=%BASE_DIR%\.mvn\wrapper"
set "DIST_DIR=%WRAPPER_DIR%\dists"
set "ARCHIVE_NAME=apache-maven-3.9.9-bin.zip"
set "ARCHIVE_PATH=%DIST_DIR%\%ARCHIVE_NAME%"
set "MAVEN_HOME=%DIST_DIR%\apache-maven-3.9.9"
set "EXTRACT_DIR=%DIST_DIR%\.extract"
set "DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/%ARCHIVE_NAME%"

if not exist "%DIST_DIR%" mkdir "%DIST_DIR%"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  if not exist "%ARCHIVE_PATH%" (
    echo Downloading Maven 3.9.9...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%ARCHIVE_PATH%'"
    if errorlevel 1 exit /b 1
  )

  if exist "%EXTRACT_DIR%" rmdir /s /q "%EXTRACT_DIR%"
  mkdir "%EXTRACT_DIR%"

  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Expand-Archive -Path '%ARCHIVE_PATH%' -DestinationPath '%EXTRACT_DIR%' -Force"
  if errorlevel 1 exit /b 1

  if exist "%MAVEN_HOME%" rmdir /s /q "%MAVEN_HOME%"
  move "%EXTRACT_DIR%\apache-maven-3.9.9" "%MAVEN_HOME%" >nul
  rmdir /s /q "%EXTRACT_DIR%"
)

call "%MAVEN_HOME%\bin\mvn.cmd" %*
endlocal
