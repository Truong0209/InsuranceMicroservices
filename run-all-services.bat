@echo off
echo ========================================================
echo   KHOI DONG HE THONG MICROSERVICES VA GIAO DIEN WEB
echo ========================================================
echo [1/4] Dang bat ProductService (Cong 5030)...
start "ProductService (Port 5030)" cmd /k "dotnet run --project ProductService\ProductService.csproj"

timeout /t 3 /nobreak >nul
echo [2/4] Dang bat ChatService (Cong 4099)...
start "ChatService (Port 4099)" cmd /k "dotnet run --project ChatService\ChatService.csproj"

timeout /t 3 /nobreak >nul
echo [3/4] Dang bat PaymentService (Cong 5070)...
start "PaymentService (Port 5070)" cmd /k "dotnet run --project PaymentService\PaymentService.csproj"

timeout /t 3 /nobreak >nul
echo [4/4] Dang bat Giao dien Web Portal (Cong 8081)...
start "WebUI (Port 8081)" cmd /k "dotnet run --project WebUI\WebUI.csproj"

echo ========================================================
echo   TAT CA CAC DICH VU DA DUOC KHOI DONG XONG!
echo   Trinh duyet se tu dong mo: http://127.0.0.1:8081/#/chat?demo=1
echo ========================================================
