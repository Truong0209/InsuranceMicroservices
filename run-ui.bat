@echo off
echo =======================================================
echo   KHOI DONG GIAO DIEN WEB INSURANCE SALES PORTAL (8081)
echo =======================================================
start http://127.0.0.1:8081/#/chat?demo=1
dotnet run --project WebUI\WebUI.csproj
pause
