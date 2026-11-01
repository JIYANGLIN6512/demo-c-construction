@echo off
REM 一条命令启动本地预览：双击本文件，或在命令行执行 start.cmd
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js 18+ first: https://nodejs.org
  pause
  exit /b 1
)
node serve.mjs 4173
pause
