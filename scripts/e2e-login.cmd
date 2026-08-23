@echo off
setlocal
set BASE=http://localhost:3001
set JAR=%TEMP%\jt_cookies.txt
del "%JAR%" 2>nul

rem 1) Get CSRF token
for /f "tokens=2 delims=:,}" %%T in ('curl -s -c "%JAR%" %BASE%/api/auth/csrf') do set CSRF=%%T
set CSRF=%CSRF:"=%
echo CSRF=%CSRF%

rem 2) Post credentials to the dev provider callback
curl -s -o NUL -w "signin=%%{http_code}\n" -b "%JAR%" -c "%JAR%" ^
  -d "csrfToken=%CSRF%" ^
  -d "email=e2e@jobtracker.local" ^
  -d "name=E2E User" ^
  -d "callbackUrl=%BASE%/dashboard" ^
  %BASE%/api/auth/callback/dev

rem 3) Access protected dashboard with session cookie
curl -s -b "%JAR%" -o NUL -w "dashboard=%%{http_code}\n" %BASE%/dashboard
curl -s -b "%JAR%" %BASE%/dashboard | findstr /i "Dashboard Total Lamaran"
del "%JAR%" 2>nul
endlocal
